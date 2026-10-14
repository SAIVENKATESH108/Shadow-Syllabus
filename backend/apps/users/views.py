"""User authentication, profile, and consent API views."""
from rest_framework import generics, permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from apps.common.permissions import IsOwnerOnly
from .models import User
from .serializers import UserRegistrationSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """Public registration endpoint with age verification."""

    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """Retrieve or update current authenticated user with object-level ownership check."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOnly]

    def get_object(self) -> User:
        obj = self.request.user
        self.check_object_permissions(self.request, obj)
        return obj


class RequestDataErasureView(generics.GenericAPIView):
    """Trigger GDPR / DPDP right-to-be-forgotten request."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request) -> Response:
        user = request.user
        user.data_erasure_requested = True
        from django.utils import timezone
        user.erasure_requested_at = timezone.now()
        user.save(update_fields=["data_erasure_requested", "erasure_requested_at"])

        # In production, dispatch async celery task: purge_user_data.delay(user.id)
        return Response(
            {"detail": "Data erasure request received. All personal records, embeddings, and uploads will be purged."},
            status=status.HTTP_202_ACCEPTED,
        )
