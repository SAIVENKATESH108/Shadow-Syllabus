import React, { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";
import { MobileDrawer } from "./MobileDrawer";
import { PageSkeleton } from "./PageSkeleton";
import { RouteErrorBoundary } from "./RouteErrorBoundary";
import { Breadcrumbs } from "./Breadcrumbs";
import { useUIStore } from "../../store/uiStore";

export const DashboardLayout: React.FC = () => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { highContrast } = useUIStore();

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex bg-academic-slate-50 dark:bg-academic-slate-900 text-academic-slate-900 dark:text-academic-slate-50 transition-colors ${
        highContrast ? "contrast-125" : ""
      }`}
    >
      {/* Desktop Fixed Left Sidebar */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 w-64 z-30 flex-col">
        <DashboardSidebar />
      </div>

      {/* Mobile Off-Canvas Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Fixed Top Bar (spans content area on desktop) */}
      <DashboardTopBar
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Independently Scrollable Main Content Region */}
      <div className="lg:pl-64 pt-16 w-full h-screen overflow-y-auto flex flex-col focus:outline-none">
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto outline-none animate-fadeIn flex flex-col"
        >
          {/* Breadcrumbs inside main content */}
          <Breadcrumbs />

          <RouteErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </RouteErrorBoundary>
        </main>

        {/* Compliant Non-Statutory Footer */}
        <footer className="border-t border-academic-slate-200 dark:border-academic-slate-700 py-4 px-6 text-center text-label-sm text-academic-slate-500 dark:text-academic-slate-400 bg-white dark:bg-academic-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              Designed to support GDPR and India’s DPDP Act requirements. Formal legal review is pending.
            </div>
            <div className="text-[11px]">
              Siksha OpenLearn &bull; Licensed under Apache 2.0 / MIT
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
