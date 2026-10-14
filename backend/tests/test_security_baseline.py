"""Security baseline validation tests (Appendix A.3 & Constitution)."""
import pytest
from rest_framework import status
from rest_framework.test import APIClient
from apps.ai_gateway.services import AIGatewayService
from apps.assessments.models import Assignment, Submission
from apps.courses.models import Course
from apps.users.models import User


@pytest.mark.django_db
def test_argon2_password_hasher_used(synthetic_student: User) -> None:
    """Validate that Argon2 is used for password hashing per Appendix A.3 baseline."""
    assert synthetic_student.password.startswith("argon2")


def test_ai_gateway_pii_scrubbing() -> None:
    """Validate that student PII is stripped prior to LLM dispatch."""
    dirty_prompt = "Hello my email is student.private@example.com and phone is +1-555-123-4567. Help me with calculus."
    sanitized = AIGatewayService.sanitize_prompt(dirty_prompt)

    assert "student.private@example.com" not in sanitized
    assert "[REDACTED_EMAIL]" in sanitized
    assert "+1-555-123-4567" not in sanitized
    assert "[REDACTED_PHONE]" in sanitized


def test_ai_gateway_unverified_tagging() -> None:
    """Validate that AI responses are strictly labeled as unverified."""
    response = AIGatewayService.request_study_assistance("Explain quadratic equations.")
    assert response.is_unverified is True
    assert response.provenance == "ai_gateway"


@pytest.mark.django_db
def test_object_level_permission_isolation(
    api_client: APIClient,
    synthetic_student: User,
    synthetic_student_beta: User,
    synthetic_course: Course,
) -> None:
    """Verify that Student Beta cannot read or modify Student Alpha's submission."""
    # Create assignment
    assignment = Assignment.objects.create(
        course=synthetic_course,
        title="Linear Algebra Exercise 1",
        instructions="Solve the matrix determinant.",
    )

    # Student Alpha creates a submission
    submission_alpha = Submission.objects.create(
        assignment=assignment,
        student=synthetic_student,
        submitted_text="Synthetic solution text by student alpha.",
    )

    # Authenticate as Student Beta
    api_client.force_authenticate(user=synthetic_student_beta)

    # Attempt to retrieve Student Alpha's submission
    detail_url = f"/api/v1/assessments/submissions/{submission_alpha.id}/"
    response = api_client.get(detail_url)

    # Must be 404 Not Found or 403 Forbidden under object-level scoping
    assert response.status_code in (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN)
