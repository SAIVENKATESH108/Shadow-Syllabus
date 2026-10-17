import { ApiError } from "./research";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export interface AIStudyCoachRequest {
  prompt: string;
  context?: string;
}

export interface AIStudyCoachResponse {
  content: string;
  model_name: string;
  is_unverified: boolean;
  confidence_score: number | null;
  provenance: string;
}

export async function requestStudyCoach(
  payload: AIStudyCoachRequest,
  signal?: AbortSignal
): Promise<AIStudyCoachResponse> {
  const res = await fetch(`${API_BASE}/api/v1/ai/coach/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    let errorData: unknown = null;
    try {
      errorData = await res.json();
    } catch {
      errorData = await res.text();
    }

    const retryAfter = res.headers.get("Retry-After");
    const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;

    let message = `AI Coach request failed with status ${res.status}`;
    if (res.status === 401) {
      message = "Authentication required to interact with the AI Study Coach.";
    } else if (res.status === 429) {
      message = "Too Many Requests: Rate limit exceeded. Please wait before asking another question.";
    } else if (typeof errorData === "object" && errorData !== null && "detail" in errorData) {
      message = String((errorData as { detail: unknown }).detail);
    }

    throw new ApiError(message, res.status, errorData, retryAfterSeconds);
  }

  return res.json() as Promise<AIStudyCoachResponse>;
}
