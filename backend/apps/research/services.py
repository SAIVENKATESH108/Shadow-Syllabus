"""Research Orchestration Service enforcing atomic concurrency caps and run-scoped idempotency."""

import logging
import uuid
from datetime import timedelta
from typing import Any

from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import Throttled

from .agents.fact_checker import FactCheckerAgent
from .agents.orchestrator import OrchestratorAgent
from .agents.researcher import ResearcherAgent
from .agents.writer import WriterAgent
from .models import ResearchClaim, ResearchReport, ResearchSection, ResearchSource

logger = logging.getLogger(__name__)
User = get_user_model()


class ResearchOrchestrationService:
    """Manages research lifecycle, atomic concurrency limits, and run-scoped idempotency."""

    MAX_CONCURRENT_PER_USER = 3
    STALE_JOB_TIMEOUT_SECONDS = 900  # 15 minutes: stale active jobs are auto-reconciled to FAILED

    ACTIVE_STATUSES = [
        ResearchReport.Status.PENDING,
        ResearchReport.Status.ORCHESTRATING,
        ResearchReport.Status.RESEARCHING,
        ResearchReport.Status.FACT_CHECKING,
        ResearchReport.Status.WRITING,
    ]

    @classmethod
    def reconcile_stale_active_reports(cls, user: Any | None = None) -> int:
        """Mark active reports older than STALE_JOB_TIMEOUT_SECONDS as FAILED so slots are freed."""
        cutoff = timezone.now() - timedelta(seconds=cls.STALE_JOB_TIMEOUT_SECONDS)
        qs = ResearchReport.objects.filter(
            status__in=cls.ACTIVE_STATUSES,
            updated_at__lt=cutoff,
            is_deleted=False,
        )
        if user is not None:
            qs = qs.filter(user=user)

        updated = qs.update(
            status=ResearchReport.Status.FAILED,
            retrieval_error_code="STALE_JOB_TIMEOUT",
            retrieval_error_detail="Job timed out or worker crashed during pipeline execution.",
        )
        if updated:
            logger.warning(f"Reconciled {updated} stale research reports to FAILED state.")
        return updated

    @classmethod
    def touch_heartbeat(cls, report_id: str) -> None:
        """Update updated_at timestamp to renew worker lease and heartbeat for long-running pipelines."""
        ResearchReport.objects.filter(id=report_id).update(updated_at=timezone.now())

    @classmethod
    def create_research_inquiry(
        cls,
        user: Any,
        query: str,
        idempotency_key: str = "",
    ) -> ResearchReport:
        """Atomically validate concurrency limit and create a new inquiry."""
        with transaction.atomic():
            # 1. Lock requesting User row to serialize concurrent creation attempts
            User.objects.select_for_update().get(id=user.id)

            # 2. Check for idempotent replay if key provided
            if idempotency_key:
                existing = ResearchReport.objects.filter(
                    user=user,
                    idempotency_key=idempotency_key,
                    is_deleted=False,
                ).first()
                if existing:
                    return existing

            # 3. Reconcile stale jobs for this user
            cls.reconcile_stale_active_reports(user=user)

            # 4. Check active count excluding COMPLETED, FAILED, and deleted
            active_count = ResearchReport.objects.filter(
                user=user,
                status__in=cls.ACTIVE_STATUSES,
                is_deleted=False,
            ).count()

            if active_count >= cls.MAX_CONCURRENT_PER_USER:
                limit = cls.MAX_CONCURRENT_PER_USER
                raise Throttled(
                    detail=f"Concurrency limit reached: Maximum {limit} parallel "
                    "research tasks allowed per user."
                )

            # 5. Create report within the locked transaction
            report = ResearchReport.objects.create(
                user=user,
                query=query,
                status=ResearchReport.Status.PENDING,
                idempotency_key=idempotency_key,
                pipeline_run_id=uuid.uuid4(),
            )
            return report

    @classmethod
    def check_user_concurrency(cls, user: Any) -> None:
        """Stand-alone active count check raising Throttled (HTTP 429) if exhausted."""
        with transaction.atomic():
            User.objects.select_for_update().get(id=user.id)
            cls.reconcile_stale_active_reports(user=user)
            active_count = ResearchReport.objects.filter(
                user=user,
                status__in=cls.ACTIVE_STATUSES,
                is_deleted=False,
            ).count()

            if active_count >= cls.MAX_CONCURRENT_PER_USER:
                limit = cls.MAX_CONCURRENT_PER_USER
                raise Throttled(
                    detail=f"Concurrency limit reached: Maximum {limit} parallel "
                    "research tasks allowed per user."
                )

    @classmethod
    def execute_research_pipeline(
        cls,
        report_id: str,
        run_id: uuid.UUID | None = None,
    ) -> ResearchReport:
        """Run multi-agent DAG pipeline with run-scoped idempotency and report locks."""
        # Acquire row-level lock on the report to serialize concurrent executions
        with transaction.atomic():
            report = ResearchReport.objects.select_for_update().get(id=report_id)

            # Allocate deterministic or unique run identifier
            current_run_id = run_id or uuid.uuid4()
            prior_run_id = report.pipeline_run_id

            # If previous run was incomplete, remove ONLY artifacts from that incomplete run
            if report.status in [ResearchReport.Status.FAILED, ResearchReport.Status.PENDING]:
                report.sections.filter(created_by_run_id=prior_run_id).delete()
                report.sources.filter(created_by_run_id=prior_run_id).delete()
                report.claims.filter(created_by_run_id=prior_run_id).delete()
            # Note: If report was COMPLETED, do NOT supersede prior artifacts at start.
            # If the new run fails or crashes, prior completed artifacts remain active.
            # Prior artifacts will be atomically marked superseded only when the new run succeeds.

            # Set pipeline_run_id and transition to ORCHESTRATING
            report.pipeline_run_id = current_run_id
            report.status = ResearchReport.Status.ORCHESTRATING
            report.retrieval_error_code = ""
            report.retrieval_error_detail = ""
            report.save(
                update_fields=[
                    "pipeline_run_id",
                    "status",
                    "retrieval_error_code",
                    "retrieval_error_detail",
                    "updated_at",
                ]
            )

        try:
            # 1. Orchestration Phase
            subtopics = OrchestratorAgent.decompose(report.query)

            # 2. Research Phase
            report.status = ResearchReport.Status.RESEARCHING
            report.save(update_fields=["status", "updated_at"])
            findings = []
            all_claims = []
            retrieval_errors = []
            for subtopic in subtopics:
                finding = ResearcherAgent.investigate_subtopic(subtopic.id, subtopic.title)
                findings.append(finding)
                all_claims.extend(finding.claims)
                if finding.retrieval_error_code:
                    retrieval_errors.append(
                        (finding.retrieval_error_code, finding.retrieval_error_detail)
                    )

            # 3. Fact-Checking Phase
            report.status = ResearchReport.Status.FACT_CHECKING
            report.save(update_fields=["status", "updated_at"])
            evaluation = FactCheckerAgent.evaluate_claims(all_claims)

            # 4. Writing & Synthesis Phase (with abstain logic)
            report.status = ResearchReport.Status.WRITING
            report.save(update_fields=["status", "updated_at"])
            synthesized = WriterAgent.synthesize_report(report.query, findings, evaluation)

            # 5. Atomic Persistence Phase (Run-Scoped)
            with transaction.atomic():
                # Re-fetch with lock
                report = ResearchReport.objects.select_for_update().get(id=report_id)

                # Atomically supersede prior active artifacts from earlier completed runs
                now = timezone.now()
                report.sections.filter(is_superseded=False).exclude(
                    created_by_run_id=current_run_id
                ).update(
                    is_superseded=True, superseded_at=now, superseded_by_run_id=current_run_id
                )
                report.sources.filter(is_superseded=False).exclude(
                    created_by_run_id=current_run_id
                ).update(
                    is_superseded=True, superseded_at=now, superseded_by_run_id=current_run_id
                )
                report.claims.filter(is_superseded=False).exclude(
                    created_by_run_id=current_run_id
                ).update(
                    is_superseded=True, superseded_at=now, superseded_by_run_id=current_run_id
                )

                # Clean any uncommitted artifacts from this exact run
                report.sections.filter(created_by_run_id=current_run_id).delete()
                report.sources.filter(created_by_run_id=current_run_id).delete()
                report.claims.filter(created_by_run_id=current_run_id).delete()

                # Update report metadata
                report.title = synthesized.title
                report.summary = synthesized.summary
                report.status = ResearchReport.Status.COMPLETED
                report.is_unverified = True
                report.is_abstain = synthesized.is_abstain
                report.confidence_score = evaluation.confidence_score
                report.verified_claims_count = evaluation.verified_count
                report.total_claims_count = evaluation.total_count

                if retrieval_errors:
                    report.retrieval_error_code = retrieval_errors[0][0]
                    report.retrieval_error_detail = retrieval_errors[0][1]

                report.save(
                    update_fields=[
                        "title",
                        "summary",
                        "status",
                        "is_unverified",
                        "is_abstain",
                        "confidence_score",
                        "verified_claims_count",
                        "total_claims_count",
                        "retrieval_error_code",
                        "retrieval_error_detail",
                        "updated_at",
                    ]
                )

                # Persist sections tagged with run_id
                for sec in synthesized.sections:
                    ResearchSection.objects.create(
                        report=report,
                        created_by_run_id=current_run_id,
                        is_superseded=False,
                        title=sec.title,
                        order_index=sec.order_index,
                        content=sec.content,
                        citations=sec.citations,
                    )

                # Persist bibliography sources tagged with run_id
                for src in synthesized.sources:
                    ResearchSource.objects.create(
                        report=report,
                        created_by_run_id=current_run_id,
                        is_superseded=False,
                        title=src.get("title", ""),
                        url=src.get("url", ""),
                        doi=src.get("doi", ""),
                        container=src.get("container", ""),
                        is_peer_reviewed_doi=src.get("is_peer_reviewed_doi", False),
                    )

                # Persist evaluated claims tagged with run_id
                for eval_claim in evaluation.evaluations:
                    ResearchClaim.objects.create(
                        report=report,
                        created_by_run_id=current_run_id,
                        is_superseded=False,
                        claim_text=eval_claim.get("claim_text", ""),
                        subtopic=eval_claim.get("subtopic", ""),
                        status=eval_claim.get("status", "UNSUPPORTED"),
                        confidence=eval_claim.get("confidence", 0.0),
                        citation_doi=eval_claim.get("citation_doi", ""),
                        notes=eval_claim.get("notes", ""),
                    )

            return report

        except Exception as exc:
            logger.error(f"Research pipeline failed for report {report_id}: {exc}", exc_info=True)
            with transaction.atomic():
                report = ResearchReport.objects.select_for_update().get(id=report_id)
                report.status = ResearchReport.Status.FAILED
                report.retrieval_error_code = f"PIPELINE_ERROR_{exc.__class__.__name__}"
                report.retrieval_error_detail = str(exc)[:250]
                report.save(
                    update_fields=[
                        "status",
                        "retrieval_error_code",
                        "retrieval_error_detail",
                        "updated_at",
                    ]
                )
            raise exc
