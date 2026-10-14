"""Common serializers and mixins."""
from typing import Any
from rest_framework import serializers


class UnverifiedContentSerializerMixin(serializers.Serializer):
    """Mixin explicitly tagging AI-generated or inferred content as unverified."""

    is_unverified = serializers.BooleanField(default=True, read_only=True)
    confidence_score = serializers.FloatField(required=False, allow_null=True)
    provenance = serializers.CharField(max_length=255, default="ai_gateway")

    def to_representation(self, instance: Any) -> dict[str, Any]:
        data = super().to_representation(instance)
        # Ensure is_unverified is always present and defaulted to True for AI data
        if "is_unverified" not in data:
            data["is_unverified"] = True
        return data
