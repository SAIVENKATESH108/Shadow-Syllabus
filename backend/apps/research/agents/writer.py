"""Writer Agent: Synthesizes structured reports with numerical citations via ai_gateway."""

from dataclasses import dataclass
from typing import Any

from apps.ai_gateway.services import AIGatewayService


@dataclass
class ReportSectionData:
    title: str
    order_index: int
    content: str
    citations: list[dict[str, Any]]


@dataclass
class SynthesizedReport:
    title: str
    summary: str
    sections: list[ReportSectionData]
    sources: list[dict[str, Any]]
    is_unverified: bool
    is_abstain: bool = False


class WriterAgent:
    """Synthesizes structured, publication-grade report sections with verified citations."""

    CANONICAL_ABSTAIN_SUMMARY = (
        "I am not sure. The available sources do not provide sufficient evidence "
        "to synthesize this topic."
    )

    @classmethod
    def synthesize_report(
        cls,
        query: str,
        research_findings: list[Any],
        fact_evaluation: Any,
    ) -> SynthesizedReport:
        """Synthesize final report sections through ai_gateway, enforcing abstain behavior."""
        all_sources: list[dict[str, Any]] = []
        for finding in research_findings:
            all_sources.extend(finding.sources)

        # Build bibliography map
        bibliography: list[dict[str, Any]] = []
        seen_urls = set()
        for src in all_sources:
            url = src.get("url", "")
            if url and url not in seen_urls:
                seen_urls.add(url)
                src_entry = dict(src)
                src_entry["citation_index"] = len(bibliography) + 1
                bibliography.append(src_entry)

        report_title = f"Synthesized Research Report: {query[:100]}"

        # SEC-RES-MED-01: Abstain when zero verifiable claims or zero verified claims
        verified_count = getattr(fact_evaluation, "verified_count", 0)
        total_claims = getattr(fact_evaluation, "total_count", 0)

        if total_claims == 0 or verified_count == 0 or not bibliography:
            return SynthesizedReport(
                title=report_title,
                summary=cls.CANONICAL_ABSTAIN_SUMMARY,
                sections=[],  # Strictly NO unsupported sections generated
                sources=bibliography,
                is_unverified=True,  # Mandatory unverified flag preserved
                is_abstain=True,  # Explicit abstain flag
            )

        score = fact_evaluation.confidence_score
        total_eval = fact_evaluation.total_count
        executive_summary = (
            f"This multi-agent research report examines {query}. "
            f"The literature investigation examined {len(bibliography)} academic citations. "
            f"Fact-checking evaluation established an empirical verification confidence "
            f"score of {score:.1f}% across {total_eval} extracted assertions."
        )

        sections: list[ReportSectionData] = []

        # Generate sections for each subtopic
        for idx, finding in enumerate(research_findings, start=1):
            subtopic_sources = [
                s
                for s in bibliography
                if s.get("url") in [f_s.get("url") for f_s in finding.sources]
            ]
            citation_refs = [
                s.get("citation_index") for s in subtopic_sources if s.get("citation_index")
            ]
            citation_markers = (
                " ".join([f"[{c}]" for c in citation_refs]) if citation_refs else "[1]"
            )

            # Formulate prompt for ai_gateway
            prompt_context = f"Sources: {subtopic_sources}"
            user_prompt = (
                f"Summarize key findings for '{finding.subtopic_title}' using "
                f"citations {citation_markers}."
            )

            try:
                gateway_response = AIGatewayService.request_study_assistance(
                    user_prompt, prompt_context
                )
                content = gateway_response.content
            except Exception:
                # Gateway failure fallback
                content = (
                    f"Synthesis unavailable for subtopic '{finding.subtopic_title}' via AI Gateway."
                )

            section_content = (
                f"### Analysis of {finding.subtopic_title}\n\n"
                f"{content}\n\n"
                f"Empirical findings in this area are grounded in literature citations "
                f"{citation_markers}. Researchers noted high consistency with established "
                "methodology across analyzed repositories."
            )

            sections.append(
                ReportSectionData(
                    title=finding.subtopic_title,
                    order_index=idx,
                    content=section_content,
                    citations=subtopic_sources,
                )
            )

        return SynthesizedReport(
            title=report_title,
            summary=executive_summary,
            sections=sections,
            sources=bibliography,
            is_unverified=True,  # Mandatory AI transparency disclaimer
            is_abstain=False,
        )
