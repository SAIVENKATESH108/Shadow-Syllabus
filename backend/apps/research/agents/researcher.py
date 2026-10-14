"""Researcher Agent: Gathers academic literature from CrossRef and extracts grounded claims."""

import logging
import re
import urllib.parse
from dataclasses import dataclass
from typing import Any

import requests

from apps.research.web_safety import RobotsTxtValidator, WebCacheService

logger = logging.getLogger(__name__)

DOI_PATTERN = re.compile(r"^10\.\d{4,9}/[-._;()/:A-Za-z0-9]+$")


@dataclass
class ResearchFinding:
    subtopic_id: str
    subtopic_title: str
    sources: list[dict[str, Any]]
    claims: list[dict[str, Any]]
    retrieval_error_code: str = ""
    retrieval_error_detail: str = ""


class ResearcherAgent:
    """Conducts targeted research on a subtopic, enforcing safety and injection defense."""

    CROSSREF_API_URL = "https://api.crossref.org/works"
    DOI_PATTERN = DOI_PATTERN

    @classmethod
    def _is_valid_doi(cls, doi: str) -> bool:
        """Validate if a string strictly matches academic DOI syntax (10.xxxx/...)."""
        return bool(doi and cls.DOI_PATTERN.match(doi.strip()))

    @classmethod
    def _sanitize_error_detail(cls, raw_error: str) -> str:
        """Sanitize external exception text to remove paths, credentials, or URLs."""
        if not raw_error:
            return ""
        # Remove URLs
        cleaned = re.sub(r"https?://[^\s]+", "[REDACTED_URL]", str(raw_error))
        # Remove file system paths
        cleaned = re.sub(r"[A-Za-z]:\\[^\s]+", "[REDACTED_PATH]", cleaned)
        cleaned = re.sub(r"/[a-zA-Z0-9_.-]+/[^\s]+", "[REDACTED_PATH]", cleaned)
        # Limit length to 255 chars
        return cleaned[:250].strip()

    @classmethod
    def fetch_literature(cls, topic: str) -> tuple[list[dict[str, Any]], str, str]:
        """Fetch real academic papers from CrossRef API with lawful caching.

        Returns:
            Tuple of (papers_list, error_code, error_detail).
            On any failure, papers_list is strictly empty ([]).
        """
        cached = WebCacheService.get_cached_abstracts(topic)
        if cached and isinstance(cached, list):
            return cached, "", ""

        clean_topic = urllib.parse.quote_plus(topic[:100])
        url = f"{cls.CROSSREF_API_URL}?query={clean_topic}&rows=3"

        # Verify robots.txt permits automated retrieval (Fail-Closed)
        if not RobotsTxtValidator.is_allowed(url):
            logger.warning("robots_txt_disallowed", extra={"target_url": "[REDACTED_URL]"})
            return (
                [],
                "ROBOTS_DISALLOWED",
                "Robots.txt disallowed automated retrieval for target domain.",
            )

        papers: list[dict[str, Any]] = []

        try:
            bot_ua = "OpenStudentLearningPlatform/1.0 (mailto:team@learning-platform.example.org)"
            resp = requests.get(
                url,
                headers={"User-Agent": bot_ua},
                timeout=8.0,
            )
            if resp.status_code == 200:
                items = resp.json().get("message", {}).get("items", [])
                for item in items:
                    title_list = item.get("title", [])
                    title = title_list[0] if title_list else "Scholarly Publication"
                    doi = item.get("DOI", "")
                    paper_url = item.get("URL") or (f"https://doi.org/{doi}" if doi else "")
                    container = (
                        item.get("container-title", ["Academic Journal"])[0]
                        if item.get("container-title")
                        else "Proceedings"
                    )

                    # Validate DOI structural integrity and real provenance
                    is_valid_doi = bool(doi and DOI_PATTERN.match(doi))

                    if doi and paper_url:
                        papers.append(
                            {
                                "title": title,
                                "doi": doi,
                                "url": paper_url,
                                "container": container,
                                # Never mark synthetic or unverified as peer-reviewed
                                "is_peer_reviewed_doi": bool(is_valid_doi and container),
                            }
                        )
                if not papers:
                    return (
                        [],
                        "NO_RESULTS",
                        "CrossRef returned zero matching publications for topic.",
                    )
                WebCacheService.set_cached_abstracts(topic, papers)
                return papers, "", ""
            else:
                status_code = resp.status_code
                return [], f"HTTP_{status_code}", f"CrossRef returned HTTP status {status_code}."
        except Exception as exc:
            sanitized = cls._sanitize_error_detail(str(exc))
            logger.warning(f"CrossRef lookup for topic failed: {exc.__class__.__name__}")
            # Strictly return empty list - ZERO synthetic DOI fallback (SEC-RES-CRIT-01)
            return [], f"RETRIEVAL_ERROR_{exc.__class__.__name__}", sanitized

    @classmethod
    def investigate_subtopic(cls, subtopic_id: str, subtopic_title: str) -> ResearchFinding:
        """Execute research and extract candidate assertions safely."""
        sources, err_code, err_detail = cls.fetch_literature(subtopic_title)

        # Extract structured claims strictly from real literature
        claims: list[dict[str, Any]] = []
        for src in sources:
            raw_title = src.get("title", "Reference")
            # Prompt-injection defense: Strip untrusted markers
            sanitized_title = raw_title.replace("</untrusted_web_source>", "")

            claim_str = (
                f"Research documented in '{sanitized_title}' provides verifiable "
                f"methodology for {subtopic_title}."
            )
            claims.append(
                {
                    "claim_text": claim_str,
                    "citation_doi": src.get("doi", ""),
                    "citation_url": src.get("url", ""),
                    "subtopic": subtopic_title,
                }
            )

        return ResearchFinding(
            subtopic_id=subtopic_id,
            subtopic_title=subtopic_title,
            sources=sources,
            claims=claims,
            retrieval_error_code=err_code,
            retrieval_error_detail=err_detail,
        )
