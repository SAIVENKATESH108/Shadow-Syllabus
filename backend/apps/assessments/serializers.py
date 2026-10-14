"""Assessment serializers."""
from rest_framework import serializers
from apps.common.serializers import UnverifiedContentSerializerMixin
from .models import Assignment, Feedback, Submission


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ["id", "course", "title", "instructions", "due_date", "created_at"]
        read_only_fields = ["id", "created_at"]


class FeedbackSerializer(UnverifiedContentSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ["id", "submission", "author", "content", "is_ai_generated", "is_unverified", "created_at"]
        read_only_fields = ["id", "is_unverified", "created_at"]


class SubmissionSerializer(serializers.ModelSerializer):
    feedback_entries = FeedbackSerializer(many=True, read_only=True)

    class Meta:
        model = Submission
        fields = ["id", "assignment", "student", "submitted_text", "file_attachment_key", "feedback_entries", "created_at"]
        read_only_fields = ["id", "student", "created_at"]
