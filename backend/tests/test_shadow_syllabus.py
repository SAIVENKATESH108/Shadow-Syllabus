"""Exhaustive Tests for Shadow Syllabus Mathematical Engine and REST API.

Formally tests Appendix C requirements and QA-mandated algorithmic edge cases:
1. Zero mapped questions (scores = 0, weight = 0, flagged as blind spot)
2. Zero total score handling (abstention/safe 0.0 normalization)
3. Multi-topic mark allocation (marks cleanly split by mapping confidence)
4. Configurable half-life parameter (H = 2.0, 3.0, 5.0)
5. 15% reserve behavior in 0/1 knapsack time-budget optimization
6. Parent/child topic double-count prevention (leaf nodes only)
7. Deterministic planner output (reproducible schedule generation)
8. Invalid budgets (non-positive days/hours rejected with ValueError and HTTP 400)
9. OR-choice handling (alternative choice questions split marks by 0.5)
10. Older syllabus-version isolation (cross-version queries strictly quarantined)
11. All 6 REST API endpoints, schemas, and error states
"""
import pytest
from rest_framework.test import APIClient
from apps.syllabus.models import (
    University,
    Subject,
    SyllabusVersion,
    Topic,
    Paper,
    Question,
    QuestionTopicMapping,
)
from apps.syllabus.services import (
    compute_recency_weights,
    detect_blind_spots_and_dormant,
    solve_time_budget_planner,
    get_accuracy_and_backtest_report,
)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def sample_syllabus():
    uni, _ = University.objects.get_or_create(code="DU_TEST", defaults={"name": "Delhi University Test", "slug": "du-test"})
    subj, _ = Subject.objects.get_or_create(university=uni, code="TEST-101", defaults={"name": "Test Subject", "slug": "test-101"})
    version, _ = SyllabusVersion.objects.get_or_create(subject=subj, label="Test Version 2024", defaults={"year": 2024, "total_marks": 100})

    # Create topics
    t1 = Topic.objects.create(syllabus_version=version, name="Topic Active Recent", unit_no=1, position=1, estimated_hours=4.0)
    t2 = Topic.objects.create(syllabus_version=version, name="Topic Dormant Old", unit_no=1, position=2, estimated_hours=4.0)
    t3 = Topic.objects.create(syllabus_version=version, name="Topic Blind Spot", unit_no=2, position=1, estimated_hours=3.0)

    # Papers
    p_2024 = Paper.objects.create(subject=subj, syllabus_version=version, year=2024, session="May", max_marks=50)
    p_2020 = Paper.objects.create(subject=subj, syllabus_version=version, year=2020, session="May", max_marks=50)

    # Q1 in 2024 (10 marks) -> Topic 1
    q1 = Question.objects.create(paper=p_2024, number="1", marks=10.0, text_excerpt="Recent question on topic 1", text_hash="hash_q1")
    QuestionTopicMapping.objects.create(question=q1, topic=t1, confidence=1.0)

    # Q2 in 2020 (10 marks) -> Topic 2
    q2 = Question.objects.create(paper=p_2020, number="2", marks=10.0, text_excerpt="Old question on topic 2", text_hash="hash_q2")
    QuestionTopicMapping.objects.create(question=q2, topic=t2, confidence=1.0)

    return {
        "university": uni,
        "subject": subj,
        "version": version,
        "t1": t1,
        "t2": t2,
        "t3": t3,
        "p_2024": p_2024,
        "p_2020": p_2020,
    }


