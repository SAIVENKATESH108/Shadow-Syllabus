import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PublicLayout } from "./components/layout/PublicLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import "./i18n/config";

// Route-Level Code-Splitting with React.lazy()
const LandingPage = React.lazy(() =>
  import("./components/public/LandingPage").then((m) => ({ default: m.LandingPage }))
);
const SignInPage = React.lazy(() =>
  import("./components/public/SignInPage").then((m) => ({ default: m.SignInPage }))
);
const SignUpPage = React.lazy(() =>
  import("./components/public/SignUpPage").then((m) => ({ default: m.SignUpPage }))
);
const PublicPrivacyPage = React.lazy(() =>
  import("./components/public/PublicPrivacyPage").then((m) => ({ default: m.PublicPrivacyPage }))
);
const PublicSyllabusPreview = React.lazy(() =>
  import("./components/public/PublicSyllabusPreview").then((m) => ({ default: m.PublicSyllabusPreview }))
);

const DashboardHome = React.lazy(() =>
  import("./components/dashboard/DashboardHome").then((m) => ({ default: m.DashboardHome }))
);
const ShadowSyllabusScreen = React.lazy(() =>
  import("./components/screens/ShadowSyllabusScreen").then((m) => ({ default: m.ShadowSyllabusScreen }))
);
const PlannerSubView = React.lazy(() =>
  import("./components/dashboard/PlannerSubView").then((m) => ({ default: m.PlannerSubView }))
);
const ResearchView = React.lazy(() =>
  import("./components/research/ResearchView").then((m) => ({ default: m.ResearchView }))
);
const ResearchReportDetailView = React.lazy(() =>
  import("./components/dashboard/ResearchReportDetailView").then((m) => ({ default: m.ResearchReportDetailView }))
);
const ProfilePage = React.lazy(() =>
  import("./components/dashboard/ProfilePage").then((m) => ({ default: m.ProfilePage }))
);
const PrivacyCenterScreen = React.lazy(() =>
  import("./components/screens/PrivacyCenterScreen").then((m) => ({ default: m.PrivacyCenterScreen }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Canonical Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/privacy" element={<PublicPrivacyPage />} />
        <Route path="/syllabus" element={<PublicSyllabusPreview />} />
      </Route>

      {/* Canonical Authenticated Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/syllabus" element={<ShadowSyllabusScreen />} />
          <Route path="/dashboard/syllabus/planner" element={<PlannerSubView />} />
          <Route path="/dashboard/research" element={<ResearchView />} />
          <Route path="/dashboard/research/:id" element={<ResearchReportDetailView />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/privacy" element={<PrivacyCenterScreen />} />
        </Route>
      </Route>

      {/* Catch-All Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
