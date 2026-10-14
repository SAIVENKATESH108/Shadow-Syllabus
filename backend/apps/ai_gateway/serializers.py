"""AI Gateway serializers."""
from rest_framework import serializers
from apps.common.serializers import UnverifiedContentSerializerMixin


class AIStudyCoachRequestSerializer(serializers.Serializer):
    """Input serializer for study assistance requests."""

    prompt = serializers.CharField(max_length=4000, required=True)
    context = serializers.CharField(max_length=8000, required=False, default="")


class AIStudyCoachResponseSerializer(UnverifiedContentSerializerMixin):
    """Output serializer stamped with unverified labels."""

    content = serializers.CharField()
    model_name = serializers.CharField()
