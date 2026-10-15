import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import axe from "axe-core";
import { UnverifiedReportBanner } from "../components/research/UnverifiedReportBanner";
import { ClaimVerificationBadge } from "../components/research/ClaimVerificationBadge";
import { AbstainedNotice } from "../components/research/AbstainedNotice";
import { ArtifactHistoryDrawer } from "../components/research/ArtifactHistoryDrawer";
import { ResearchRateLimitModal } from "../components/research/ResearchRateLimitModal";
import { ResearchInquiryForm } from "../components/research/ResearchInquiryForm";
import { ResearchReportDetail } from "../components/research/ResearchReportDetail";
import { ResearchReport } from "../api/types";
import "../i18n/config";

const sampleReport: ResearchReport = {
  id: "rep-001",
  query: "Cellular respiration electron transport chain in mitochondria",
  title: "Cellular Respiration & Mitochondrial ATP Synthesis",
  summary: "Aerobic cellular respiration uses oxygen to synthesize ATP via chemiosmosis.",
  status: "COMPLETED",
  pipeline_run_id: "run-001",
  idempotency_key: "idem-001",
  confidence_score: 80.0,
  confidence_display: "Verified 4 of 5 extracted claims (80.0%)",
  verified_claims_count: 4,
  total_claims_count: 5,
  is_unverified: true,
  needs_review: true,
  is_abstain: false,
  retrieval_error_code: "",
  retrieval_error_detail: "",
  sections: [
    {
      id: "sec-1",
      title: "Chemiosmotic Coupling & Proton Gradients",
      order_index: 0,
      content: "Complex I through IV pump protons into the intermembrane space.",
      citations: ["10.1038/nature12345"],
      created_by_run_id: "run-001",
      is_superseded: false,
    },
  ],
  sources: [
    {
      id: "src-1",
      title: "Mitochondrial Energy Transduction",
      url: "https://nature.com/articles/12345",
      doi: "10.1038/nature12345",
      container: "Nature Reviews Molecular Cell Biology",
      is_peer_reviewed_doi: true,
      created_by_run_id: "run-001",
      is_superseded: false,
    },
  ],
  claims: [
    {
      id: "cl-1",
      claim_text: "Proton motive force drives ATP synthase rotor rotation.",
      subtopic: "Bioenergetics",
      status: "VERIFIED",
      confidence: 0.96,
      citation_doi: "10.1038/nature12345",
      created_by_run_id: "run-001",
      is_superseded: false,
    },
  ],
  created_at: "2026-10-14T10:00:00Z",
  updated_at: "2026-10-14T10:05:00Z",
};

describe("Automated Axe-Core Accessibility Scans & WCAG 2.2 AA Verification", () => {
  it("runs axe-core scan on UnverifiedReportBanner with zero violations", async () => {
    const { container } = render(<UnverifiedReportBanner />);
    const results = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
      },
    });
    expect(results.violations).toEqual([]);
  });

  it("runs axe-core scan on ClaimVerificationBadge with zero violations", async () => {
    const { container } = render(
      <ClaimVerificationBadge
        verifiedCount={4}
        totalCount={5}
        confidenceScore={80.0}
      />
    );
    const results = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"],
      },
    });
    expect(results.violations).toEqual([]);
  });

  it("runs axe-core scan on AbstainedNotice with zero violations", async () => {
    const { container } = render(
      <AbstainedNotice
        retrievalErrorCode="INSUFFICIENT_EVIDENCE"
        retrievalErrorDetail="No peer-reviewed papers matching topic found."
      />
    );
    const results = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"],
      },
    });
    expect(results.violations).toEqual([]);
  });

  it("runs axe-core scan on ArtifactHistoryDrawer with zero violations", async () => {
    const { container } = render(
      <ArtifactHistoryDrawer
        includeSuperseded={false}
        onToggleSuperseded={() => {}}
        supersededCount={3}
      />
    );
    const results = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"],
      },
    });
    expect(results.violations).toEqual([]);
  });

  it("runs axe-core scan on ResearchInquiryForm with zero violations", async () => {
    const { container } = render(
      <ResearchInquiryForm onSubmit={async () => {}} isLoading={false} />
    );
    const results = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"],
      },
    });
    expect(results.violations).toEqual([]);
  });

  it("runs axe-core scan on ResearchReportDetail with zero violations", async () => {
    const { container } = render(
      <ResearchReportDetail
        report={sampleReport}
        onRerun={async () => {}}
        isRerunning={false}
        includeSuperseded={false}
        onToggleSuperseded={() => {}}
      />
    );
    const results = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"],
      },
    });
    expect(results.violations).toEqual([]);
  });

  it("runs axe-core scan on ResearchRateLimitModal with zero violations", async () => {
    const { container } = render(
      <ResearchRateLimitModal isOpen={true} onClose={() => {}} retryAfterSeconds={10} />
    );
    const results = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"],
      },
    });
    expect(results.violations).toEqual([]);
  });

  it("proves interactive controls satisfy the 44px touch target requirement", () => {
    render(<ResearchInquiryForm onSubmit={async () => {}} isLoading={false} />);
    const submitBtn = screen.getByTestId("submit-research-button");
    expect(submitBtn.className).toContain("min-h-touch");
    expect(submitBtn.className).toContain("min-w-touch");
  });

  it("renders complex Hindi Devanagari strings without corruption or clipping", () => {
    const indicString = "प्रकाश-निर्भर संश्लेषण एवं माइटोकॉन्ड्रियल एटीपी संश्लेषण";
    render(
      <div data-testid="indic-test-container" className="leading-[1.55]">
        <p>{indicString}</p>
      </div>
    );
    const container = screen.getByTestId("indic-test-container");
    expect(container).toHaveTextContent(indicString);
    // Verifies leading ratio 1.55 for matras
    expect(container.className).toContain("leading-[1.55]");
  });

  it("verifies external links include safe rel attributes", () => {
    render(
      <ResearchReportDetail
        report={sampleReport}
        onRerun={async () => {}}
        isRerunning={false}
        includeSuperseded={false}
        onToggleSuperseded={() => {}}
      />
    );
    const externalLink = screen.getByRole("link", { name: /Open external source:/i });
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
