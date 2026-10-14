"""Course and lesson API views enforcing object-level permissions."""
from rest_framework import permissions, viewsets
from apps.common.permissions import IsOwnerOrReadOnly
from .models import Course, Lesson
from .serializers import CourseSerializer, LessonSerializer


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet for managing courses with object-level instructor permissions."""

    queryset = Course.objects.filter(is_deleted=False)
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    lookup_field = "slug"

    def perform_create(self, serializer: CourseSerializer) -> None:
        serializer.save(instructor=self.request.user)


class LessonViewSet(viewsets.ModelViewSet):
    """ViewSet for managing lessons within a course."""

    queryset = Lesson.objects.filter(is_deleted=False)
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        course_slug = self.request.query_params.get("course_slug")
        if course_slug:
            qs = qs.filter(course__slug=course_slug)
        return qs
