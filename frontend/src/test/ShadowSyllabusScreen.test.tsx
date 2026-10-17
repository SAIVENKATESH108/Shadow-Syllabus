import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShadowSyllabusScreen } from "../components/screens/ShadowSyllabusScreen";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

const mockTopicsData = {
  subject: {
    id: "sub-1",
    name: "Distributed Systems",
    code: "CS-204",
    university: "University of Delhi (DU)",
    university_code: "DU",
  },
  syllabus_version: {
    id: "ver-1",
    label: "2024 CBCS",
    year: 2024,
    total_marks: 100,
  },
  topics: [
    {
      id: "u2_p1",
      name: "Logical Clocks (Lamport Timestamps & Vector Clocks)",
      unit_no: 2,
      position: 1,
      estimated_hours: 6.0,
      score: 28.4,
      weight: 0.248,
      weight_percentage: 24.8,
      expected_marks: 24.8,
      appearances: 4,
      last_year: 2024,
      years_asked: [2024, 2023, 2022],
      yield_tier: "HIGH_YIELD",
      is_blind_spot: false,
      is_dormant: false,
      rank: 1,
    },
    {
      id: "u3_p1",
      name: "Consensus in Crash-Fault Environments (Raft & Paxos)",
      unit_no: 3,
      position: 1,
      estimated_hours: 7.0,
      score: 26.8,
      weight: 0.234,
      weight_percentage: 23.4,
      expected_marks: 23.4,
      appearances: 3,
      last_year: 2024,
      years_asked: [2024, 2023],
      yield_tier: "HIGH_YIELD",
      is_blind_spot: false,
      is_dormant: false,
      rank: 2,
    },
  ],
};

const mockBlindSpotsData = {
  subject: mockTopicsData.subject,
  syllabus_version: mockTopicsData.syllabus_version,
  blind_spots_count: 1,
  dormant_count: 1,
  disclaimer: "Curriculum blind spots detected",
  blind_spots: [
    {
      id: "u4_p4",
      name: "Security & Authentication in Open Distributed Systems",
      unit_no: 4,
      position: 4,
      estimated_hours: 4.0,
      appearances: 0,
      last_year: null,
      years_asked: [],
      warning_type: "BLIND_SPOT",
      warning_detail: "Prescribed in syllabus but 0 questions recorded.",
    },
  ],
  dormant_topics: [
    {
      id: "u4_p3",
      name: "Distributed Shared Memory & Cache Coherence",
      unit_no: 4,
      position: 3,
      estimated_hours: 5.0,
      appearances: 1,
      last_year: 2019,
      years_asked: [2019],
      warning_type: "DORMANT",
      warning_detail: "Dormant for past 3 cycles.",
    },
  ],
};

const mockEvidenceData = {
  topic: {
    id: "u2_p1",
    name: "Logical Clocks (Lamport Timestamps & Vector Clocks)",
    unit_no: 2,
    position: 1,
    estimated_hours: 6.0,
  },
  total_mapped_questions: 4,
  evidence: [
    {
      question_id: "q-1",
      number: "3a",
      marks: 10,
      section: "Section B",
      year: 2024,
      session: "May-June",
      text_excerpt: "Explain the implementation of vector clocks in causal ordering.",
      confidence: 0.95,
      rationale: "Direct vector clock match",
      is_verified: true,
    },
  ],
};

const mockAccuracyData = {
  dataset_size: 105,
  active_strategy: "embeddings_only",
  agreement_accuracy: {
    top_1_accuracy: 0.9524,
    top_3_accuracy: 0.9143,
    macro_f1: 0.9555,
    evaluated_samples: 105,
  },
  walk_forward_backtest: {
    strategy_improvement_pct: 1.73,
    standard_deviation_pct: 4.24,
    is_statistically_significant: false,
    statistical_note: "Improvement is within standard deviation.",
  },
  disclaimer: "Historical pattern illustration",
};

