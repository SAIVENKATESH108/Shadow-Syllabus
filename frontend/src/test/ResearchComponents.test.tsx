import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UnverifiedReportBanner } from "../components/research/UnverifiedReportBanner";
import { ClaimVerificationBadge } from "../components/research/ClaimVerificationBadge";
import { AbstainedNotice } from "../components/research/AbstainedNotice";
import { ArtifactHistoryDrawer } from "../components/research/ArtifactHistoryDrawer";
import { ResearchRateLimitModal } from "../components/research/ResearchRateLimitModal";
import { ResearchInquiryForm } from "../components/research/ResearchInquiryForm";
import { ResearchReportDetail } from "../components/research/ResearchReportDetail";
import { ResearchReport } from "../api/types";
import "../i18n/config";

const mockReport: ResearchReport = {
  id: "rep-001",
  query: "What is quantum entanglement?",
  title: "Quantum Entanglement & Non-Locality",
  summary: "Quantum entanglement describes physical systems with non-local correlations.",
  status: "COMPLETED",
  pipeline_run_id: "run-abc-123",
  idempotency_key: "idem-1",
  confidence_score: 75.0,
  confidence_display: "Verified 3 of 4 extracted claims (75.0%)",
  verified_claims_count: 3,
  total_claims_count: 4,
  is_unverified: true,
  needs_review: true,
  is_abstain: false,
  retrieval_error_code: "",
  retrieval_error_detail: "",
  sections: [
    {
      id: "sec-1",
      title: "EPR Paradox and Bell Inequalities",
      order_index: 0,
      content: "Bell inequalities test whether local hidden-variable theories hold.",
      citations: ["10.1103/PhysRev.47.777"],
      created_by_run_id: "run-abc-123",
      is_superseded: false,
    },
    {
      id: "sec-old",
      title: "Outdated Draft Section",
      order_index: 1,
      content: "This section was from an earlier pipeline run.",
      citations: [],
      created_by_run_id: "run-old-000",
      is_superseded: true,
    },
  ],
  sources: [
    {
      id: "src-1",
      title: "Can Quantum-Mechanical Description of Physical Reality be Considered Complete?",
      url: "https://journals.aps.org/pr/abstract/10.1103/PhysRev.47.777",
      doi: "10.1103/PhysRev.47.777",
      container: "Physical Review",
      is_peer_reviewed_doi: true,
      created_by_run_id: "run-abc-123",
      is_superseded: false,
    },
  ],
  claims: [
    {
      id: "cl-1",
      claim_text: "Bell inequalities rule out local realism.",
      subtopic: "Quantum Foundations",
      status: "VERIFIED",
      confidence: 0.95,
      citation_doi: "10.1103/PhysRev.47.777",
      notes: "Verified against peer-reviewed experimental trials.",
      created_by_run_id: "run-abc-123",
      is_superseded: false,
    },
  ],
  created_at: "2026-10-14T10:00:00Z",
  updated_at: "2026-10-14T10:05:00Z",
};

