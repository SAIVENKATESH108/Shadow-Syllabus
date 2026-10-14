"""Course serializers."""
from rest_framework import serializers
from .models import Course, CourseKnowledgeVector, Lesson


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["id", "course", "title", "order", "content", "created_at"]
        read_only_fields = ["id", "created_at"]


class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ["id", "title", "slug", "description", "instructor", "is_published", "lessons", "created_at"]
        read_only_fields = ["id", "instructor", "created_at"]


class CourseKnowledgeVectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseKnowledgeVector
        fields = ["id", "lesson", "chunk_text", "source_citation", "created_at"]
        read_only_fields = ["id", "created_at"]
