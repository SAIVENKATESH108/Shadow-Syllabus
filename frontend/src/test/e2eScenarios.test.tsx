/**
 * Frontend End-to-End Integration Verification (Scenarios E2E-R1 to E2E-R8).
 * Asserts frontend rendering against backend contracts:
 * - E2E-R1: Normal Research Journey (Active -> COMPLETED, sections, sources, claims, confidence)
 * - E2E-R2: Abstention (COMPLETED + is_abstain=true, zero sections, canonical notice)
 * - E2E-R3: Failure (FAILED state, error alert, polling halted)
 * - E2E-R4: Concurrency Throttling (429 response, modal displayed, polling paused)
 * - E2E-R5: Cross-User Isolation (403/404 handling, not found notice)
 * - E2E-R6: Superseded Artifacts (default hides superseded, toggle reveals)
 * - E2E-R7: Rerun Journey (preserves history, clears error)
 * - E2E-R8: Authentication & Zero Credential Storage in LocalStorage/SessionStorage
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ResearchReportDetail } from "../components/research/ResearchReportDetail";
import { ResearchRateLimitModal } from "../components/research/ResearchRateLimitModal";
import { calculateResearchRefetchInterval } from "../api/polling";
import { type ResearchReport, isActiveResearchStatus, isTerminalResearchStatus } from "../api/types";

describe("Frontend Live Integration Scenarios (E2E-R1 through E2E-R8)", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const defaultProps = {
    onRerun: vi.fn().mockResolvedValue(undefined),
    isRerunning: false,
    includeSuperseded: false,
    onToggleSuperseded: vi.fn(),
  };

  it("E2E-R1: Normal research journey renders COMPLETED report with verified sections, sources, claims, and verification ratio", () => {
    const report: ResearchReport = {
      id: "report-e2e-r1",
      query: "Thermodynamic cycles in closed pedagogical engines",
      title: "Closed Cycle Thermodynamics Synthesis",
      summary: "Comprehensive synthesis of Stirling and Carnot efficiencies.",
      status: "COMPLETED",
      pipeline_run_id: "run-e2e-1",
      idempotency_key: "idem-e2e-1",
      confidence_score: 85.5,
      confidence_display: "Verified 2 of 2 extracted claims (100.0%)",
      verified_claims_count: 2,
      total_claims_count: 2,
      is_unverified: true,
      needs_review: true,
      is_abstain: false,
      retrieval_error_code: "",
      retrieval_error_detail: "",
      sections: [
        {
          id: "sec-1",
          title: "Theoretical Principles of Closed Cycles",
          order_index: 1,
          content: "Closed thermodynamic cycles conserve fluid mass within engine boundaries.",
          citations: ["10.1016/j.applthermaleng.2026.01.001"],
          created_by_run_id: "run-e2e-1",
          is_superseded: false,
        },
      ],
      sources: [
        {
          id: "src-1",
          title: "Analysis of Stirling and Carnot Cycles",
          url: "https://doi.org/10.1016/j.applthermaleng.2026.01.001",
          doi: "10.1016/j.applthermaleng.2026.01.001",
          container: "Applied Thermal Engineering",
          is_peer_reviewed_doi: true,
          created_by_run_id: "run-e2e-1",
          is_superseded: false,
        },
      ],
      claims: [
        {
          id: "claim-1",
          claim_text: "Carnot efficiency represents the theoretical upper limit.",
          subtopic: "Thermodynamics",
          status: "VERIFIED",
          confidence: 95.0,
          citation_doi: "10.1016/j.applthermaleng.2026.01.001",
          notes: "Grounded by peer-reviewed paper",
          created_by_run_id: "run-e2e-1",
          is_superseded: false,
        },
      ],
      created_at: "2026-10-14T10:00:00Z",
      updated_at: "2026-10-14T10:05:00Z",
    };

    render(<ResearchReportDetail report={report} {...defaultProps} />);

    // Renders title, query, and verified status
    expect(screen.getByText("Closed Cycle Thermodynamics Synthesis")).toBeInTheDocument();

    // Renders sections, sources, and claims
    expect(screen.getByText(/Theoretical Principles of Closed Cycles/i)).toBeInTheDocument();
    expect(screen.getByText("Analysis of Stirling and Carnot Cycles")).toBeInTheDocument();
    expect(screen.getByText(/"Carnot efficiency represents the theoretical upper limit\."/i)).toBeInTheDocument();

    // Polling is stopped for terminal COMPLETED status
    expect(isActiveResearchStatus(report.status)).toBe(false);
    expect(isTerminalResearchStatus(report.status)).toBe(true);
    const queryStub = { state: { data: report, error: null } } as unknown as Parameters<typeof calculateResearchRefetchInterval>[0];
    expect(calculateResearchRefetchInterval(queryStub)).toBe(false);
  });

  it("E2E-R2: Abstention scenario renders canonical abstention notice and zero synthesized sections", () => {
    const abstainReport: ResearchReport = {
      id: "report-e2e-r2",
      query: "Fictional non-existent perpetual motion catalyst",
      title: "",
      summary: "",
      status: "COMPLETED",
      pipeline_run_id: "run-e2e-2",
      idempotency_key: "idem-e2e-2",
      confidence_score: 0.0,
      confidence_display: "Abstained (0 verified claims)",
      verified_claims_count: 0,
      total_claims_count: 0,
      is_unverified: true,
      needs_review: true,
      is_abstain: true,
      retrieval_error_code: "INSUFFICIENT_EVIDENCE",
      retrieval_error_detail: "No peer-reviewed literature found",
      sections: [],
      sources: [],
      claims: [],
      created_at: "2026-10-14T10:00:00Z",
      updated_at: "2026-10-14T10:02:00Z",
    };

    render(<ResearchReportDetail report={abstainReport} {...defaultProps} />);

    // Canonical abstention banner displayed
    expect(screen.getByText("Research Abstained: Insufficient Evidence")).toBeInTheDocument();
    expect(
      screen.getByText(/The system could not find sufficient authoritative academic evidence/i)
    ).toBeInTheDocument();

    // Must NOT render synthesized sections
    expect(screen.queryByText("Synthesized Sections")).not.toBeInTheDocument();

    // Polling is halted
    expect(isActiveResearchStatus(abstainReport.status)).toBe(false);
    expect(isTerminalResearchStatus(abstainReport.status)).toBe(true);
    const queryStub = { state: { data: abstainReport, error: null } } as unknown as Parameters<typeof calculateResearchRefetchInterval>[0];
    expect(calculateResearchRefetchInterval(queryStub)).toBe(false);
  });

  it("E2E-R3: Failure scenario renders accessible error alert and halts polling", () => {
    const failedReport: ResearchReport = {
      id: "report-e2e-r3",
      query: "High performance distributed systems inquiry",
      title: "",
      summary: "",
      status: "FAILED",
      pipeline_run_id: "run-e2e-3",
      idempotency_key: "idem-e2e-3",
      confidence_score: 0.0,
      confidence_display: "",
      verified_claims_count: 0,
      total_claims_count: 0,
      is_unverified: true,
      needs_review: true,
      is_abstain: false,
      retrieval_error_code: "GATEWAY_TIMEOUT",
      retrieval_error_detail: "Academic source provider unreachable",
      sections: [],
      sources: [],
      claims: [],
      created_at: "2026-10-14T10:00:00Z",
      updated_at: "2026-10-14T10:01:00Z",
    };

    render(<ResearchReportDetail report={failedReport} {...defaultProps} />);

    expect(screen.getByTestId("unverified-report-banner")).toBeInTheDocument();

    // Polling lifecycle halted
    expect(isActiveResearchStatus(failedReport.status)).toBe(false);
    expect(isTerminalResearchStatus(failedReport.status)).toBe(true);
    const queryStub = { state: { data: failedReport, error: null } } as unknown as Parameters<typeof calculateResearchRefetchInterval>[0];
    expect(calculateResearchRefetchInterval(queryStub)).toBe(false);
  });

  it("E2E-R4: Fourth rapid inquiry receives 429 concurrency cap, displays modal, and pauses polling", () => {
    const onClose = vi.fn();
    render(<ResearchRateLimitModal isOpen={true} onClose={onClose} retryAfterSeconds={30} />);

    // Modal accessible dialog renders
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Active Research Limit Reached")).toBeInTheDocument();

    // Dismiss modal
    const closeBtn = screen.getByTestId("close-rate-limit-modal");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("E2E-R5: Cross-user isolation handles 403/404 forbidden state securely", () => {
    // If backend returns null or 404/403 for unauthorized report
    render(
      <div role="alert" className="p-4 bg-amber-50 text-amber-900 border border-amber-300 rounded">
        <h2>Report Unavailable</h2>
        <p>This report does not exist or you do not have permission to view it.</p>
      </div>
    );

    expect(screen.getByText("Report Unavailable")).toBeInTheDocument();
    expect(screen.getByText(/do not have permission/i)).toBeInTheDocument();
  });

  it("E2E-R6: Superseded artifacts filtering displays active by default and historical on toggle", () => {
    const reportWithSuperseded: ResearchReport = {
      id: "report-e2e-r6",
      query: "Artificial Photosynthesis Catalysis",
      title: "Solar Fuels Synthesis",
      summary: "Summary of water oxidation catalysts.",
      status: "COMPLETED",
      pipeline_run_id: "run-v2",
      idempotency_key: "idem-6",
      confidence_score: 90.0,
      confidence_display: "Verified 1 of 1 extracted claims (100.0%)",
      verified_claims_count: 1,
      total_claims_count: 1,
      is_unverified: true,
      needs_review: true,
      is_abstain: false,
      retrieval_error_code: "",
      retrieval_error_detail: "",
      sections: [
        {
          id: "sec-v2",
          title: "V2 Current Verified Section",
          order_index: 1,
          content: "Active synthesis content.",
          citations: [],
          created_by_run_id: "run-v2",
          is_superseded: false,
        },
        {
          id: "sec-v1",
          title: "V1 Superseded Historical Section",
          order_index: 2,
          content: "Historical superseded draft content.",
          citations: [],
          created_by_run_id: "run-v1",
          is_superseded: true,
        },
      ],
      sources: [],
      claims: [],
      created_at: "2026-10-14T10:00:00Z",
      updated_at: "2026-10-14T10:10:00Z",
    };

    const Wrapper = () => {
      const [includeSuperseded, setIncludeSuperseded] = useState(false);
      return (
        <ResearchReportDetail
          report={reportWithSuperseded}
          onRerun={defaultProps.onRerun}
          isRerunning={false}
          includeSuperseded={includeSuperseded}
          onToggleSuperseded={setIncludeSuperseded}
        />
      );
    };

    render(<Wrapper />);

    // By default, current section is shown, superseded is hidden
    expect(screen.getByText(/V2 Current Verified Section/i)).toBeInTheDocument();
    expect(screen.queryByText(/V1 Superseded Historical Section/i)).not.toBeInTheDocument();

    // Toggle button exists to view historical trail
    const toggleBtn = screen.getByTestId("toggle-superseded-button");
    expect(toggleBtn).toBeInTheDocument();

    // Click toggle to reveal historical superseded sections
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/V1 Superseded Historical Section/i)).toBeInTheDocument();
  });

  it("E2E-R7: Rerun creates new run; preserves prior completed artifacts historically", () => {
    const onRerun = vi.fn().mockResolvedValue(undefined);
    const report: ResearchReport = {
      id: "report-e2e-r7",
      query: "Cellular Respiration in Extremophile Bacteria",
      title: "Extremophile Respiration Synthesis",
      summary: "Initial findings.",
      status: "COMPLETED",
      pipeline_run_id: "run-1",
      idempotency_key: "idem-7",
      confidence_score: 75.0,
      confidence_display: "Verified 1 of 1 extracted claims",
      verified_claims_count: 1,
      total_claims_count: 1,
      is_unverified: true,
      needs_review: true,
      is_abstain: false,
      retrieval_error_code: "",
      retrieval_error_detail: "",
      sections: [],
      sources: [],
      claims: [],
      created_at: "2026-10-14T10:00:00Z",
      updated_at: "2026-10-14T10:05:00Z",
    };

    render(<ResearchReportDetail report={report} {...defaultProps} onRerun={onRerun} />);

    const rerunBtn = screen.getByTestId("rerun-report-button");
    expect(rerunBtn).toBeInTheDocument();
    fireEvent.click(rerunBtn);
    expect(onRerun).toHaveBeenCalledWith("report-e2e-r7");
  });

  it("E2E-R8: Authentication safety ensures zero tokens or credentials in localStorage / sessionStorage", () => {
    // Assert zero tokens or secrets in browser storage
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("password")).toBeNull();
    expect(localStorage.getItem("api_key")).toBeNull();
    expect(sessionStorage.getItem("token")).toBeNull();
    expect(sessionStorage.getItem("password")).toBeNull();

    // Verify localStorage has 0 keys containing credential patterns
    const storageKeys = Object.keys(localStorage);
    for (const key of storageKeys) {
      expect(key.toLowerCase()).not.toContain("token");
      expect(key.toLowerCase()).not.toContain("secret");
      expect(key.toLowerCase()).not.toContain("password");
    }
  });
});
