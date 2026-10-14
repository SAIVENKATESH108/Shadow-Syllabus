"""Research API views enforcing object-level permissions and atomic concurrency caps."""

from typing import Any

from django.conf import settings
from django.db import transaction
from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.common.permissions import IsOwnerOnly

from .models import ResearchReport
from .serializers import CreateResearchInquirySerializer, ResearchReportSerializer
from .services import ResearchOrchestrationService


@extend_schema(tags=["Research"])
class ResearchReportViewSet(viewsets.ModelViewSet):
    """ViewSet for managing research reports with strict object-level isolation."""

    serializer_class = ResearchReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOnly]

    def get_queryset(self) -> Any:
        user = self.request.user
        if not user.is_authenticated:
            return ResearchReport.objects.none()
        return ResearchReport.objects.filter(user=user, is_deleted=False)

    @extend_schema(
        summary="Create research inquiry",
        description=(
            "Submits a query to the multi-agent research pipeline with atomic concurrency limit "
            "validation (max 3 concurrent active tasks per user). Returns 429 Too Many Requests "
            "if quota/concurrency is exhausted."
        ),
        request=CreateResearchInquirySerializer,
        responses={
            201: ResearchReportSerializer,
            400: OpenApiResponse(description="Validation error in query or idempotency key"),
            401: OpenApiResponse(description="Authentication credentials were not provided"),
            429: OpenApiResponse(
                description="Too Many Requests: Maximum 3 parallel research tasks allowed per user"
            ),
        },
    )
    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """Create a new research inquiry with atomic concurrency limit validation."""
        serializer = CreateResearchInquirySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        query = serializer.validated_data["query"]
        idempotency_key = serializer.validated_data.get("idempotency_key", "")

        # 1. Atomically lock user row, validate concurrency cap, and initialize report
        report = ResearchOrchestrationService.create_research_inquiry(
            user=user,
            query=query,
            idempotency_key=idempotency_key,
        )

        # 2. Trigger pipeline execution (sync if eager/testing; strictly on_commit for async worker)
        if report.status == ResearchReport.Status.PENDING:
            if getattr(settings, "CELERY_TASK_ALWAYS_EAGER", True):
                ResearchOrchestrationService.execute_research_pipeline(str(report.id))
                report.refresh_from_db()
            else:
                from .tasks import run_research_pipeline_task
                transaction.on_commit(lambda: run_research_pipeline_task.delay(str(report.id)))

        out_serializer = self.get_serializer(report)
        return Response(out_serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Retrieve research report",
        description=(
            "Returns a research report and its verified/unverified artifacts. By default, "
            "only active current artifacts are returned. Pass include_superseded=true to "
            "inspect historical superseded artifacts from prior completed runs."
        ),
        parameters=[
            OpenApiParameter(
                name="include_superseded",
                type=bool,
                location=OpenApiParameter.QUERY,
                description="Include superseded historical artifacts from prior runs",
                default=False,
            )
        ],
        responses={
            200: ResearchReportSerializer,
            401: OpenApiResponse(description="Authentication required"),
            404: OpenApiResponse(description="Report not found or not owned by user"),
        },
    )
    def retrieve(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="List user research reports",
        description="Lists all non-deleted research reports owned by the authenticated user.",
        responses={
            200: ResearchReportSerializer(many=True),
            401: OpenApiResponse(description="Authentication required"),
        },
    )
    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Rerun research pipeline",
        description=(
            "Triggers a rerun of the research pipeline for an existing report. Prior completed "
            "artifacts remain active until the new run succeeds, at which point they are "
            "atomically marked superseded. Enforces per-user concurrency limit."
        ),
        request=None,
        responses={
            200: ResearchReportSerializer,
            401: OpenApiResponse(description="Authentication required"),
            404: OpenApiResponse(description="Report not found or not owned by user"),
            429: OpenApiResponse(
                description="Too Many Requests: Maximum 3 parallel research tasks allowed per user"
            ),
        },
    )
    @action(detail=True, methods=["post"])
    def rerun(self, request: Request, pk: str | None = None) -> Response:
        """Rerun research pipeline for an existing report with audit supersession."""
        report = self.get_object()
        ResearchOrchestrationService.check_user_concurrency(request.user)
        if getattr(settings, "CELERY_TASK_ALWAYS_EAGER", True):
            ResearchOrchestrationService.execute_research_pipeline(str(report.id))
            report.refresh_from_db()
        else:
            from .tasks import run_research_pipeline_task
            transaction.on_commit(lambda: run_research_pipeline_task.delay(str(report.id)))
        return Response(self.get_serializer(report).data)
