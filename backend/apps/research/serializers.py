"""Research serializers exposing verification confidence ratio and unverified markers."""

from typing import Any

from rest_framework import serializers

from apps.common.serializers import UnverifiedContentSerializerMixin

from .models import ResearchClaim, ResearchReport, ResearchSection, ResearchSource


class ResearchSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchSource
        fields = [
            "id",
            "title",
            "url",
            "doi",
            "container",
            "is_peer_reviewed_doi",
            "created_by_run_id",
            "is_superseded",
        ]


class ResearchSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchSection
        fields = [
            "id",
            "title",
            "order_index",
            "content",
            "citations",
            "created_by_run_id",
            "is_superseded",
        ]


class ResearchClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchClaim
        fields = [
            "id",
            "claim_text",
            "subtopic",
            "status",
            "confidence",
            "citation_doi",
            "notes",
            "created_by_run_id",
            "is_superseded",
        ]


class ResearchReportSerializer(UnverifiedContentSerializerMixin, serializers.ModelSerializer):
    sections = serializers.SerializerMethodField()
    sources = serializers.SerializerMethodField()
    claims = serializers.SerializerMethodField()
    confidence_display = serializers.SerializerMethodField()

    class Meta:
        model = ResearchReport
        fields = [
            "id",
            "query",
            "title",
            "summary",
            "status",
            "pipeline_run_id",
            "idempotency_key",
            "confidence_score",
            "confidence_display",
            "verified_claims_count",
            "total_claims_count",
            "is_unverified",
            "needs_review",
            "is_abstain",
            "retrieval_error_code",
            "retrieval_error_detail",
            "sections",
            "sources",
            "claims",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "pipeline_run_id",
            "confidence_score",
            "confidence_display",
            "verified_claims_count",
            "total_claims_count",
            "is_unverified",
            "needs_review",
            "is_abstain",
            "retrieval_error_code",
            "retrieval_error_detail",
            "created_at",
            "updated_at",
        ]

    def _should_include_superseded(self) -> bool:
        request = self.context.get("request")
        if request and hasattr(request, "query_params"):
            val = str(request.query_params.get("include_superseded", "")).lower()
            return val in ("true", "1", "yes")
        return bool(self.context.get("include_superseded", False))

    def get_sections(self, obj: ResearchReport) -> Any:
        qs = (
            obj.sections.all()
            if self._should_include_superseded()
            else obj.sections.filter(is_superseded=False)
        )
        return ResearchSectionSerializer(qs.order_by("order_index"), many=True).data

    def get_sources(self, obj: ResearchReport) -> Any:
        qs = (
            obj.sources.all()
            if self._should_include_superseded()
            else obj.sources.filter(is_superseded=False)
        )
        return ResearchSourceSerializer(qs, many=True).data

    def get_claims(self, obj: ResearchReport) -> Any:
        qs = (
            obj.claims.all()
            if self._should_include_superseded()
            else obj.claims.filter(is_superseded=False)
        )
        return ResearchClaimSerializer(qs, many=True).data

    def get_confidence_display(self, obj: ResearchReport) -> str:
        """Display confidence as claim-verification ratio per OpenAPI specification."""
        if obj.is_abstain:
            return "Abstained (0 verified claims)"
        total = obj.total_claims_count
        verified = obj.verified_claims_count
        score = obj.confidence_score
        return f"Verified {verified} of {total} extracted claims ({score:.1f}%)"


class CreateResearchInquirySerializer(serializers.Serializer):
    query = serializers.CharField(max_length=500, min_length=5, required=True)
    idempotency_key = serializers.CharField(
        max_length=64, required=False, allow_blank=True, default=""
    )
