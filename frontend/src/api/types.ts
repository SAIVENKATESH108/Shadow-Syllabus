/**
 * Contract types generated and derived from docs/openapi_research.yaml via openapi-typescript.
 */
import type { components } from "./generated-schema";

export type ResearchStatus = components["schemas"]["StatusEnum"];

export const ACTIVE_RESEARCH_STATUSES: readonly ResearchStatus[] = [
  "PENDING",
  "ORCHESTRATING",
  "RESEARCHING",
  "FACT_CHECKING",
  "WRITING",
] as const;

export const TERMINAL_RESEARCH_STATUSES: readonly ResearchStatus[] = [
  "COMPLETED",
  "FAILED",
] as const;

export function isActiveResearchStatus(status: string): status is ResearchStatus {
  return (ACTIVE_RESEARCH_STATUSES as readonly string[]).includes(status);
}

export function isTerminalResearchStatus(status: string): status is ResearchStatus {
  return (TERMINAL_RESEARCH_STATUSES as readonly string[]).includes(status);
}

/**
 * Checks whether report is in an abstained state per backend specification:
 * status === "COMPLETED" && is_abstain === true
 */
export function isReportAbstained(report: { status: string; is_abstain: boolean }): boolean {
  return report.status === "COMPLETED" && report.is_abstain === true;
}

export interface ResearchSource {
  id: string;
  title: string;
  url: string;
  doi?: string;
  container?: string;
  is_peer_reviewed_doi: boolean;
  created_by_run_id: string;
  is_superseded: boolean;
}

export interface ResearchSection {
  id: string;
  title: string;
  order_index: number;
  content: string;
  citations: string[] | Record<string, unknown>;
  created_by_run_id: string;
  is_superseded: boolean;
}

export interface ResearchClaim {
  id: string;
  claim_text: string;
  subtopic: string;
  status: "VERIFIED" | "REFUTED" | "UNVERIFIED";
  confidence: number;
  citation_doi?: string;
  notes?: string;
  created_by_run_id: string;
  is_superseded: boolean;
}

/**
 * ResearchReport strictly derived from components["schemas"]["ResearchReport"]
 * with strongly-typed relation collections.
 */
export interface ResearchReport
  extends Omit<components["schemas"]["ResearchReport"], "sections" | "sources" | "claims"> {
  sections: ResearchSection[];
  sources: ResearchSource[];
  claims: ResearchClaim[];
}

export interface CreateResearchInquiryPayload {
  query: string;
  idempotency_key?: string;
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  code?: string;
  retry_after?: number;
}