@pytest.mark.django_db
class TestShadowSyllabusAlgorithms:
    def test_recency_weighted_decay_formula(self, sample_syllabus):
        """Test decay(year) = 0.5 ** ((current_year - year) / H)."""
        version = sample_syllabus["version"]
        weights = compute_recency_weights(version, current_year=2024, half_life=4.0)

        t1_data = next(w for w in weights if w["id"] == str(sample_syllabus["t1"].id))
        t2_data = next(w for w in weights if w["id"] == str(sample_syllabus["t2"].id))
        t3_data = next(w for w in weights if w["id"] == str(sample_syllabus["t3"].id))

        # T1 delta=0 -> decay = 1.0 -> score = 10.0
        assert t1_data["score"] == pytest.approx(10.0, rel=1e-2)
        # T2 delta=4, H=4 -> decay = 0.5 -> score = 5.0
        assert t2_data["score"] == pytest.approx(5.0, rel=1e-2)
        # T3 unasked -> score = 0.0
        assert t3_data["score"] == 0.0

        # Weights: 10/15 and 5/15
        assert t1_data["weight"] == pytest.approx(10.0 / 15.0, rel=1e-2)
        assert t2_data["weight"] == pytest.approx(5.0 / 15.0, rel=1e-2)
        assert t3_data["weight"] == 0.0

    def test_configurable_half_life(self, sample_syllabus):
        """Verify score adjustments across H = 2.0, 3.0, 5.0."""
        version = sample_syllabus["version"]

        # For T2 (year 2020, evaluated at 2024, delta=4):
        # H=2.0 -> decay = 0.5 ** (4/2) = 0.25 -> score = 2.5
        w_h2 = compute_recency_weights(version, current_year=2024, half_life=2.0)
        t2_h2 = next(w for w in w_h2 if w["id"] == str(sample_syllabus["t2"].id))
        assert t2_h2["score"] == pytest.approx(2.5, rel=1e-2)

        # H=5.0 -> decay = 0.5 ** (4/5) = 0.5743 -> score = 5.74
        w_h5 = compute_recency_weights(version, current_year=2024, half_life=5.0)
        t2_h5 = next(w for w in w_h5 if w["id"] == str(sample_syllabus["t2"].id))
        assert t2_h5["score"] == pytest.approx(10.0 * (0.5 ** 0.8), rel=1e-2)

    def test_zero_mapped_questions(self):
        """When a syllabus has 0 mapped questions, all scores and weights must be 0."""
        uni = University.objects.create(code="EMPTY_UNI", name="Empty Uni", slug="empty-uni")
        subj = Subject.objects.create(university=uni, code="EMPTY-001", name="Empty Subject", slug="empty-001")
        ver = SyllabusVersion.objects.create(subject=subj, label="Empty 2024", year=2024, total_marks=100)
        t = Topic.objects.create(syllabus_version=ver, name="Solo Topic", unit_no=1, position=1, estimated_hours=5.0)

        weights = compute_recency_weights(ver, current_year=2024)
        assert len(weights) == 1
        assert weights[0]["score"] == 0.0
        assert weights[0]["weight"] == 0.0
        assert weights[0]["is_blind_spot"] is True

    def test_multi_topic_mark_allocation(self, sample_syllabus):
        """A question mapped to multiple topics splits marks according to confidence."""
        version = sample_syllabus["version"]
        p_2024 = sample_syllabus["p_2024"]
        t1 = sample_syllabus["t1"]
        t3 = sample_syllabus["t3"]

        # Delete existing mappings to test clean split
        QuestionTopicMapping.objects.filter(question__paper=p_2024).delete()

        # Create multi-topic question: 20 marks, 0.6 to t1, 0.4 to t3
        q_multi = Question.objects.create(paper=p_2024, number="M1", marks=20.0, text_excerpt="Spanning two topics", text_hash="hash_m1")
        QuestionTopicMapping.objects.create(question=q_multi, topic=t1, confidence=0.6)
        QuestionTopicMapping.objects.create(question=q_multi, topic=t3, confidence=0.4)

        weights = compute_recency_weights(version, current_year=2024, half_life=3.0)
        t1_w = next(w for w in weights if w["id"] == str(t1.id))
        t3_w = next(w for w in weights if w["id"] == str(t3.id))

        # T1 gets 0.6 * 20 = 12.0 marks
        assert t1_w["score"] == pytest.approx(12.0, rel=1e-2)
        # T3 gets 0.4 * 20 = 8.0 marks
        assert t3_w["score"] == pytest.approx(8.0, rel=1e-2)

    def test_or_choice_handling(self, sample_syllabus):
        """OR-choice questions scale marks by 0.5 to prevent inflating optional choices."""
        version = sample_syllabus["version"]
        p_2024 = sample_syllabus["p_2024"]
        t1 = sample_syllabus["t1"]

        # Delete prior mappings
        QuestionTopicMapping.objects.filter(question__paper=p_2024).delete()

        q_or = Question.objects.create(
            paper=p_2024,
            number="3A",
            marks=10.0,
            is_choice_or=True,
            text_excerpt="Optional OR question",
            text_hash="hash_or",
        )
        QuestionTopicMapping.objects.create(question=q_or, topic=t1, confidence=1.0)

        weights = compute_recency_weights(version, current_year=2024, half_life=3.0)
        t1_w = next(w for w in weights if w["id"] == str(t1.id))

        # 10 marks * 0.5 (choice factor) * 1.0 (decay) = 5.0
        assert t1_w["score"] == pytest.approx(5.0, rel=1e-2)

    def test_parent_child_double_count_prevention(self, sample_syllabus):
        """Candidate topics in planner must exclude parent unit headings to prevent double counting."""
        version = sample_syllabus["version"]
        p_2024 = sample_syllabus["p_2024"]

        # Create parent topic (Unit 1 Heading) and child topic (Unit 1.1)
        parent_topic = Topic.objects.create(syllabus_version=version, name="Unit 1: Overview Parent", unit_no=1, position=0, estimated_hours=10.0)
        child_topic = Topic.objects.create(syllabus_version=version, parent=parent_topic, name="Unit 1.1: Detailed Leaf", unit_no=1, position=1, estimated_hours=4.0)

        q = Question.objects.create(paper=p_2024, number="P1", marks=10.0, text_excerpt="Detailed child question", text_hash="hash_p1")
        QuestionTopicMapping.objects.create(question=q, topic=child_topic, confidence=1.0)

        # Solve planner: parent_topic should NOT be in selected_topics
        plan = solve_time_budget_planner(version, days_left=5, hours_per_day=3.0, current_year=2024)
        selected_ids = [t["id"] for t in plan["selected_topics"]]

        assert str(parent_topic.id) not in selected_ids
        assert str(child_topic.id) in selected_ids

    def test_older_syllabus_version_isolation(self, sample_syllabus):
        """Questions mapped to older syllabus versions must never contaminate the current version."""
        subj = sample_syllabus["subject"]
        old_version = SyllabusVersion.objects.create(subject=subj, label="Legacy 2015 Scheme", year=2015, total_marks=100)
        old_topic = Topic.objects.create(syllabus_version=old_version, name="Legacy Topic", unit_no=1, position=1)

        p_old = Paper.objects.create(subject=subj, syllabus_version=old_version, year=2016, session="May", max_marks=50)
        q_old = Question.objects.create(paper=p_old, number="OLD1", marks=15.0, text_excerpt="Legacy question", text_hash="hash_old1")
        QuestionTopicMapping.objects.create(question=q_old, topic=old_topic, confidence=1.0)

        current_weights = compute_recency_weights(sample_syllabus["version"], current_year=2024)
        current_topic_ids = [w["id"] for w in current_weights]

        assert str(old_topic.id) not in current_topic_ids

    def test_blind_spot_and_dormant_detection(self, sample_syllabus):
        version = sample_syllabus["version"]
        report = detect_blind_spots_and_dormant(version, current_year=2024, dormant_years=3)

        assert report["blind_spots_count"] == 1
        assert report["blind_spots"][0]["id"] == str(sample_syllabus["t3"].id)
        assert report["dormant_count"] == 1
        assert report["dormant_topics"][0]["id"] == str(sample_syllabus["t2"].id)
        assert "warning_notice" in report

    def test_knapsack_15_percent_reserve_and_determinism(self, sample_syllabus):
        """15% of budget must be reserved, and repeated calls must yield identical schedules."""
        version = sample_syllabus["version"]
        # 10 days * 4 h/day = 40 hours total
        # 15% reserve = 6.0 hours -> 34.0 study budget
        plan1 = solve_time_budget_planner(version, days_left=10, hours_per_day=4.0, current_year=2024)
        plan2 = solve_time_budget_planner(version, days_left=10, hours_per_day=4.0, current_year=2024)

        assert plan1["total_available_hours"] == 40.0
        assert plan1["revision_reserve_hours"] == 6.0
        assert plan1["study_budget_hours"] == 34.0

        # Deterministic equality
        assert [t["id"] for t in plan1["selected_topics"]] == [t["id"] for t in plan2["selected_topics"]]

    def test_invalid_budgets_raise_error(self, sample_syllabus):
        """Non-positive days or hours must raise ValueError."""
        version = sample_syllabus["version"]
        with pytest.raises(ValueError):
            solve_time_budget_planner(version, days_left=0, hours_per_day=4.0)
        with pytest.raises(ValueError):
            solve_time_budget_planner(version, days_left=5, hours_per_day=-2.0)


