import { ApiError } from "./research";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  age?: number;
  is_minor?: boolean;
  parental_consent_verified?: boolean;
  data_erasure_requested?: boolean;
  erasure_requested_at?: string | null;
  created_at?: string;
}

export async function getCurrentUser(signal?: AbortSignal): Promise<UserProfileResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/me/`, {
    headers: { Accept: "application/json" },
    credentials: "include",
    signal,
  });

  if (!res.ok) {
    let errorData: unknown = null;
    try {
      errorData = await res.json();
    } catch {
      errorData = await res.text();
    }
    throw new ApiError(`Failed to fetch current user profile (${res.status})`, res.status, errorData);
  }

  return res.json() as Promise<UserProfileResponse>;
}

export async function requestDataErasure(signal?: AbortSignal): Promise<{ detail: string }> {
  const res = await fetch(`${API_BASE}/api/v1/auth/erasure-request/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    signal,
  });

  if (!res.ok) {
    let errorData: unknown = null;
    try {
      errorData = await res.json();
    } catch {
      errorData = await res.text();
    }
    throw new ApiError("Failed to submit data erasure request", res.status, errorData);
  }

  return res.json() as Promise<{ detail: string }>;
}
