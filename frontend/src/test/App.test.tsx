import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import App from "../App";
import { UnverifiedBadge } from "../components/UnverifiedBadge";
import { useUIStore } from "../store/uiStore";

describe("Frontend Core & Security UI Tests", () => {
  beforeEach(() => {
    window.history.pushState({}, "Home", "/");
    useUIStore.setState({ isAuthenticated: true, locale: "en" });
  });

  it("renders the main application heading and approved non-assertive legal wording", async () => {
    render(<App />);
    expect(screen.getByText("Siksha OpenLearn")).toBeInTheDocument();
    expect(screen.getByText("Accessible Student Learning Platform")).toBeInTheDocument();
    expect(
      screen.getByText("Designed to support GDPR and India’s DPDP Act requirements; formal legal review is pending.")
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "Master Your University Syllabus with Honest, Empirical Intelligence",
        {},
        { timeout: 5000 }
      )
    ).toBeInTheDocument();
  });

  it("renders the unverified badge with correct disclaimer attribute", () => {
    render(<UnverifiedBadge />);
    const badge = screen.getByTestId("unverified-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Unverified AI Guidance");
  });

  it("renders public navigation links on the public landing page", () => {
    render(<App />);
    const publicNav = screen.getByRole("navigation", { name: "Public Navigation" });
    expect(within(publicNav).getByRole("link", { name: "Overview" })).toBeInTheDocument();
    expect(within(publicNav).getByRole("link", { name: "Syllabus Preview" })).toBeInTheDocument();
    expect(within(publicNav).getByRole("link", { name: "Privacy & Rights" })).toBeInTheDocument();
    const signInLinks = screen.getAllByRole("link", { name: /Sign In/i });
    expect(signInLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("navigates to public syllabus preview and privacy pages", () => {
    render(<App />);
    const publicNav = screen.getByRole("navigation", { name: "Public Navigation" });
    const syllabusLink = within(publicNav).getByRole("link", { name: "Syllabus Preview" });
    fireEvent.click(syllabusLink);
    expect(window.location.pathname).toBe("/syllabus");

    const privacyLink = within(publicNav).getByRole("link", { name: "Privacy & Rights" });
    fireEvent.click(privacyLink);
    expect(window.location.pathname).toBe("/privacy");
  });

  it("redirects unauthenticated users from protected dashboard routes to /signin", async () => {
    useUIStore.setState({ isAuthenticated: false });
    window.history.pushState({}, "Dashboard", "/dashboard");

    render(<App />);
    expect(window.location.pathname).toBe("/signin");
    expect(await screen.findByText("Sign In to Siksha OpenLearn", {}, { timeout: 5000 })).toBeInTheDocument();
  });

  it("renders authenticated dashboard layout with sidebar and breadcrumbs when authenticated", async () => {
    useUIStore.setState({ isAuthenticated: true });
    window.history.pushState({}, "Dashboard", "/dashboard");

    render(<App />);
    expect(screen.getByRole("navigation", { name: "Main Navigation" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Shadow Syllabus/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Study Planner/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Multi-Agent Research/i })).toBeInTheDocument();
    expect(await screen.findByText("Delhi University Distributed Systems (CS-204)", {}, { timeout: 5000 })).toBeInTheDocument();
  });

  it("toggles language between English and Hindi", () => {
    render(<App />);
    const langBtn = screen.getByRole("button", { name: "Switch Language" });
    fireEvent.click(langBtn);
    expect(screen.getByText("शिक्षा ओपनलर्न")).toBeInTheDocument();
  });

  it("validates sign-in form validation and prevents submission with invalid credentials", async () => {
    useUIStore.setState({ isAuthenticated: false });
    window.history.pushState({}, "Sign In", "/signin");

    render(<App />);
    expect(await screen.findByText("Sign In to Siksha OpenLearn")).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: /^Sign In$/i });
    const form = submitBtn.closest("form")!;

    // 1. Invalid email
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    fireEvent.submit(form);
    expect(await screen.findByRole("alert")).toHaveTextContent("Please provide a valid student or institutional email address.");

    // 2. Short password
    fireEvent.change(emailInput, { target: { value: "student@university.edu" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.submit(form);
    expect(await screen.findByRole("alert")).toHaveTextContent("Password must be at least 6 characters.");
  });

  it("supports dev-only synthetic demo sign-in and assigns non-privileged student role", async () => {
    useUIStore.setState({ isAuthenticated: false });
    window.history.pushState({}, "Sign In", "/signin");

    render(<App />);
    const demoBtn = await screen.findByTestId("dev-quick-demo-login-btn");
    expect(demoBtn).toBeInTheDocument();
    expect(screen.getByText(/DEV ONLY/i)).toBeInTheDocument();

    fireEvent.click(demoBtn);

    const store = useUIStore.getState();
    expect(store.isAuthenticated).toBe(true);
    expect(store.userProfile?.email).toBe("synthetic-demo-student@local.dev");
    expect(store.userProfile?.role).toBe("student");
  });

  it("handles sign-out flow clearing session state and revoking dashboard access", async () => {
    useUIStore.setState({
      isAuthenticated: true,
      userProfile: { username: "active_student", email: "student@university.edu", isMinor: false, isGuest: false, role: "student" },
    });
    window.history.pushState({}, "Dashboard", "/dashboard");

    render(<App />);
    expect(screen.getByRole("navigation", { name: "Main Navigation" })).toBeInTheDocument();

    const userMenuBtn = screen.getByRole("button", { name: /active_student/i });
    fireEvent.click(userMenuBtn);

    const signOutBtn = screen.getByRole("menuitem", { name: "Sign Out" });
    fireEvent.click(signOutBtn);

    const store = useUIStore.getState();
    expect(store.isAuthenticated).toBe(false);
    expect(store.userProfile).toBeNull();
  });
});
