"""Orchestrator Agent: Decomposes research queries into orthogonal subtopics."""

from dataclasses import dataclass


@dataclass
class Subtopic:
    id: str
    title: str
    description: str


class OrchestratorAgent:
    """Decomposes an academic inquiry into targeted, orthogonal research subtopics."""

    @classmethod
    def decompose(cls, query: str) -> list[Subtopic]:
        """Generate structured subtopics for parallel research."""
        # Clean and truncate query
        clean_query = query.strip()[:200]

        # Standard subtopic template matching Quorum's multi-perspective breakdown
        return [
            Subtopic(
                id="subtopic_fundamentals",
                title=f"Theoretical Foundations of {clean_query}",
                description=(
                    f"Investigate core principles, definitions, and theories of {clean_query}."
                ),
            ),
            Subtopic(
                id="subtopic_methodology",
                title=f"Contemporary Methodologies & Implementations in {clean_query}",
                description=(
                    f"Analyze techniques, empirical frameworks, and tooling for {clean_query}."
                ),
            ),
            Subtopic(
                id="subtopic_challenges",
                title=f"Open Challenges, Limitations & Future Directions of {clean_query}",
                description=(f"Synthesize empirical bottlenecks and constraints in {clean_query}."),
            ),
        ]
