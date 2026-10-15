import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ShadowSyllabusScreen } from "../components/screens/ShadowSyllabusScreen";

describe("ShadowSyllabusScreen Component", () => {
  it("renders the academic scope and institutional responsibility notice", () => {
    render(<ShadowSyllabusScreen />);

    // Institutional scope
    expect(screen.getByText("University of Delhi (DU)")).toBeInTheDocument();
    expect(screen.getByText(/CS-204: Distributed Systems/)).toBeInTheDocument();

    // Responsibility notice
    expect(screen.getByText(/Academic Responsibility Notice:/)).toBeInTheDocument();
    expect(screen.getByText(/historical exam-pattern risk/)).toBeInTheDocument();
  });

  it("renders the top topic heatmap and yield tiers", () => {
    render(<ShadowSyllabusScreen />);

    // Verify key topics are displayed in the heatmap
    expect(screen.getByText("Logical Clocks (Lamport Timestamps & Vector Clocks)")).toBeInTheDocument();
    expect(screen.getByText("Consensus in Crash-Fault Environments (Raft & Paxos)")).toBeInTheDocument();

    // Verify Yield tier badges
    const highYieldBadges = screen.getAllByText(/High Yield/i);
    expect(highYieldBadges.length).toBeGreaterThan(0);
  });

  it("opens and closes the Topic Evidence Drawer modal", () => {
    render(<ShadowSyllabusScreen />);

    // Click on Inspect Evidence for Logical Clocks
    const inspectButtons = screen.getAllByText("Inspect Evidence");
    fireEvent.click(inspectButtons[0]);

    // Modal should be open with provenance
    expect(screen.getByText(/Unit 2.1 Evidence Trail/)).toBeInTheDocument();
    expect(screen.getByText(/Total Questions Mapped:/)).toBeInTheDocument();

    // Close the modal
    const closeButton = screen.getByText("Close Evidence");
    fireEvent.click(closeButton);

    expect(screen.queryByText(/Unit 2.1 Evidence Trail/)).not.toBeInTheDocument();
  });

  it("navigates to Planner tab and calculates 15% revision reserve", () => {
    render(<ShadowSyllabusScreen />);

    // Switch to Planner tab
    const plannerTab = screen.getByText(/Time-Budget Knapsack Planner/);
    fireEvent.click(plannerTab);

    // Default: 10 days * 3 hours = 30h total
    // 15% reserve = 4.5h -> study budget = 25.5h
    expect(screen.getByText("30h")).toBeInTheDocument();
    expect(screen.getByText("4.5h")).toBeInTheDocument();
    expect(screen.getByText("25.5h")).toBeInTheDocument();

    // Adjust days left slider to 5
    const daysSlider = screen.getByDisplayValue("10");
    fireEvent.change(daysSlider, { target: { value: "5" } });

    // 5 days * 3 hours = 15h total
    expect(screen.getByText("15h")).toBeInTheDocument();
  });

  it("navigates to Curriculum Blind Spots tab and shows flagged unexamined topics", () => {
    render(<ShadowSyllabusScreen />);

    const blindSpotsTab = screen.getByText(/Blind-Spot & Dormant Warning Hub/);
    fireEvent.click(blindSpotsTab);

    expect(screen.getByText("Curriculum Blind-Spot & Dormant Warning Hub")).toBeInTheDocument();
    expect(screen.getByText("Unit 4.4: Security & Authentication in Open Distributed Systems")).toBeInTheDocument();
    expect(screen.getByText("Institutional Syllabus Blind Spot (0 Questions)")).toBeInTheDocument();
    expect(screen.getByText("Unit 4.3: Distributed Shared Memory & Cache Coherence")).toBeInTheDocument();
  });

  it("navigates to Backtest & Accuracy tab and displays measured benchmark metrics", () => {
    render(<ShadowSyllabusScreen />);

    const backtestTab = screen.getByText(/Measured Accuracy & Backtest Proof/);
    fireEvent.click(backtestTab);

    expect(screen.getByText(/105-Question Hand-Labelled Benchmark/)).toBeInTheDocument();
    expect(screen.getByText("91.4%")).toBeInTheDocument();
    expect(screen.getByText("95.2%")).toBeInTheDocument();
    expect(screen.getByText("54.9%")).toBeInTheDocument();
    expect(screen.getByText("+10.8%")).toBeInTheDocument();
  });
});
