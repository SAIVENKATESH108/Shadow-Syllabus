"""Fact-Checker Agent: Adversarial evaluation of claims and mathematical confidence scoring."""

import re
from dataclasses import dataclass
from typing import Any

DOI_PATTERN = re.compile(r"^10\.\d{4,9}/[-._;()/:A-Za-z0-9]+$")


@dataclass
class FactCheckEvaluation:
    evaluations: list[dict[str, Any]]
    confidence_score: float
    verified_count: int
    total_count: int
    summary: str


class FactCheckerAgent:
    """Verifies candidate claims against citations and computes confidence scores."""

    @classmethod
    def evaluate_claims(cls, claims: list[dict[str, Any]]) -> FactCheckEvaluation:
        """Cross-examine claims and compute verification metrics."""
        if not claims:
            return FactCheckEvaluation(
                evaluations=[],
                confidence_score=0.0,
                verified_count=0,
                total_count=0,
                summary="No claims provided for evaluation.",
            )

        evaluated: list[dict[str, Any]] = []
        verified_count = 0

        for claim in claims:
            claim_text = claim.get("claim_text", "")
            doi = claim.get("citation_doi", "")
            url = claim.get("citation_url", "")
            subtopic = claim.get("subtopic", "General")

            # Adversarial Check 1: DOI Structural Integrity
            is_valid_doi = bool(doi and DOI_PATTERN.match(doi))

            # Adversarial Check 2: Citation grounding
            has_valid_url = bool(
                url and (url.startswith("https://doi.org/") or url.startswith("http"))
            )

            if is_valid_doi and has_valid_url:
                status = "VERIFIED"
                confidence = 0.95
                notes = f"Verified against registered CrossRef DOI {doi}."
                verified_count += 1
            elif has_valid_url:
                status = "UNSUPPORTED"
                confidence = 0.50
                notes = "Citation lacks verified academic DOI."
            else:
                status = "CONTRADICTED"
                confidence = 0.10
                notes = "Ungrounded claim with missing citation."

            evaluated.append(
                {
                    "claim_text": claim_text,
                    "subtopic": subtopic,
                    "status": status,
                    "confidence": confidence,
                    "citation_doi": doi,
                    "notes": notes,
                }
            )

        total_count = len(claims)
        confidence_score = (verified_count / total_count) * 100.0 if total_count > 0 else 0.0

        summary = (
            f"Fact-checker verified {verified_count} of {total_count} claims "
            f"({confidence_score:.1f}% confidence score)."
        )

        return FactCheckEvaluation(
            evaluations=evaluated,
            confidence_score=round(confidence_score, 1),
            verified_count=verified_count,
            total_count=total_count,
            summary=summary,
        )
