"""Research models ported from Quorum multi-agent pipeline."""

import uuid

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.common.models import BaseModel


class ResearchReport(BaseModel):
    """Synthesized research report produced by the multi-agent DAG."""

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        ORCHESTRATING = "ORCHESTRATING", "Orchestrating Subtopics"
        RESEARCHING = "RESEARCHING", "Researching Literature"
        FACT_CHECKING = "FACT_CHECKING", "Fact-Checking Claims"
        WRITING = "WRITING", "Synthesizing Report"
        COMPLETED = "COMPLETED", "Completed"
        FAILED = "FAILED", "Failed"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="research_reports"
    )
    query = models.CharField(max_length=500)
    title = models.CharField(max_length=255, blank=True)
    summary = models.TextField(blank=True)
    status = models.CharField(
        max_length=30, choices=Status.choices, default=Status.PENDING, db_index=True
    )

    # Idempotency and run scoping (SEC-RES-HIGH-01)
    idempotency_key = models.CharField(max_length=64, blank=True, db_index=True)
    pipeline_run_id = models.UUIDField(
        default=uuid.uuid4, db_index=True, help_text="Current pipeline execution run identifier"
    )

    # Fact-checking confidence metric (0.0% to 100.0%)
    confidence_score = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="Mathematical verification score from fact-checker",
    )
    verified_claims_count = models.PositiveIntegerField(default=0)
    total_claims_count = models.PositiveIntegerField(default=0)

    # Mandatory AI Disclaimers per Constitution A0
    is_unverified = models.BooleanField(
        default=True, help_text="AI synthesized reports are strictly unverified"
    )
    needs_review = models.BooleanField(default=True)

    # Explicit abstain state (SEC-RES-MED-01)
    is_abstain = models.BooleanField(
        default=False, help_text="True when insufficient verified evidence exists"
    )

    # Structured retrieval error tracking (SEC-RES-CRIT-01 / SEC-RES-HIGH-01)
    retrieval_error_code = models.CharField(
        max_length=50, blank=True, help_text="Standardized retrieval failure code"
    )
    retrieval_error_detail = models.CharField(
        max_length=255, blank=True, help_text="Sanitized, bounded failure detail"
    )

    class Meta:
        indexes = [
            models.Index(fields=["user", "status", "is_deleted"], name="res_rep_user_stat_idx"),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(confidence_score__gte=0.0)
                & models.Q(confidence_score__lte=100.0),
                name="res_rep_conf_score_range",
            ),
            models.UniqueConstraint(
                fields=["user", "idempotency_key"],
                condition=models.Q(idempotency_key__gt=""),
                name="res_rep_user_idem_uniq",
            ),
        ]

    def __str__(self) -> str:
        name = (self.title or self.query)[:50]
        return f"Report: {name} ({self.status}) - Score: {self.confidence_score:.1f}%"


class ResearchSection(BaseModel):
    """Structured report section with inline numerical citations."""

    report = models.ForeignKey(ResearchReport, on_delete=models.CASCADE, related_name="sections")
    created_by_run_id = models.UUIDField(default=uuid.uuid4, db_index=True)
    is_superseded = models.BooleanField(default=False, db_index=True)
    superseded_at = models.DateTimeField(null=True, blank=True)
    superseded_by_run_id = models.UUIDField(null=True, blank=True)

    title = models.CharField(max_length=255)
    order_index = models.PositiveIntegerField(default=0)
    content = models.TextField()
    citations = models.JSONField(default=list, help_text="List of citation references [1], [2]...")

    class Meta:
        ordering = ["order_index"]
        indexes = [
            models.Index(fields=["report", "created_by_run_id"], name="res_sec_rep_run_idx"),
            models.Index(fields=["report", "is_superseded"], name="res_sec_rep_sup_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.report.title} - Section {self.order_index}: {self.title}"


class ResearchSource(BaseModel):
    """Academic literature and web sources cited in the report."""

    report = models.ForeignKey(ResearchReport, on_delete=models.CASCADE, related_name="sources")
    created_by_run_id = models.UUIDField(default=uuid.uuid4, db_index=True)
    is_superseded = models.BooleanField(default=False, db_index=True)
    superseded_at = models.DateTimeField(null=True, blank=True)
    superseded_by_run_id = models.UUIDField(null=True, blank=True)

    title = models.CharField(max_length=500)
    url = models.URLField(max_length=1000)
    doi = models.CharField(max_length=255, blank=True)
    container = models.CharField(max_length=255, blank=True, help_text="Journal / Conference name")
    is_peer_reviewed_doi = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=["report", "created_by_run_id"], name="res_src_rep_run_idx"),
            models.Index(fields=["report", "is_superseded"], name="res_src_rep_sup_idx"),
        ]

    def __str__(self) -> str:
        return f"Source: {self.title[:60]} ({self.doi or self.url})"


class ResearchClaim(BaseModel):
    """Candidate claim extracted by researchers and evaluated by fact-checker."""

    class ClaimStatus(models.TextChoices):
        VERIFIED = "VERIFIED", "Verified"
        CONTRADICTED = "CONTRADICTED", "Contradicted"
        UNSUPPORTED = "UNSUPPORTED", "Unsupported"

    report = models.ForeignKey(ResearchReport, on_delete=models.CASCADE, related_name="claims")
    created_by_run_id = models.UUIDField(default=uuid.uuid4, db_index=True)
    is_superseded = models.BooleanField(default=False, db_index=True)
    superseded_at = models.DateTimeField(null=True, blank=True)
    superseded_by_run_id = models.UUIDField(null=True, blank=True)

    claim_text = models.TextField()
    subtopic = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20, choices=ClaimStatus.choices, default=ClaimStatus.UNSUPPORTED
    )
    confidence = models.FloatField(default=0.0)
    citation_doi = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["report", "created_by_run_id"], name="res_clm_rep_run_idx"),
            models.Index(fields=["report", "is_superseded"], name="res_clm_rep_sup_idx"),
        ]

    def __str__(self) -> str:
        return f"[{self.status}] {self.claim_text[:80]} (Confidence: {self.confidence:.2f})"
