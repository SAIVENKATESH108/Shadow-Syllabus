import { Query } from "@tanstack/react-query";
import { ResearchReport, isActiveResearchStatus, isTerminalResearchStatus } from "./types";
import { ApiError } from "./research";

export const POLLING_INTERVAL_MS = 3000;

export interface PollingState {
  isPollingActive: boolean;
  stopReason?: "TERMINAL_STATUS" | "AUTH_ERROR" | "NOT_FOUND" | "RATE_LIMITED" | "TERMINAL_ERROR";
}

/**
 * Determines whether TanStack Query should continue polling the research report.
 * Strictly adheres to Master Plan:
 * - Polls ONLY during active backend statuses ("PENDING", "ORCHESTRATING", "RESEARCHING", "FACT_CHECKING", "WRITING")
 * - Immediately halts on terminal statuses ("COMPLETED", "FAILED")
 * - Immediately halts on 401 (Auth required) and 404 (Not found)
 * - Returns false / halts on 429 concurrency exhaustion so rate limit modal can handle retry
 */
export function calculateResearchRefetchInterval(
  query: Query<ResearchReport | null, Error, ResearchReport | null>
): number | false {
  // If the query is in an error state
  if (query.state.error) {
    const error = query.state.error;
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403 || error.status === 404 || error.status === 429) {
        return false;
      }
    }
    return false;
  }

  const report = query.state.data;
  if (!report) {
    return false;
  }

  // Active status -> continue polling
  if (isActiveResearchStatus(report.status)) {
    return POLLING_INTERVAL_MS;
  }

  // Terminal status (COMPLETED, FAILED) -> halt polling immediately
  if (isTerminalResearchStatus(report.status)) {
    return false;
  }

  // Exhaustive safety: unknown or unanticipated status -> halt polling immediately
  return false;
}