describe("Research UI Component Safety & Master Plan Compliance", () => {
  describe("UnverifiedReportBanner", () => {
    it("renders prominent AI-generated unverified advisory with alert role", () => {
      render(<UnverifiedReportBanner />);
      const banner = screen.getByTestId("unverified-report-banner");
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveAttribute("role", "alert");
      expect(screen.getByText("Verify before you trust")).toBeInTheDocument();
      expect(screen.getByText("AI-Generated & Unverified")).toBeInTheDocument();
      expect(
        screen.getByText(/Research reports are synthesized by AI and unverified by default/i)
      ).toBeInTheDocument();
    });
  });

  describe("ClaimVerificationBadge", () => {
    it("displays claim-verification ratio rather than overall factual certainty", () => {
      render(
        <ClaimVerificationBadge
          verifiedCount={3}
          totalCount={4}
          confidenceScore={75.0}
        />
      );
      const badge = screen.getByTestId("claim-verification-badge");
      expect(badge).toHaveTextContent("Verified 3 of 4 extracted claims (75.0%)");
      // Ensure misleading certainty claims are absent
      expect(badge.textContent).not.toContain("factual certainty");
      expect(badge.textContent).not.toContain("truth score");
    });

    it("displays canonical abstained ratio when report abstains", () => {
      render(
        <ClaimVerificationBadge
          verifiedCount={0}
          totalCount={0}
          confidenceScore={0}
          isAbstain={true}
        />
      );
      expect(screen.getByTestId("claim-verification-badge-abstained")).toHaveTextContent(
        "Abstained (0 verified claims)"
      );
    });
  });

  describe("AbstainedNotice", () => {
    it("renders canonical insufficient evidence statement and diagnostic code", () => {
      render(
        <AbstainedNotice
          retrievalErrorCode="INSUFFICIENT_PEER_REVIEWED_EVIDENCE"
          retrievalErrorDetail="No peer-reviewed papers matching topic found."
        />
      );
      expect(screen.getByTestId("abstained-notice")).toBeInTheDocument();
      expect(
        screen.getByText(
          "The system could not find sufficient authoritative academic evidence on this topic to formulate a verifiable report."
        )
      ).toBeInTheDocument();
      expect(screen.getByText("INSUFFICIENT_PEER_REVIEWED_EVIDENCE")).toBeInTheDocument();
    });
  });

  describe("ArtifactHistoryDrawer", () => {
    it("renders toggle button with accessible aria attributes and hides superseded by default", () => {
      const handleToggle = vi.fn();
      const { rerender } = render(
        <ArtifactHistoryDrawer
          includeSuperseded={false}
          onToggleSuperseded={handleToggle}
          supersededCount={2}
        />
      );

      const toggleBtn = screen.getByTestId("toggle-superseded-button");
      expect(toggleBtn).toHaveAttribute("aria-pressed", "false");
      expect(toggleBtn).toHaveTextContent("Show superseded draft artifacts");

      fireEvent.click(toggleBtn);
      expect(handleToggle).toHaveBeenCalledWith(true);

      rerender(
        <ArtifactHistoryDrawer
          includeSuperseded={true}
          onToggleSuperseded={handleToggle}
          supersededCount={2}
        />
      );
      expect(screen.getByTestId("toggle-superseded-button")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByTestId("toggle-superseded-button")).toHaveTextContent("Hide superseded draft artifacts");
    });
  });

  describe("ResearchRateLimitModal", () => {
    it("renders accessible 429 concurrency modal with retry countdown", () => {
      const handleClose = vi.fn();
      render(
        <ResearchRateLimitModal
          isOpen={true}
          onClose={handleClose}
          retryAfterSeconds={10}
        />
      );

      const modal = screen.getByTestId("rate-limit-modal");
      expect(modal).toHaveAttribute("role", "dialog");
      expect(modal).toHaveAttribute("aria-modal", "true");
      expect(screen.getByText("Active Research Limit Reached")).toBeInTheDocument();
      expect(screen.getByText(/maximum allowed concurrent research pipelines/i)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("close-rate-limit-modal"));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("ResearchInquiryForm", () => {
    it("validates input length and submits valid inquiry topic", async () => {
      const handleSubmit = vi.fn().mockResolvedValue(undefined);
      render(<ResearchInquiryForm onSubmit={handleSubmit} isLoading={false} />);

      const input = screen.getByPlaceholderText(/Enter an academic topic or question/i);
      const submitBtn = screen.getByTestId("submit-research-button");

      // Short input (< 5 chars)
      fireEvent.change(input, { target: { value: "abc" } });
      fireEvent.click(submitBtn);
      expect(screen.getByText("Inquiry topic must be at least 5 characters long.")).toBeInTheDocument();
      expect(handleSubmit).not.toHaveBeenCalled();

      // Valid input
      fireEvent.change(input, { target: { value: "Thermodynamics in biological systems" } });
      fireEvent.click(submitBtn);
      expect(handleSubmit).toHaveBeenCalledWith("Thermodynamics in biological systems");
    });
  });

  describe("ResearchReportDetail", () => {
    it("renders sections, sources with DOIs, claims, and isolates superseded drafts", () => {
      const handleRerun = vi.fn();
      const handleToggle = vi.fn();

      const { rerender } = render(
        <ResearchReportDetail
          report={mockReport}
          onRerun={handleRerun}
          isRerunning={false}
          includeSuperseded={false}
          onToggleSuperseded={handleToggle}
        />
      );

      // Current section displayed
      expect(screen.getByText("1. EPR Paradox and Bell Inequalities")).toBeInTheDocument();
      // Superseded section NOT displayed when includeSuperseded = false
      expect(screen.queryByText(/Outdated Draft Section/i)).not.toBeInTheDocument();

      // DOI source displayed
      expect(screen.getByText("Peer-Reviewed DOI")).toBeInTheDocument();
      expect(screen.getByText("DOI: 10.1103/PhysRev.47.777")).toBeInTheDocument();

      // Claim displayed with status
      expect(screen.getByText('"Bell inequalities rule out local realism."')).toBeInTheDocument();
      expect(screen.getByText("Verified")).toBeInTheDocument();

      // When includeSuperseded is true, displays superseded draft
      rerender(
        <ResearchReportDetail
          report={mockReport}
          onRerun={handleRerun}
          isRerunning={false}
          includeSuperseded={true}
          onToggleSuperseded={handleToggle}
        />
      );
      expect(screen.getByText("2. Outdated Draft Section")).toBeInTheDocument();
    });

    it("renders AbstainedNotice and suppresses fabricated sections if report abstained", () => {
      const abstainedReport: ResearchReport = {
        ...mockReport,
        is_abstain: true,
        status: "COMPLETED",
        sections: [],
      };

      render(
        <ResearchReportDetail
          report={abstainedReport}
          onRerun={vi.fn()}
          isRerunning={false}
          includeSuperseded={false}
          onToggleSuperseded={vi.fn()}
        />
      );

      expect(screen.getByTestId("abstained-notice")).toBeInTheDocument();
      expect(screen.queryByText("Synthesized Sections")).not.toBeInTheDocument();
    });
  });
});
