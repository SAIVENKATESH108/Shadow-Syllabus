"""Course and curriculum models with pgvector integration."""
from django.conf import settings
from django.db import models
from apps.common.models import BaseModel

try:
    from pgvector.django import VectorField
except ImportError:
    # Graceful fallback for non-Postgres environments (e.g. basic SQLite tests)
    VectorField = None  # type: ignore


class Course(BaseModel):
    """Course metadata and curriculum container."""

    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="authored_courses")
    is_published = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.title


class Lesson(BaseModel):
    """Individual pedagogical lesson."""

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=1)
    content = models.TextField()

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.course.title} - {self.title}"


class CourseKnowledgeVector(BaseModel):
    """Chunked knowledge vectors stored in pgvector for RAG contextual retrieval."""

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="vectors")
    chunk_text = models.TextField()
    source_citation = models.CharField(max_length=500)

    if VectorField:
        embedding = VectorField(dimensions=1536, null=True, blank=True)
    else:
        embedding_json = models.TextField(null=True, blank=True)

    def __str__(self) -> str:
        return f"Vector for Lesson {self.lesson_id} ({self.source_citation[:50]})"
