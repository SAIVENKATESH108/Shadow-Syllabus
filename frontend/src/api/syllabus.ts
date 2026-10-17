import { ApiError } from "./research";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export interface SubjectSummary {
  id: string;
  name: string;
  code: string;
  university: string;
  university_code: string;
}

export interface SyllabusVersionSummary {
  id: string;
  label: string;
  year: number;
  total_marks: number;
}

export interface TopicWeight {
  id: string;
  name: string;
  unit_no: number;
  position: number;
  estimated_hours: number;
  score: number;
  weight: number;
  weight_percentage: number;
  expected_marks: number;
  appearances: number;
  last_year: number | null;
  years_asked: number[];
  yield_tier: "HIGH_YIELD" | "MEDIUM_YIELD" | "LOW_YIELD";
  is_blind_spot: boolean;
  is_dormant: boolean;
  rank: number;
}

export interface TopicsResponse {
  subject: SubjectSummary;
  syllabus_version: SyllabusVersionSummary;
  parameters: {
    half_life: number;
    current_year: number;
    decay_formula: string;
  };
  topics: TopicWeight[];
}

export interface BlindSpotItem {
  id: string;
  name: string;
  unit_no: number;
  position: number;
  estimated_hours: number;
  appearances: number;
  last_year: number | null;
  years_asked: number[];
  warning_type: string;
  warning_detail: string;
}

export interface BlindSpotsResponse {
  subject: SubjectSummary;
  syllabus_version: SyllabusVersionSummary;
  blind_spots_count: number;
  dormant_count: number;
  disclaimer: string;
  blind_spots: BlindSpotItem[];
  dormant_topics: BlindSpotItem[];
}

export interface EvidenceQuestion {
  question_id: string;
  number: string;
  marks: number;
  section: string;
  year: number;
  session: string;
  text_excerpt: string;
  confidence: number;
  rationale: string;
  is_verified: boolean;
}

export interface TopicEvidenceResponse {
  topic: {
    id: string;
    name: string;
    unit_no: number;
    position: number;
    estimated_hours: number;
  };
  total_mapped_questions: number;
  evidence: EvidenceQuestion[];
}

export interface StudyPlannerDaySchedule {
  day: number;
  allocated_hours: number;
  topic_id: string;
  topic_name: string;
  unit_no: number;
  priority_tier: string;
  expected_marks: number;
  is_reserve_slot: boolean;
}

export interface StudyPlannerResponse {
  strategy: string;
  total_days: number;
  hours_per_day: number;
  gross_hours: number;
  revision_reserve_hours: number;
  effective_study_hours: number;
  selected_topics_count: number;
  expected_marks_captured: number;
  total_curriculum_marks: number;
  coverage_percentage: number;
  selected_topics: Array<{
    id: string;
    name: string;
    unit_no: number;
    estimated_hours: number;
    expected_marks: number;
    yield_tier: string;
  }>;
  daily_schedule: StudyPlannerDaySchedule[];
}

export interface AccuracyReportResponse {
  dataset_size: number;
  active_strategy: string;
  agreement_accuracy: {
    top_1_accuracy: number;
    top_3_accuracy: number;
    macro_f1: number;
    evaluated_samples: number;
  };
  walk_forward_backtest: {
    strategy_improvement_pct: number;
    standard_deviation_pct: number;
    is_statistically_significant: boolean;
    statistical_note: string;
  };
  disclaimer: string;
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
      message = "Too Many Requests: Rate limit exceeded. Please wait before retrying.";
    } else if (res.status === 401) {
      message = "Authentication required.";
    } else if (res.status === 404) {
      message = "Requested syllabus resource not found.";
    } else if (typeof errorData === "object" && errorData !== null && "error" in errorData) {
      message = String((errorData as { error: unknown }).error);
    } else if (typeof errorData === "object" && errorData !== null && "detail" in errorData) {
      message = String((errorData as { detail: unknown }).detail);
    }

    throw new ApiError(message, res.status, errorData, retryAfterSeconds);
  }

  return res.json() as Promise<T>;
}

export async function getSyllabusSubjects(): Promise<SubjectSummary[]> {
  const res = await fetch(`${API_BASE}/api/v1/syllabus/subjects/`, {
    headers: { Accept: "application/json" },
    credentials: "include",
  });
  return handleResponse<SubjectSummary[]>(res);
}

export async function getSyllabusTopics(
  subjectCode = "CS-204",
  halfLife = 3.0,
  signal?: AbortSignal
): Promise<TopicsResponse> {
  const params = new URLSearchParams({
    subject_code: subjectCode,
    half_life: halfLife.toString(),
  });
  const res = await fetch(`${API_BASE}/api/v1/syllabus/topics/?${params.toString()}`, {
    headers: { Accept: "application/json" },
    credentials: "include",
    signal,
  });
  return handleResponse<TopicsResponse>(res);
}

export async function getSyllabusBlindSpots(
  subjectCode = "CS-204",
  signal?: AbortSignal
): Promise<BlindSpotsResponse> {
  const params = new URLSearchParams({ subject_code: subjectCode });
  const res = await fetch(`${API_BASE}/api/v1/syllabus/blind-spots/?${params.toString()}`, {
    headers: { Accept: "application/json" },
    credentials: "include",
    signal,
  });
  return handleResponse<BlindSpotsResponse>(res);
}

export async function getTopicEvidence(
  topicId: string,
  signal?: AbortSignal
): Promise<TopicEvidenceResponse> {
  const res = await fetch(`${API_BASE}/api/v1/syllabus/evidence/${topicId}/`, {
    headers: { Accept: "application/json" },
    credentials: "include",
    signal,
  });
  return handleResponse<TopicEvidenceResponse>(res);
}

export interface CalculatePlanParams {
  subject_code?: string;
  days_left: number;
  hours_per_day: number;
}

export async function calculateStudyPlan(
  params: CalculatePlanParams,
  signal?: AbortSignal
): Promise<StudyPlannerResponse> {
  const res = await fetch(`${API_BASE}/api/v1/syllabus/planner/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      subject_code: params.subject_code || "CS-204",
      days_left: params.days_left,
      hours_per_day: params.hours_per_day,
    }),
    signal,
  });
  return handleResponse<StudyPlannerResponse>(res);
}

export async function getAccuracyReport(
  strategy = "embeddings_only",
  signal?: AbortSignal
): Promise<AccuracyReportResponse> {
  const params = new URLSearchParams({ strategy });
  const res = await fetch(`${API_BASE}/api/v1/syllabus/accuracy-report/?${params.toString()}`, {
    headers: { Accept: "application/json" },
    credentials: "include",
    signal,
  });
  return handleResponse<AccuracyReportResponse>(res);
}
