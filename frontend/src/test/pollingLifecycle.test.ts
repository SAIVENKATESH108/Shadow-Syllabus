import { describe, it, expect } from "vitest";
import { calculateResearchRefetchInterval, POLLING_INTERVAL_MS } from "../api/polling";
import { ResearchReport, ResearchStatus } from "../api/types";
import { ApiError } from "../api/research";
import { Query } from "@tanstack/react-query";

function createMockQuery(
  data: Partial<ResearchReport> | null,
  error: Error | null = null
): Query<ResearchReport | null, Error, ResearchReport | null> {
  return {
    state: {
      data: data as ResearchReport | null,
      error,
      status: error ? "error" : data ? "success" : "pending",
      fetchStatus: "idle",
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: error ? Date.now() : 0,
    },
  } as unknown as Query<ResearchReport | null, Error, ResearchReport | null>;
}

describe("Research Polling Lifecycle & Backoff Rules", () => {
  it("polls during all active backend statuses", () => {
    const activeStatuses: ResearchStatus[] = [
      "PENDING",
      "ORCHESTRATING",
      "RESEARCHING",
      "FACT_CHECKING",
      "WRITING",
    ];

    activeStatuses.forEach((status) => {
      const query = createMockQuery({ status, id: "test-id" });
      const interval = calculateResearchRefetchInterval(query);
      expect(interval).toBe(POLLING_INTERVAL_MS);
    });
  });

  it("stops polling immediately on terminal COMPLETED status", () => {
    const query = createMockQuery({ status: "COMPLETED", id: "test-id" });
    const interval = calculateResearchRefetchInterval(query);
    expect(interval).toBe(false);
  });

  it("stops polling immediately on terminal FAILED status", () => {
    const query = createMockQuery({ status: "FAILED", id: "test-id" });
    const interval = calculateResearchRefetchInterval(query);
    expect(interval).toBe(false);
  });

  it("stops polling immediately on 401 Unauthorized error", () => {
    const authError = new ApiError("Authentication required", 401, null);
    const query = createMockQuery(null, authError);
    const interval = calculateResearchRefetchInterval(query);
    expect(interval).toBe(false);
  });

  it("stops polling immediately on 404 Not Found error", () => {
    const notFoundError = new ApiError("Report not found", 404, null);
    const query = createMockQuery(null, notFoundError);
    const interval = calculateResearchRefetchInterval(query);
    expect(interval).toBe(false);
  });

  it("halts polling on 429 Too Many Requests to prevent defeating backend concurrency caps", () => {
    const rateLimitError = new ApiError("Concurrency limit reached", 429, null, 15);
    const query = createMockQuery(null, rateLimitError);
    const interval = calculateResearchRefetchInterval(query);
    expect(interval).toBe(false);
  });

  it("halts polling if status is unrecognized or malformed", () => {
    const query = createMockQuery({ status: "UNKNOWN_CUSTOM" as ResearchStatus, id: "test-id" });
    const interval = calculateResearchRefetchInterval(query);
    expect(interval).toBe(false);
  });

  it("halts polling when data is null or empty", () => {
    const query = createMockQuery(null);
    const interval = calculateResearchRefetchInterval(query);
    expect(interval).toBe(false);
  });
});
