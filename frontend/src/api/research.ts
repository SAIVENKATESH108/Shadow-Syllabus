import { CreateResearchInquiryPayload, ResearchReport } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export class ApiError extends Error {
  status: number;
  data: unknown;
  retryAfterSeconds?: number;

  constructor(message: string, status: number, data: unknown, retryAfterSeconds?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorData: unknown = null;
    try {
      errorData = await res.json();
    } catch {
      errorData = await res.text();
    }

    const retryAfter = res.headers.get("Retry-After");
    const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;

    let message = `API request failed with status ${res.status}`;
    if (res.status === 429) {
      message = "Too Many Requests: Concurrency limit reached. Maximum 3 parallel research tasks allowed.";
    } else if (res.status === 401) {
      message = "Authentication required to access research reports.";
    } else if (res.status === 404) {
      message = "Research report not found or access denied.";
    } else if (typeof errorData === "object" && errorData !== null && "detail" in errorData) {
      message = String((errorData as { detail: unknown }).detail);
    }

    throw new ApiError(message, res.status, errorData, retryAfterSeconds);
  }

  return res.json() as Promise<T>;
}

export async function getResearchReports(): Promise<ResearchReport[]> {
  const res = await fetch(`${API_BASE}/api/v1/research/reports/`, {
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });
  return handleResponse<ResearchReport[]>(res);
}

export async function createResearchInquiry(payload: CreateResearchInquiryPayload): Promise<ResearchReport> {
  const res = await fetch(`${API_BASE}/api/v1/research/reports/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return handleResponse<ResearchReport>(res);
}

export async function getResearchReport(id: string, includeSuperseded = false): Promise<ResearchReport> {
  const queryParam = includeSuperseded ? "?include_superseded=true" : "";
  const res = await fetch(`${API_BASE}/api/v1/research/reports/${id}/${queryParam}`, {
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });
  return handleResponse<ResearchReport>(res);
}

export async function rerunResearchReport(id: string): Promise<ResearchReport> {
  const res = await fetch(`${API_BASE}/api/v1/research/reports/${id}/rerun/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });
  return handleResponse<ResearchReport>(res);
}
