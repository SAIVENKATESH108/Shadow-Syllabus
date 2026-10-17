import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useUIStore } from "../store/uiStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

function renderLayout(initialRoute = "/dashboard") {
  window.history.pushState({}, "Dashboard", initialRoute);
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DashboardLayout />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe("DashboardLayout Application Shell & Navigation Contracts", () => {
  beforeEach(() => {
    useUIStore.setState({ isAuthenticated: true, locale: "en" });
  });

  it("renders fixed sidebar, top bar, and independently scrollable main container", () => {
    renderLayout("/dashboard");

    // 1. Fixed sidebar landmark
    const sidebarNav = screen.getByRole("navigation", { name: "Main Navigation" });
    expect(sidebarNav).toBeInTheDocument();
    const sidebarAside = sidebarNav.closest("aside");
    expect(sidebarAside).toHaveClass("w-64");

    // 2. Fixed top bar header without breadcrumbs
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("fixed");
    expect(header).toHaveClass("lg:left-64");
    // Verify breadcrumbs are NOT inside the top bar
    expect(header.querySelector('nav[aria-label="Breadcrumb"]')).toBeNull();

    // 3. Main content area contains the breadcrumb navigation landmark
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    const breadcrumbNav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumbNav).toBeInTheDocument();
    expect(main.contains(breadcrumbNav)).toBe(true);

    // 4. Scrollable container wraps the main element
    const scrollContainer = main.parentElement;
    expect(scrollContainer).toHaveClass("overflow-y-auto");
    expect(scrollContainer).toHaveClass("h-screen");
  });

  it("renders all implemented routes in the sidebar and omits unimplemented routes", () => {
    renderLayout("/dashboard");
    const sidebarNav = screen.getByRole("navigation", { name: "Main Navigation" });

    // Implemented routes
    expect(sidebarNav.querySelector('a[href="/dashboard"]')).toBeInTheDocument();
    expect(sidebarNav.querySelector('a[href="/dashboard/syllabus"]')).toBeInTheDocument();
    expect(sidebarNav.querySelector('a[href="/dashboard/research"]')).toBeInTheDocument();
    expect(sidebarNav.querySelector('a[href="/dashboard/profile"]')).toBeInTheDocument();
    expect(sidebarNav.querySelector('a[href="/dashboard/privacy"]')).toBeInTheDocument();

    // Unimplemented or unverified routes must be omitted
    expect(sidebarNav.querySelector('a[href="/dashboard/study-coach"]')).toBeNull();
    expect(sidebarNav.querySelector('a[href="/dashboard/syllabus/papers"]')).toBeNull();
  });

  it("sets aria-current='page' on active route link", () => {
    renderLayout("/dashboard/syllabus");
    const sidebarNav = screen.getByRole("navigation", { name: "Main Navigation" });
    const syllabusLink = sidebarNav.querySelector('a[href="/dashboard/syllabus"]')!;
    expect(syllabusLink).toHaveAttribute("aria-current", "page");

    const dashboardLink = sidebarNav.querySelector('a[href="/dashboard"]')!;
    expect(dashboardLink).not.toHaveAttribute("aria-current");
  });

  it("renders non-assertive legal footer text in the layout shell", () => {
    renderLayout("/dashboard");
    expect(
      screen.getByText("Designed to support GDPR and India’s DPDP Act requirements. Formal legal review is pending.")
    ).toBeInTheDocument();
  });

  it("opens mobile drawer and manages Escape key dismissal", () => {
    renderLayout("/dashboard");

    // Drawer should initially not be open
    expect(screen.queryByRole("dialog", { name: "Mobile Navigation" })).not.toBeInTheDocument();

    // Click mobile menu button
    const menuBtn = screen.getByRole("button", { name: "Open navigation menu" });
    fireEvent.click(menuBtn);

    // Drawer opens
    const drawer = screen.getByRole("dialog", { name: "Mobile Navigation" });
    expect(drawer).toBeInTheDocument();

    // Press Escape to close
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Mobile Navigation" })).not.toBeInTheDocument();
  });
});
