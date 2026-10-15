import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  ACTIVE_RESEARCH_STATUSES,
  TERMINAL_RESEARCH_STATUSES,
  ResearchStatus,
  isReportAbstained,
  isActiveResearchStatus,
  isTerminalResearchStatus,
} from "../api/types";

describe("OpenAPI Contract Drift Verification", () => {
  const openApiPath = path.resolve(__dirname, "../../../docs/openapi_research.yaml");

  it("proves docs/openapi_research.yaml exists and is accessible", () => {
    expect(fs.existsSync(openApiPath)).toBe(true);
  });

  it("verifies StatusEnum in docs/openapi_research.yaml matches frontend status types exactly", () => {
    const yamlContent = fs.readFileSync(openApiPath, "utf-8");

    // Extract StatusEnum block reliably across CRLF/LF line endings
    const statusEnumSection = yamlContent.split("StatusEnum:")[1]?.split("type: string")[0] || "";
    const backendStatuses = statusEnumSection
      .split(/\r?\n/)
      .map((line: string) => line.trim())
      .filter((line: string) => line.startsWith("- "))
      .map((line: string) => line.replace("- ", "").trim());

    // Expected: ["PENDING", "ORCHESTRATING", "RESEARCHING", "FACT_CHECKING", "WRITING", "COMPLETED", "FAILED"]
    expect(backendStatuses).toEqual([
      "PENDING",
      "ORCHESTRATING",
      "RESEARCHING",
      "FACT_CHECKING",
      "WRITING",
      "COMPLETED",
      "FAILED",
    ]);

    // Combine active + terminal statuses from frontend types
    const allFrontendStatuses: ResearchStatus[] = [
      ...ACTIVE_RESEARCH_STATUSES,
      ...TERMINAL_RESEARCH_STATUSES,
    ];

    // Assert that every backend status is handled in frontend
    backendStatuses.forEach((status: string) => {
      expect(allFrontendStatuses).toContain(status as ResearchStatus);
    });

    // Assert no extra statuses are invented in frontend
    expect([...allFrontendStatuses].sort()).toEqual([...backendStatuses].sort());

    // Verify separation between active and terminal
    expect(ACTIVE_RESEARCH_STATUSES).toEqual([
      "PENDING",
      "ORCHESTRATING",
      "RESEARCHING",
      "FACT_CHECKING",
      "WRITING",
    ]);
    expect(TERMINAL_RESEARCH_STATUSES).toEqual(["COMPLETED", "FAILED"]);
  });

  it("verifies ResearchReport schema in OpenAPI defines is_abstain and required honesty fields", () => {
    const yamlContent = fs.readFileSync(openApiPath, "utf-8");

    // ResearchReport properties
    expect(yamlContent).toContain("is_abstain:");
    expect(yamlContent).toContain("is_unverified:");
    expect(yamlContent).toContain("confidence_display:");
    expect(yamlContent).toContain("pipeline_run_id:");
    expect(yamlContent).toContain("verified_claims_count:");
    expect(yamlContent).toContain("total_claims_count:");
  });

  it("verifies abstention contract: only reports with status COMPLETED and is_abstain true are abstained", () => {
    expect(isReportAbstained({ status: "COMPLETED", is_abstain: true })).toBe(true);
    expect(isReportAbstained({ status: "COMPLETED", is_abstain: false })).toBe(false);
    expect(isReportAbstained({ status: "PENDING", is_abstain: true })).toBe(false);
    expect(isReportAbstained({ status: "FAILED", is_abstain: true })).toBe(false);
  });

  it("verifies isActiveResearchStatus and isTerminalResearchStatus exhaustiveness", () => {
    expect(isActiveResearchStatus("PENDING")).toBe(true);
    expect(isActiveResearchStatus("ORCHESTRATING")).toBe(true);
    expect(isActiveResearchStatus("RESEARCHING")).toBe(true);
    expect(isActiveResearchStatus("FACT_CHECKING")).toBe(true);
    expect(isActiveResearchStatus("WRITING")).toBe(true);
    expect(isActiveResearchStatus("COMPLETED")).toBe(false);
    expect(isActiveResearchStatus("FAILED")).toBe(false);
    expect(isActiveResearchStatus("INVALID_STATUS")).toBe(false);

    expect(isTerminalResearchStatus("COMPLETED")).toBe(true);
    expect(isTerminalResearchStatus("FAILED")).toBe(true);
    expect(isTerminalResearchStatus("WRITING")).toBe(false);
    expect(isTerminalResearchStatus("INVALID_STATUS")).toBe(false);
  });
});
