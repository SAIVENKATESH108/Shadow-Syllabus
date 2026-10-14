import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";
import { UnverifiedBadge } from "../components/UnverifiedBadge";

describe("Frontend Core & Security UI Tests", () => {
  it("renders the main application heading and privacy compliance banner", () => {
    render(<App />);
    expect(screen.getByText("Open Learning Platform")).toBeInTheDocument();
    expect(screen.getByText("GDPR & DPDP Compliant")).toBeInTheDocument();
    expect(screen.getByText(/Privacy Notice:/i)).toBeInTheDocument();
  });

  it("renders the unverified badge with correct disclaimer attribute", () => {
    render(<UnverifiedBadge />);
    const badge = screen.getByTestId("unverified-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Unverified AI Guidance");
  });
});
