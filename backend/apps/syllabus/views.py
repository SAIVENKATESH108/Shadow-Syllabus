"""Views for Shadow Syllabus API endpoints."""
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework.views import APIView

from .models import Subject, SyllabusVersion, Topic, QuestionTopicMapping
from .serializers import SubjectSerializer, MappingEvidenceSerializer
from .services import (
    compute_recency_weights,
    detect_blind_spots_and_dormant,
    solve_time_budget_planner,
    get_accuracy_and_backtest_report,
)


class PlannerAnonRateThrottle(AnonRateThrottle):
    """Rate limit for unauthenticated study planner access: 10 requests / minute."""
    scope = "planner_anon"
    rate = "10/minute"


class PlannerUserRateThrottle(UserRateThrottle):
    """Rate limit for authenticated study planner access: 30 requests / minute."""
    scope = "planner_user"
    rate = "30/minute"


class SubjectListView(APIView):
    """List available academic subjects and universities."""

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        subjects = Subject.objects.select_related("university").prefetch_related("syllabus_versions").all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)


class TopicWeightageView(APIView):
    """Retrieve recency-weighted topic heatmap and ranking for a subject."""

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        subject_id = request.query_params.get("subject_id")
        subject_code = request.query_params.get("subject_code", "CS-204")
        half_life = float(request.query_params.get("half_life", "3.0"))

        if subject_id:
            version = (
                SyllabusVersion.objects.select_related("subject", "subject__university")
                .filter(subject_id=subject_id)
                .order_by("-year")
                .first()
            )
        elif subject_code:
            version = (
                SyllabusVersion.objects.select_related("subject", "subject__university")
                .filter(subject__code=subject_code)
                .order_by("-year")
                .first()
            )
        else:
            version = (
                SyllabusVersion.objects.select_related("subject", "subject__university")
                .order_by("-year")
                .first()
            )

        if not version:
            version = SyllabusVersion.objects.select_related("subject", "subject__university").first()

        if not version:
            return Response({"error": "No syllabus version found for subject"}, status=status.HTTP_404_NOT_FOUND)

        subject = version.subject
        weighted_topics = compute_recency_weights(version, current_year=2024, half_life=half_life)

        return Response({
            "subject": {
                "id": str(subject.id),
                "name": subject.name,
                "code": subject.code,
                "university": subject.university.name,
                "university_code": subject.university.code,
            },
            "syllabus_version": {
                "id": str(version.id),
                "label": version.label,
                "year": version.year,
                "total_marks": version.total_marks,
            },
            "parameters": {
                "half_life": half_life,
                "current_year": 2024,
                "decay_formula": "0.5 ** ((current_year - year) / H)",
            },
            "topics": weighted_topics,
        })


class BlindSpotsView(APIView):
    """List syllabus blind-spots and dormant questions with exam pattern risk notices."""

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        subject_code = request.query_params.get("subject_code", "CS-204")
        version = (
            SyllabusVersion.objects.select_related("subject", "subject__university")
            .filter(subject__code=subject_code)
            .order_by("-year")
            .first()
        )
        if not version:
            version = SyllabusVersion.objects.select_related("subject", "subject__university").first()

        if not version:
            return Response({"error": "No syllabus version found"}, status=status.HTTP_404_NOT_FOUND)

        report = detect_blind_spots_and_dormant(version, current_year=2024, dormant_years=3)
        return Response(report)


class TopicEvidenceView(APIView):
    """Retrieve full question provenance and OCR excerpts for a topic."""

    permission_classes = [AllowAny]

    def get(self, request: Request, topic_id: str) -> Response:
        topic = Topic.objects.filter(id=topic_id).first()
        if not topic:
            return Response({"error": "Topic not found"}, status=status.HTTP_404_NOT_FOUND)

        mappings = (
            QuestionTopicMapping.objects.filter(topic=topic)
            .select_related("question", "question__paper")
            .order_by("-question__paper__year")
        )
        serializer = MappingEvidenceSerializer(mappings, many=True)

        return Response({
            "topic": {
                "id": str(topic.id),
                "name": topic.name,
                "unit_no": topic.unit_no,
                "position": topic.position,
                "estimated_hours": topic.estimated_hours,
            },
            "total_mapped_questions": len(mappings),
            "evidence": serializer.data,
        })


class StudyPlannerView(APIView):
    """Solve 0/1 knapsack study planner given days left and hours per day."""

    permission_classes = [AllowAny]
    throttle_classes = [PlannerAnonRateThrottle, PlannerUserRateThrottle]

    def post(self, request: Request) -> Response:
        try:
            days_left = int(request.data.get("days_left", 10))
            hours_per_day = float(request.data.get("hours_per_day", 3.0))
        except (ValueError, TypeError):
            return Response({"error": "days_left and hours_per_day must be valid numeric values."}, status=status.HTTP_400_BAD_REQUEST)

        subject_code = request.data.get("subject_code", "CS-204")

        version = (
            SyllabusVersion.objects.select_related("subject", "subject__university")
            .filter(subject__code=subject_code)
            .order_by("-year")
            .first()
        )
        if not version:
            version = SyllabusVersion.objects.select_related("subject", "subject__university").first()

        if not version:
            return Response({"error": "No syllabus version found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            plan = solve_time_budget_planner(version, days_left=days_left, hours_per_day=hours_per_day)
            return Response(plan)
        except ValueError as err:
            return Response({"error": str(err)}, status=status.HTTP_400_BAD_REQUEST)


class AccuracyReportView(APIView):
    """Return empirical validation agreement and backtest benchmark numbers."""

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        strategy = request.query_params.get("strategy", "embeddings_only")
        report = get_accuracy_and_backtest_report(strategy=strategy)
        return Response(report)
