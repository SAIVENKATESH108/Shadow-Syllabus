"""Shadow Syllabus Models: Academic hierarchy, question mapping, and weightage snapshots.

Implements the specification defined in Appendix C of the Master Plan.
"""
from django.db import models
from apps.common.models import BaseModel


class University(BaseModel):
    """Accredited university or institutional academic authority."""

    name = models.CharField(max_length=255, unique=True, db_index=True)
    slug = models.SlugField(max_length=255, unique=True)
    code = models.CharField(max_length=50, db_index=True)

    class Meta:
        verbose_name_plural = "Universities"
        ordering = ["name"]

    def __str__(self) -> str:
        return f"{self.name} ({self.code})"


class Subject(BaseModel):
    """Academic discipline/subject under a university."""

    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name="subjects")
    name = models.CharField(max_length=255, db_index=True)
    code = models.CharField(max_length=50, db_index=True)
    slug = models.SlugField(max_length=255)

    class Meta:
        unique_together = [("university", "code")]
        ordering = ["code"]

    def __str__(self) -> str:
        return f"{self.code}: {self.name} ({self.university.code})"


class SyllabusVersion(BaseModel):
    """Institutional syllabus version for a subject."""

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="syllabus_versions")
    label = models.CharField(max_length=255, help_text="e.g. 2022 CBCS Scheme")
    year = models.PositiveIntegerField(default=2022)
    total_marks = models.PositiveIntegerField(default=100)

    class Meta:
        ordering = ["-year"]

    def __str__(self) -> str:
        return f"{self.subject.code} - {self.label} ({self.year})"


class Topic(BaseModel):
    """Curriculum node in syllabus tree."""

    syllabus_version = models.ForeignKey(SyllabusVersion, on_delete=models.CASCADE, related_name="topics")
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="subtopics")
    name = models.CharField(max_length=255, db_index=True)
    unit_no = models.PositiveIntegerField(default=1, db_index=True)
    position = models.PositiveIntegerField(default=1)
    estimated_hours = models.FloatField(default=4.0)

    class Meta:
        ordering = ["unit_no", "position"]

    def __str__(self) -> str:
        return f"Unit {self.unit_no}.{self.position}: {self.name}"


class Paper(BaseModel):
    """Archived university examination question paper."""

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="papers")
    syllabus_version = models.ForeignKey(SyllabusVersion, on_delete=models.CASCADE, related_name="papers")
    year = models.PositiveIntegerField(db_index=True)
    session = models.CharField(max_length=50, default="May-June")
    max_marks = models.PositiveIntegerField(default=75)
    source_url = models.URLField(blank=True)
    licence_tag = models.CharField(max_length=100, default="Open Academic Archive")

    class Meta:
        ordering = ["-year", "session"]

    def __str__(self) -> str:
        return f"{self.subject.code} ({self.year} {self.session})"


class Question(BaseModel):
    """Individual question extracted from an archived exam paper."""

    paper = models.ForeignKey(Paper, on_delete=models.CASCADE, related_name="questions")
    number = models.CharField(max_length=50)
    parent_question = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="subquestions")
    marks = models.FloatField(default=5.0)
    section = models.CharField(max_length=50, default="Part A")
    is_choice_or = models.BooleanField(default=False, help_text="True if question is an OR-alternative choice")
    text_excerpt = models.TextField()
    text_hash = models.CharField(max_length=64, db_index=True)

    class Meta:
        ordering = ["paper", "number"]

    def __str__(self) -> str:
        return f"{self.paper} Q{self.number} ({self.marks}M)"


class QuestionTopicMapping(BaseModel):
    """Mapping relation linking an exam question to a syllabus topic."""

    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="topic_mappings")
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="question_mappings")
    confidence = models.FloatField(default=1.0)
    method = models.CharField(max_length=50, default="human_verified")  # model | embedding | human_verified
    rationale = models.TextField(blank=True)
    verified_by = models.CharField(max_length=100, default="Academic Reviewer")

    class Meta:
        unique_together = [("question", "topic")]

    def __str__(self) -> str:
        return f"Q{self.question.number} -> {self.topic.name} (conf={self.confidence})"


class WeightSnapshot(BaseModel):
    """Precomputed recency-weighted importance snapshot per topic."""

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="weight_snapshots")
    as_of_year = models.PositiveIntegerField(default=2024, db_index=True)
    half_life = models.FloatField(default=3.0)
    score = models.FloatField(default=0.0)
    weight = models.FloatField(default=0.0)
    appearances = models.PositiveIntegerField(default=0)
    last_year = models.PositiveIntegerField(null=True, blank=True)
    rank = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["rank"]

    def __str__(self) -> str:
        return f"{self.topic.name} (Rank #{self.rank}, Weight={self.weight:.2%})"
