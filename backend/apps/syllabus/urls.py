"""URLs for Shadow Syllabus API."""
from django.urls import path
from .views import (
    SubjectListView,
    TopicWeightageView,
    BlindSpotsView,
    TopicEvidenceView,
    StudyPlannerView,
    AccuracyReportView,
)

urlpatterns = [
    path("subjects/", SubjectListView.as_view(), name="syllabus-subjects"),
    path("topics/", TopicWeightageView.as_view(), name="syllabus-topics"),
    path("blind-spots/", BlindSpotsView.as_view(), name="syllabus-blind-spots"),
    path("evidence/<uuid:topic_id>/", TopicEvidenceView.as_view(), name="syllabus-topic-evidence"),
    path("planner/", StudyPlannerView.as_view(), name="syllabus-planner"),
    path("accuracy-report/", AccuracyReportView.as_view(), name="syllabus-accuracy-report"),
]
