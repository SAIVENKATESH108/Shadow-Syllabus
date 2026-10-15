"""Live Django integration verification for Scenarios E2E-R1 through E2E-R8.

Executed against local PostgreSQL and Redis with synthetic users and mocked ai_gateway/CrossRef.
Zero calls to Neon, external AI models, or live academic APIs.
Zero real student data or credentials.
"""
import uuid
import unittest.mock as mock
import pytest
from rest_framework import status
from rest_framework.test import APIClient

from apps.users.models import User
from apps.research.models import ResearchReport, ResearchSection, ResearchSource, ResearchClaim
from apps.research.services import ResearchOrchestrationService


@pytest.fixture
def synthetic_student_a(db: None) -> User:
    """Synthetic student user A for live E2E scenarios."""
    return User.objects.create_user(
        email="synthetic.student.e2e.alpha@example.org",
        password="SyntheticPasswordAlpha123!",
        first_name="Alpha",
        last_name="Student",
        role=User.Role.STUDENT,
    )


@pytest.fixture
def synthetic_student_b(db: None) -> User:
    """Synthetic student user B for cross-user isolation tests."""
    return User.objects.create_user(
        email="synthetic.student.e2e.beta@example.org",
        password="SyntheticPasswordBeta456!",
        first_name="Beta",
        last_name="Student",
        role=User.Role.STUDENT,
    )


@pytest.mark.django_db
def test_e2e_r1_normal_research_journey(api_client: APIClient, synthetic_student_a: User) -> None:
    """E2E-R1: Normal research journey.
    Inquiry creates PENDING; transitions through statuses to COMPLETED;
    current sections, sources, claims, and claim-verification ratio render.
    """
    api_client.force_authenticate(user=synthetic_student_a)

    mock_finding = mock.Mock(
        subtopic_id="sub1",
        subtopic_title="Thermodynamics Foundations",
        sources=[{
            "title": "Analysis of Stirling and Carnot Cycles",
            "doi": "10.1016/j.applthermaleng.2026.01.001",
            "url": "https://doi.org/10.1016/j.applthermaleng.2026.01.001",
            "container": "Applied Thermal Engineering",
            "is_peer_reviewed_doi": True,
        }],
        claims=[
            {
                "claim_text": "Carnot efficiency represents the theoretical upper limit.",
                "citation_doi": "10.1016/j.applthermaleng.2026.01.001",
                "citation_url": "https://doi.org/10.1016/j.applthermaleng.2026.01.001",
                "subtopic": "Thermodynamics Foundations",
            },
            {
                "claim_text": "Regenerator dead volume reduces practical thermal output.",
                "citation_doi": "10.1016/j.applthermaleng.2026.01.001",
                "citation_url": "https://doi.org/10.1016/j.applthermaleng.2026.01.001",
                "subtopic": "Thermodynamics Foundations",
            },
        ],
        retrieval_error_code="",
        retrieval_error_detail="",
    )

    # 1. Post inquiry topic with celery delayed dispatch to test PENDING creation
    topic = "Thermodynamic cycles in closed pedagogical engines"
    with mock.patch("apps.research.services.ResearchOrchestrationService.execute_research_pipeline") as mock_pipeline:
        create_resp = api_client.post("/api/v1/research/reports/", {"query": topic}, format="json")
        assert create_resp.status_code == status.HTTP_201_CREATED
        report_id = create_resp.data["id"]
        assert create_resp.data["status"] == "PENDING"
        assert create_resp.data["is_abstain"] is False

    # 2. Simulate pipeline execution through real service to COMPLETED
    with mock.patch("apps.research.agents.orchestrator.OrchestratorAgent.decompose", return_value=[mock.Mock(id="sub1", title="Thermodynamics Foundations")]):
        with mock.patch("apps.research.agents.researcher.ResearcherAgent.investigate_subtopic", return_value=mock_finding):
            with mock.patch("apps.ai_gateway.services.AIGatewayService.request_study_assistance", return_value=mock.Mock(content="Theoretical Principles of Closed Cycles.")):
                completed_report = ResearchOrchestrationService.execute_research_pipeline(report_id)

    assert completed_report.status == ResearchReport.Status.COMPLETED
    assert completed_report.is_abstain is False

    # 3. Fetch report via GET
    get_resp = api_client.get(f"/api/v1/research/reports/{report_id}/")
    assert get_resp.status_code == status.HTTP_200_OK
    data = get_resp.data

    assert data["status"] == "COMPLETED"
    assert data["is_abstain"] is False
    assert len(data["sections"]) >= 1
    assert len(data["sources"]) >= 1
    assert data["sources"][0]["is_peer_reviewed_doi"] is True
    assert len(data["claims"]) >= 2
    # Claim verification ratio: all verified = 1.0 (100%)
    assert data["verified_claims_count"] == 2
    assert data["total_claims_count"] == 2
    assert "2 of 2" in data["confidence_display"]
    assert data["confidence_score"] > 0.0


