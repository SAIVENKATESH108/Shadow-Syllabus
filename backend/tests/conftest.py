"""Pytest synthetic data fixtures (No real personal data per Constitution A0)."""
import pytest
try:
    from rest_framework.test import APIClient
except ImportError:
    APIClient = None  # type: ignore

try:
    from apps.users.models import User
    from apps.courses.models import Course, Lesson
except Exception:
    User = None  # type: ignore
    Course = None  # type: ignore
    Lesson = None  # type: ignore


@pytest.fixture
def api_client():
    if APIClient:
        return APIClient()
    return None


@pytest.fixture
def synthetic_student(db: None) -> User:
    """Synthetic student user fixture."""
    return User.objects.create_user(
        email="synthetic.student.alpha@example.org",
        password="SafeSyntheticPassword123!",
        first_name="Synthetic",
        last_name="Learner",
        role=User.Role.STUDENT,
    )


@pytest.fixture
def synthetic_student_beta(db: None) -> User:
    """Second synthetic student user fixture to test object-level isolation."""
    return User.objects.create_user(
        email="synthetic.student.beta@example.org",
        password="SafeSyntheticPassword456!",
        first_name="SyntheticBeta",
        last_name="LearnerBeta",
        role=User.Role.STUDENT,
    )


@pytest.fixture
def synthetic_educator(db: None) -> User:
    """Synthetic educator user fixture."""
    return User.objects.create_user(
        email="synthetic.educator@example.org",
        password="SafeSyntheticPassword789!",
        first_name="Synthetic",
        last_name="Instructor",
        role=User.Role.EDUCATOR,
    )


@pytest.fixture
def synthetic_course(synthetic_educator: User) -> Course:
    """Synthetic course fixture."""
    return Course.objects.create(
        title="Synthetic Mathematics Fundamentals",
        slug="synthetic-math-fundamentals",
        description="A foundational course created with synthetic fixtures for testing.",
        instructor=synthetic_educator,
        is_published=True,
    )
