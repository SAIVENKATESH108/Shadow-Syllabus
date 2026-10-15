"""Serializers for Shadow Syllabus API."""
from rest_framework import serializers
from .models import University, Subject, SyllabusVersion, Topic, Paper, Question, QuestionTopicMapping


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ["id", "name", "slug", "code"]


class SyllabusVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyllabusVersion
        fields = ["id", "label", "year", "total_marks"]


class SubjectSerializer(serializers.ModelSerializer):
    university = UniversitySerializer(read_only=True)
    syllabus_versions = SyllabusVersionSerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = ["id", "name", "code", "slug", "university", "syllabus_versions"]


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ["id", "name", "unit_no", "position", "estimated_hours", "parent"]


class QuestionEvidenceSerializer(serializers.ModelSerializer):
    year = serializers.IntegerField(source="paper.year", read_only=True)
    session = serializers.CharField(source="paper.session", read_only=True)
    paper_title = serializers.CharField(source="paper.__str__", read_only=True)

    class Meta:
        model = Question
        fields = ["id", "number", "marks", "section", "text_excerpt", "year", "session", "paper_title"]


class MappingEvidenceSerializer(serializers.ModelSerializer):
    question = QuestionEvidenceSerializer(read_only=True)

    class Meta:
        model = QuestionTopicMapping
        fields = ["id", "question", "confidence", "method", "rationale", "verified_by"]