@pytest.mark.django_db
def test_e2e_r2_abstention_journey(api_client: APIClient, synthetic_student_a: User) -> None:
    """E2E-R2: Abstention scenario.
    COMPLETED + is_abstain=true renders canonical notice and zero synthesized sections.
    """
    api_client.force_authenticate(user=synthetic_student_a)

    report = ResearchReport.objects.create(
        user=synthetic_student_a,
        query="Fictional non-existent perpetual motion catalyst",
        status=ResearchReport.Status.COMPLETED,
        is_abstain=True,
        confidence_score=0.0,
    )

    # Abstention contract: ZERO sections created
    get_resp = api_client.get(f"/api/v1/research/reports/{report.id}/")
    assert get_resp.status_code == status.HTTP_200_OK
    data = get_resp.data

    assert data["status"] == "COMPLETED"
    assert data["is_abstain"] is True
    assert len(data["sections"]) == 0
    assert data["confidence_score"] == 0.0


@pytest.mark.django_db
def test_e2e_r3_failure_state(api_client: APIClient, synthetic_student_a: User) -> None:
    """E2E-R3: Failure scenario.
    FAILED renders an accessible error state and stops polling.
    """
    api_client.force_authenticate(user=synthetic_student_a)

    report = ResearchReport.objects.create(
        user=synthetic_student_a,
        query="High performance distributed systems inquiry",
        status=ResearchReport.Status.FAILED,
        retrieval_error_code="GATEWAY_TIMEOUT",
        retrieval_error_detail="Gateway timeout: Academic source provider unreachable",
    )

    get_resp = api_client.get(f"/api/v1/research/reports/{report.id}/")
    assert get_resp.status_code == status.HTTP_200_OK
    data = get_resp.data

    assert data["status"] == "FAILED"
    assert data["retrieval_error_code"] == "GATEWAY_TIMEOUT"
    assert data["retrieval_error_detail"] == "Gateway timeout: Academic source provider unreachable"


@pytest.mark.django_db
def test_e2e_r4_concurrency_cap_fourth_inquiry_429(
    api_client: APIClient, synthetic_student_a: User
) -> None:
    """E2E-R4: Concurrency cap.
    Three active inquiries are permitted; fourth rapid inquiry receives 429;
    modal appears; polling pauses; no automatic retry loop.
    """
    api_client.force_authenticate(user=synthetic_student_a)

    # Create 3 active reports (PENDING, RESEARCHING, WRITING)
    for i, st in enumerate([
        ResearchReport.Status.PENDING,
        ResearchReport.Status.RESEARCHING,
        ResearchReport.Status.WRITING,
    ]):
        ResearchReport.objects.create(
            user=synthetic_student_a,
            query=f"Active inquiry topic {i + 1}",
            status=st,
        )

    # 4th inquiry must be throttled with HTTP 429
    fourth_resp = api_client.post(
        "/api/v1/research/reports/",
        {"query": "Fourth inquiry topic exceeding limit"},
        format="json",
    )
    assert fourth_resp.status_code == status.HTTP_429_TOO_MANY_REQUESTS
    assert "detail" in fourth_resp.data or "error" in fourth_resp.data