describe("ShadowSyllabusScreen Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(global, "fetch").mockImplementation((url) => {
      const urlStr = String(url);
      if (urlStr.includes("/api/v1/syllabus/topics/")) {
        return Promise.resolve(new Response(JSON.stringify(mockTopicsData), { status: 200 }));
      }
      if (urlStr.includes("/api/v1/syllabus/blind-spots/")) {
        return Promise.resolve(new Response(JSON.stringify(mockBlindSpotsData), { status: 200 }));
      }
      if (urlStr.includes("/api/v1/syllabus/evidence/")) {
        return Promise.resolve(new Response(JSON.stringify(mockEvidenceData), { status: 200 }));
      }
      if (urlStr.includes("/api/v1/syllabus/accuracy-report/")) {
        return Promise.resolve(new Response(JSON.stringify(mockAccuracyData), { status: 200 }));
      }
      if (urlStr.includes("/api/v1/syllabus/planner/")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              strategy: "knapsack_dp",
              total_days: 10,
              hours_per_day: 3.0,
              gross_hours: 30,
              revision_reserve_hours: 4.5,
              effective_study_hours: 25.5,
              selected_topics_count: 2,
              expected_marks_captured: 48.2,
              total_curriculum_marks: 100,
              coverage_percentage: 48.2,
              selected_topics: [],
              daily_schedule: [
                {
                  day: 1,
                  allocated_hours: 3.0,
                  topic_id: "u2_p1",
                  topic_name: "Logical Clocks",
                  unit_no: 2,
                  priority_tier: "HIGH_YIELD",
                  expected_marks: 24.8,
                  is_reserve_slot: false,
                },
              ],
            }),
            { status: 200 }
          )
        );
      }
      return Promise.resolve(new Response("Not Found", { status: 404 }));
    });
  });

  function renderScreen() {
    const client = createTestQueryClient();
    return render(
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <ShadowSyllabusScreen />
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  it("renders the academic scope and institutional responsibility notice", async () => {
    renderScreen();

    expect(screen.getByText(/University of Delhi/)).toBeInTheDocument();
    expect(screen.getByText(/Distributed Systems/)).toBeInTheDocument();
    expect(screen.getByText(/Academic Responsibility Notice:/)).toBeInTheDocument();
    expect(screen.getByText(/historical exam-pattern risk/)).toBeInTheDocument();
  });

  it("renders the top topic heatmap and yield tiers", async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText("Logical Clocks (Lamport Timestamps & Vector Clocks)")).toBeInTheDocument();
      expect(screen.getByText("Consensus in Crash-Fault Environments (Raft & Paxos)")).toBeInTheDocument();
    });

    const highYieldBadges = screen.getAllByText(/High Yield/i);
    expect(highYieldBadges.length).toBeGreaterThan(0);
  });

  it("opens and closes the Topic Evidence Drawer modal fetching real evidence", async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getAllByText("Inspect Evidence").length).toBeGreaterThan(0);
    });

    const inspectButtons = screen.getAllByText("Inspect Evidence");
    fireEvent.click(inspectButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Unit 2.1 Evidence Trail/)).toBeInTheDocument();
      expect(screen.getByText(/Total Questions Mapped:/)).toBeInTheDocument();
      expect(screen.getByText(/Explain the implementation of vector clocks/)).toBeInTheDocument();
    });

    const closeButton = screen.getByText("Close Evidence");
    fireEvent.click(closeButton);

    expect(screen.queryByText(/Unit 2.1 Evidence Trail/)).not.toBeInTheDocument();
  });

  it("navigates to Planner tab and calculates 15% revision reserve via mutation", async () => {
    renderScreen();

    const plannerTab = screen.getByText(/Time-Budget Knapsack Planner/);
    fireEvent.click(plannerTab);

    await waitFor(() => {
      expect(screen.getByText("30 hrs")).toBeInTheDocument();
      expect(screen.getByText(/4.5h reserve/)).toBeInTheDocument();
      expect(screen.getByText(/25.5h study/)).toBeInTheDocument();
    });
  });

  it("navigates to Curriculum Blind Spots tab and shows flagged unexamined topics", async () => {
    renderScreen();

    const blindSpotsTab = screen.getByText(/Blind-Spot & Dormant Warning Hub/);
    fireEvent.click(blindSpotsTab);

    await waitFor(() => {
      expect(screen.getByText("Curriculum Blind-Spot & Dormant Warning Hub")).toBeInTheDocument();
      expect(screen.getByText(/Security & Authentication in Open Distributed Systems/)).toBeInTheDocument();
      expect(screen.getByText(/Distributed Shared Memory & Cache Coherence/)).toBeInTheDocument();
    });
  });

  it("navigates to Backtest & Accuracy tab and displays measured benchmark metrics", async () => {
    renderScreen();

    const backtestTab = screen.getByText(/Measured Accuracy & Backtest Proof/);
    fireEvent.click(backtestTab);

    await waitFor(() => {
      expect(screen.getByText(/105-Question Hand-Labelled Benchmark/)).toBeInTheDocument();
      expect(screen.getByText("95.2%")).toBeInTheDocument();
      expect(screen.getByText("91.4%")).toBeInTheDocument();
      expect(screen.getByText("54.9%")).toBeInTheDocument();
    });
  });
});
