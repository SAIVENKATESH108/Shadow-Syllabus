"""AI Gateway views."""
from rest_framework import generics, permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from .serializers import AIStudyCoachRequestSerializer, AIStudyCoachResponseSerializer
from .services import AIGatewayService


class AIStudyCoachView(generics.GenericAPIView):
    """Endpoint mediating student interaction with AI models."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AIStudyCoachRequestSerializer

    def post(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_prompt = serializer.validated_data["prompt"]
        context = serializer.validated_data.get("context", "")

        ai_response = AIGatewayService.request_study_assistance(user_prompt, context)

        out_serializer = AIStudyCoachResponseSerializer(
            {
                "content": ai_response.content,
                "model_name": ai_response.model_name,
                "is_unverified": ai_response.is_unverified,
                "confidence_score": ai_response.confidence_score,
                "provenance": ai_response.provenance,
            }
        )

        return Response(out_serializer.data, status=status.HTTP_200_OK)
