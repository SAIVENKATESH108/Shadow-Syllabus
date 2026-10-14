"""Assessment views enforcing object-level ownership."""
from rest_framework import permissions, viewsets
from apps.common.permissions import IsOwnerOnly, IsOwnerOrReadOnly
from .models import Assignment, Feedback, Submission
from .serializers import AssignmentSerializer, FeedbackSerializer, SubmissionSerializer


class AssignmentViewSet(viewsets.ModelViewSet):
    """Assignments ViewSet."""

    queryset = Assignment.objects.filter(is_deleted=False)
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class SubmissionViewSet(viewsets.ModelViewSet):
    """Submissions ViewSet with strict object-level permissions (students access own records)."""

    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOnly]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Submission.objects.none()
        # Educators can view submissions for courses they teach; students only their own
        if getattr(user, "role", None) == "EDUCATOR":
            return Submission.objects.filter(assignment__course__instructor=user, is_deleted=False)
        return Submission.objects.filter(student=user, is_deleted=False)

    def perform_create(self, serializer: SubmissionSerializer) -> None:
        serializer.save(student=self.request.user)


class FeedbackViewSet(viewsets.ModelViewSet):
    """Feedback ViewSet."""

    queryset = Feedback.objects.filter(is_deleted=False)
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def perform_create(self, serializer: FeedbackSerializer) -> None:
        serializer.save(author=self.request.user)
