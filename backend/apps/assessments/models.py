"""Assessment, submission, and coaching feedback models."""
from django.conf import settings
from django.db import models
from apps.common.models import BaseModel
from apps.courses.models import Course


class Assignment(BaseModel):
    """Assignment definition associated with a course."""

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="assignments")
    title = models.CharField(max_length=255)
    instructions = models.TextField()
    due_date = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.course.title}: {self.title}"


class Submission(BaseModel):
    """Student submission with strict owner tracking."""

    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="submissions")
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="submissions")
    submitted_text = models.TextField(blank=True)
    file_attachment_key = models.CharField(max_length=500, blank=True, help_text="S3 key for student uploaded document")

    def __str__(self) -> str:
        return f"Submission by {self.student_id} for {self.assignment_id}"


class Feedback(BaseModel):
    """Formative coaching feedback stamped with AI provenance."""

    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="feedback_entries")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="authored_feedback",
    )
    content = models.TextField()
    is_ai_generated = models.BooleanField(default=False)
    is_unverified = models.BooleanField(default=True, help_text="AI guidance is always unverified per constitution")

    def __str__(self) -> str:
        return f"Feedback on submission {self.submission_id} (Unverified={self.is_unverified})"
