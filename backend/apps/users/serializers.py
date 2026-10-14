"""User and consent serializers."""
from rest_framework import serializers
from .models import ParentalConsentRecord, User


class UserSerializer(serializers.ModelSerializer):
    """Safe public/authenticated representation of a User."""

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "is_minor",
            "created_at",
        ]
        read_only_fields = ["id", "is_minor", "created_at"]


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Registration serializer ensuring password hashing and age determination."""

    password = serializers.CharField(write_only=True, min_length=10)
    guardian_email = serializers.EmailField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "first_name", "last_name", "role", "date_of_birth", "guardian_email"]

    def create(self, validated_data: dict) -> User:
        guardian_email = validated_data.pop("guardian_email", None)
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)

        # Flag as minor if date_of_birth is present and < 18
        if user.date_of_birth:
            from datetime import date
            today = date.today()
            age = today.year - user.date_of_birth.year - (
                (today.month, today.day) < (user.date_of_birth.month, user.date_of_birth.day)
            )
            if age < 18:
                user.is_minor = True
                user.save(update_fields=["is_minor"])
                if guardian_email:
                    ParentalConsentRecord.objects.create(
                        student=user,
                        guardian_email=guardian_email,
                    )
        return user


class ParentalConsentRecordSerializer(serializers.ModelSerializer):
    """Parental consent representation."""

    class Meta:
        model = ParentalConsentRecord
        fields = ["id", "student", "guardian_email", "is_verified", "verified_at", "created_at"]
        read_only_fields = ["id", "is_verified", "verified_at", "created_at"]