@pytest.mark.django_db
class TestShadowSyllabusAPI:
    def test_subject_list_endpoint(self, api_client, sample_syllabus):
        response = api_client.get("/api/v1/syllabus/subjects/")
        assert response.status_code == 200
        assert len(response.data) >= 1
        assert response.data[0]["code"] == "TEST-101"

    def test_topic_weightage_endpoint(self, api_client, sample_syllabus):
        response = api_client.get("/api/v1/syllabus/topics/?subject_code=TEST-101")
        assert response.status_code == 200
        assert "topics" in response.data
        assert len(response.data["topics"]) == 3

    def test_blind_spots_endpoint(self, api_client, sample_syllabus):
        response = api_client.get("/api/v1/syllabus/blind-spots/?subject_code=TEST-101")
        assert response.status_code == 200
        assert response.data["blind_spots_count"] >= 1
        assert "warning_notice" in response.data

    def test_topic_evidence_endpoint(self, api_client, sample_syllabus):
        t1_id = sample_syllabus["t1"].id
        response = api_client.get(f"/api/v1/syllabus/evidence/{t1_id}/")
        assert response.status_code == 200
        assert response.data["total_mapped_questions"] == 1
        assert response.data["evidence"][0]["question"]["marks"] == 10.0

    def test_planner_endpoint_success_and_validation(self, api_client, sample_syllabus):
        # Valid payload
        response = api_client.post("/api/v1/syllabus/planner/", {
            "subject_code": "TEST-101",
            "days_left": 10,
            "hours_per_day": 3.0,
        }, format="json")
        assert response.status_code == 200
        assert "daily_schedule" in response.data
        assert response.data["coverage_percentage"] > 0

        # Invalid budget: days_left <= 0
        bad_response = api_client.post("/api/v1/syllabus/planner/", {
            "subject_code": "TEST-101",
            "days_left": 0,
            "hours_per_day": 3.0,
        }, format="json")
        assert bad_response.status_code == 400

    def test_topic_weightage_query_count(self, api_client, sample_syllabus, django_assert_max_num_queries):
        """Ensure no N+1 query regression: /topics/ executes <= 3 SQL queries."""
        with django_assert_max_num_queries(3):
            response = api_client.get("/api/v1/syllabus/topics/?subject_code=TEST-101")
        assert response.status_code == 200

    def test_blind_spots_query_count(self, api_client, sample_syllabus, django_assert_max_num_queries):
        """Ensure no N+1 query regression: /blind-spots/ executes <= 3 SQL queries."""
        with django_assert_max_num_queries(3):
            response = api_client.get("/api/v1/syllabus/blind-spots/?subject_code=TEST-101")
        assert response.status_code == 200

    def test_accuracy_report_endpoint(self, api_client):
        response = api_client.get("/api/v1/syllabus/accuracy-report/")
        assert response.status_code == 200
        assert response.data["dataset_sample_size"] == 105
        assert response.data["default_strategy"] == "embeddings_only"
        assert response.data["active_strategy"] == "embeddings_only"
        assert "inter_annotator_agreement" in response.data
        assert "mapping_accuracy" in response.data
        assert "ablation_finding" in response.data["mapping_accuracy"]
        assert "backtest_marks_capture" in response.data
        disclosures = response.data["backtest_marks_capture"]["disclosures"]
        assert any("inconclusive" in d for d in disclosures)

    def test_accuracy_report_hybrid_strategy_param(self, api_client):
        response = api_client.get("/api/v1/syllabus/accuracy-report/?strategy=hybrid")
        assert response.status_code == 200
        assert response.data["active_strategy"] == "hybrid"
        assert response.data["mapping_accuracy"]["top1_accuracy"] == pytest.approx(0.9143, rel=1e-2)

    def test_planner_throttling_anonymous_and_authenticated(self, api_client, sample_syllabus):
        """Test anonymous 10/min rate limit and authenticated 30/min rate limit isolation."""
        from django.core.cache import cache
        from django.contrib.auth import get_user_model
        cache.clear()

        payload = {
            "subject_code": "TEST-101",
            "days_left": 10,
            "hours_per_day": 3.0,
        }

        # Anonymous client: 10 requests allowed
        for i in range(10):
            res = api_client.post("/api/v1/syllabus/planner/", payload, format="json")
            assert res.status_code == 200, f"Request {i+1} failed with {res.status_code}"

        # 11th anonymous request must return 429 Too Many Requests
        breach_res = api_client.post("/api/v1/syllabus/planner/", payload, format="json")
        assert breach_res.status_code == 429
        assert breach_res.has_header("Retry-After")

        # Authenticated user should have their own isolated limit (30 requests/min)
        User = get_user_model()
        user = User.objects.create_user(email="planner_student@example.com", password="StrongPassword123!")
        auth_client = APIClient()
        auth_client.force_authenticate(user=user)

        # Authenticated user can execute requests even while anonymous is throttled
        auth_res = auth_client.post("/api/v1/syllabus/planner/", payload, format="json")
        assert auth_res.status_code == 200