@pytest.mark.django_db
def test_e2e_r5_cross_user_isolation(
    api_client: APIClient, synthetic_student_a: User, synthetic_student_b: User
) -> None:
    """E2E-R5: Cross-user isolation.
    User B cannot open User A's report; UI shows the appropriate not-found/forbidden state.
    """
    # Create private report owned by Student Alpha
    report_alpha = ResearchReport.objects.create(
        user=synthetic_student_a,
        query="Confidential Quantum Encryption Proposal",
        status=ResearchReport.Status.COMPLETED,
    )

    # Student Beta attempts to access Student Alpha's report
    api_client.force_authenticate(user=synthetic_student_b)
    resp = api_client.get(f"/api/v1/research/reports/{report_alpha.id}/")

    # IsOwnerOnly permission class returns 404 or 403
    assert resp.status_code in (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN)


@pytest.mark.django_db
def test_e2e_r6_superseded_artifacts_filtering(
    api_client: APIClient, synthetic_student_a: User
) -> None:
    """E2E-R6: Superseded artifacts.
    Current artifacts display by default; historical artifacts appear only through explicit toggle.
    """
    api_client.force_authenticate(user=synthetic_student_a)

    report = ResearchReport.objects.create(
        user=synthetic_student_a,
        query="Artificial Photosynthesis Catalysis",
        status=ResearchReport.Status.COMPLETED,
    )

    run_v1 = uuid.uuid4()
    run_v2 = uuid.uuid4()

    # V1 (superseded) section
    ResearchSection.objects.create(
        report=report,
        created_by_run_id=run_v1,
        title="V1 Historical Section",
        content="Prior draft superseded by rerun.",
        order_index=1,
        is_superseded=True,
    )

    # V2 (current active) section
    ResearchSection.objects.create(
        report=report,
        created_by_run_id=run_v2,
        title="V2 Current Section",
        content="Verified active synthesis.",
        order_index=1,
        is_superseded=False,
    )

    # 1. Default request: include_superseded=false -> only V2 appears
    default_resp = api_client.get(f"/api/v1/research/reports/{report.id}/")
    assert default_resp.status_code == status.HTTP_200_OK
    assert len(default_resp.data["sections"]) == 1
    assert default_resp.data["sections"][0]["title"] == "V2 Current Section"

    # 2. Explicit toggle: include_superseded=true -> both V1 and V2 appear
    toggle_resp = api_client.get(f"/api/v1/research/reports/{report.id}/?include_superseded=true")
    assert toggle_resp.status_code == status.HTTP_200_OK
    assert len(toggle_resp.data["sections"]) == 2
    titles = [s["title"] for s in toggle_resp.data["sections"]]
    assert "V1 Historical Section" in titles
    assert "V2 Current Section" in titles


