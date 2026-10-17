import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardHome } from "../components/dashboard/DashboardHome";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

describe("DashboardHome Data-Driven Screen", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches live syllabus and user profile data successfully", async () => {
    const mockTopicsResponse = {
      subject: {
        id: "sub-1",
        name: "Distributed Systems",
        code: "CS-204",
        university: "University of Delhi",
        university_code: "DU",
      },
      syllabus_version: {
        id: "ver-1",
        label: "2024 CBCS",
        year: 2024,
        total_marks: 100,
      },
      parameters: {
        half_life: 3.0,
        current_year: 2024,
        decay_formula: "0.5 ** ((current_year - year) / H)",
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
          years_asked: [2024, 2023],
          yield_tier: "HIGH_YIELD",
          is_blind_spot: false,
          is_dormant: false,
          rank: 1,
        },
      ],
    };

    const mockReports = [
      {
        id: "rep-1",
        query: "Raft Consensus Invariant Verification",
        status: "COMPLETED",
        created_at: "2026-10-15T10:00:00Z",
      },
    ];

    vi.spyOn(global, "fetch").mockImplementation((url) => {
      const urlStr = String(url);
      if (urlStr.includes("/api/v1/syllabus/topics/")) {
        return Promise.resolve(new Response(JSON.stringify(mockTopicsResponse), { status: 200 }));
      }
      if (urlStr.includes("/api/v1/research/reports/")) {
        return Promise.resolve(new Response(JSON.stringify(mockReports), { status: 200 }));
      }
      if (urlStr.includes("/api/v1/auth/me/")) {
        return Promise.resolve(
          new Response(JSON.stringify({ id: "usr-1", username: "Sai Venkatesh", email: "sai@du.ac.in" }), {
            status: 200,
          })
        );
      }
      return Promise.resolve(new Response("Not Found", { status: 404 }));
    });

    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <DashboardHome />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Welcome back, Sai Venkatesh!")).toBeInTheDocument();
      expect(screen.getByText(/University of Delhi Distributed Systems/)).toBeInTheDocument();
      expect(screen.getByText("Logical Clocks (Lamport Timestamps & Vector Clocks)")).toBeInTheDocument();
      expect(screen.getByText("Raft Consensus Invariant Verification")).toBeInTheDocument();
    });
  });

  it("handles empty research reports gracefully", async () => {
    vi.spyOn(global, "fetch").mockImplementation((url) => {
      const urlStr = String(url);
      if (urlStr.includes("/api/v1/research/reports/")) {
        return Promise.resolve(new Response(JSON.stringify([]), { status: 200 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ topics: [] }), { status: 200 }));
    });

    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <DashboardHome />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No research inquiries created yet/)).toBeInTheDocument();
    });
  });

  it("handles syllabus network error with retry button", async () => {
    vi.spyOn(global, "fetch").mockImplementation((url) => {
      const urlStr = String(url);
      if (urlStr.includes("/api/v1/syllabus/topics/")) {
        return Promise.resolve(new Response("Internal Server Error", { status: 500 }));
      }
      return Promise.resolve(new Response(JSON.stringify([]), { status: 200 }));
    });

    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <DashboardHome />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to load syllabus topics.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
    });
  });
});
