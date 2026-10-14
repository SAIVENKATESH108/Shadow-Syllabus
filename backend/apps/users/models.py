"""User identity and privacy consent models (GDPR & DPDP Act)."""
import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from apps.common.models import BaseModel


class UserManager(BaseUserManager):
    """Custom manager for email-based authentication."""

    def create_user(self, email: str, password: str | None = None, **extra_fields: object) -> "User":
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault("username", email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str | None = None, **extra_fields: object) -> "User":
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.Role.ADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser, BaseModel):
    """Custom User model enforcing privacy minimization and minor protection."""

    class Role(models.TextChoices):
        STUDENT = "STUDENT", "Student"
        EDUCATOR = "EDUCATOR", "Educator"
        GUARDIAN = "GUARDIAN", "Guardian"
        ADMIN = "ADMIN", "Administrator"

    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT, db_index=True)

    # Minor Protection Flags (India DPDP Act 2023 Sec 9 & GDPR Art 8)
    is_minor = models.BooleanField(default=False, help_text="True if student is under statutory age of majority")
    date_of_birth = models.DateField(null=True, blank=True, help_text="Used solely for age verification; minimal retention")

    # Erasure tracking
    data_erasure_requested = models.BooleanField(default=False)
    erasure_requested_at = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self) -> str:
        return f"{self.email} ({self.role})"


class ParentalConsentRecord(BaseModel):
    """Verifiable parental consent record for minors under India's DPDP Act and GDPR."""

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="consent_records")
    guardian_email = models.EmailField()
    consent_token = models.CharField(max_length=128, unique=True, default=uuid.uuid4)
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    consent_method = models.CharField(max_length=50, default="email_link")

    def __str__(self) -> str:
        return f"Consent for {self.student.email} - Verified: {self.is_verified}"