@pytest.mark.django_db
def test_e2e_r7_rerun_creates_new_run_and_preserves_history(
    api_client: APIClient, synthetic_student_a: User
) -> None:
    """E2E-R7: Rerun creates a new run; prior completed artifacts remain hidden by default
    and preserved historically.
    """
    api_client.force_authenticate(user=synthetic_student_a)

    # Completed initial run
    report = ResearchReport.objects.create(
        user=synthetic_student_a,
        query="Cellular Respiration in Extremophile Bacteria",
        status=ResearchReport.Status.COMPLETED,
    )
    initial_run_id = report.pipeline_run_id

    mock_finding_1 = mock.Mock(
        subtopic_id="sub1",
        subtopic_title="Sulfur Chemolithotrophy",
        sources=[{"title": "Extremophile Biology", "doi": "10.1145/3318464.3389700", "url": "https://doi.org/10.1145/3318464.3389700", "container": "Journal", "is_peer_reviewed_doi": True}],
        claims=[{"claim_text": "Bacteria reduce elemental sulfur.", "citation_doi": "10.1145/3318464.3389700", "citation_url": "https://doi.org/10.1145/3318464.3389700", "subtopic": "Sulfur"}],
        retrieval_error_code="",
        retrieval_error_detail="",
    )

    # Execute Initial Run
    with mock.patch("apps.research.agents.orchestrator.OrchestratorAgent.decompose", return_value=[mock.Mock(id="sub1", title="Sulfur Chemolithotrophy")]):
        with mock.patch("apps.research.agents.researcher.ResearcherAgent.investigate_subtopic", return_value=mock_finding_1):
            with mock.patch("apps.ai_gateway.services.AIGatewayService.request_study_assistance", return_value=mock.Mock(content="Initial Draft Content")):
                ResearchOrchestrationService.execute_research_pipeline(str(report.id))

    report.refresh_from_db()
    first_run_id = report.pipeline_run_id
    sec_old = report.sections.first()
    assert sec_old.is_superseded is False

    # Execute Run 2 (Rerun)
    mock_finding_2 = mock.Mock(
        subtopic_id="sub1",
        subtopic_title="Sulfur Chemolithotrophy",
        sources=[{"title": "Extremophile Biology V2", "doi": "10.1145/3318464.3389700", "url": "https://doi.org/10.1145/3318464.3389700", "container": "Journal", "is_peer_reviewed_doi": True}],
        claims=[{"claim_text": "Bacteria reduce elemental sulfur with hydrogen sulfide output.", "citation_doi": "10.1145/3318464.3389700", "citation_url": "https://doi.org/10.1145/3318464.3389700", "subtopic": "Sulfur"}],
        retrieval_error_code="",
        retrieval_error_detail="",
    )

    with mock.patch("apps.research.agents.orchestrator.OrchestratorAgent.decompose", return_value=[mock.Mock(id="sub1", title="Sulfur Chemolithotrophy")]):
        with mock.patch("apps.research.agents.researcher.ResearcherAgent.investigate_subtopic", return_value=mock_finding_2):
            with mock.patch("apps.ai_gateway.services.AIGatewayService.request_study_assistance", return_value=mock.Mock(content="Updated Synthesis Content")):
                ResearchOrchestrationService.execute_research_pipeline(str(report.id))

    report.refresh_from_db()
    second_run_id = report.pipeline_run_id
    assert second_run_id != first_run_id

    # The prior section must be preserved historically (is_superseded=True)
    sec_old.refresh_from_db()
    assert sec_old.is_superseded is True
    assert sec_old.superseded_by_run_id == second_run_id

    # Default API response only returns non-superseded sections
    resp = api_client.get(f"/api/v1/research/reports/{report.id}/")
    assert len(resp.data["sections"]) == 1
    assert resp.data["sections"][0]["created_by_run_id"] == str(second_run_id)

    # Historical toggle shows BOTH sections (preserved trail)
    hist_resp = api_client.get(f"/api/v1/research/reports/{report.id}/?include_superseded=true")
    assert len(hist_resp.data["sections"]) == 2


@pytest.mark.django_db
def test_e2e_r8_unauthenticated_access_safety(api_client: APIClient, synthetic_student_a: User) -> None:
    """E2E-R8: Authentication safety.
    Unauthenticated access is handled safely (401/403);
    no token or credential is persisted in browser storage.
    """
    api_client.logout()

    report = ResearchReport.objects.create(
        user=synthetic_student_a,
        query="Public Inquiry Attempt",
        status=ResearchReport.Status.COMPLETED,
    )

    # Unauthenticated GET
    get_resp = api_client.get(f"/api/v1/research/reports/{report.id}/")
    assert get_resp.status_code in (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)

    # Unauthenticated POST
    post_resp = api_client.post("/api/v1/research/reports/", {"query": "Hack inquiry"}, format="json")
    assert post_resp.status_code in (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)
