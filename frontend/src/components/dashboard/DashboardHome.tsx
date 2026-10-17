import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarCheck,
  Compass,
  GraduationCap,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Bot,
  FileText,
} from "lucide-react";
import { getCurrentUser } from "../../api/user";
import { getSyllabusTopics } from "../../api/syllabus";
import { getResearchReports } from "../../api/research";
import { useUIStore } from "../../store/uiStore";

export const DashboardHome: React.FC = () => {
  const { userProfile: storedProfile } = useUIStore();

  // 1. Current user query
  const {
    data: currentUser,
    isLoading: isLoadingUser,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: ({ signal }) => getCurrentUser(signal),
    staleTime: 5 * 60 * 1000,
  });

  // 2. Syllabus snapshot query
  const {
    data: syllabusData,
    isLoading: isLoadingSyllabus,
    error: syllabusError,
    refetch: refetchSyllabus,
  } = useQuery({
    queryKey: ["syllabusSnapshot", "CS-204"],
    queryFn: ({ signal }) => getSyllabusTopics("CS-204", 3.0, signal),
    staleTime: 2 * 60 * 1000,
  });

  // 3. Recent research reports query
  const {
    data: researchReports = [],
    isLoading: isLoadingResearch,
    error: researchError,
    refetch: refetchResearch,
  } = useQuery({
    queryKey: ["recentResearchReports"],
    queryFn: getResearchReports,
    staleTime: 30 * 1000,
  });

  const username = currentUser?.username || storedProfile?.username || "Student";
  const topics = syllabusData?.topics || [];
  const highYieldTopics = topics.filter((t) => t.yield_tier === "HIGH_YIELD");
  const blindSpotTopics = topics.filter((t) => t.is_blind_spot);
  const highYieldCoverage = highYieldTopics.reduce((acc, t) => acc + t.weight_percentage, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 sm:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-label-sm font-semibold text-academic-primary">
            <GraduationCap className="w-5 h-5" aria-hidden="true" />
            <span>Welcome back, {isLoadingUser ? "..." : username}!</span>
          </div>
          <h1 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 tracking-tight">
            {syllabusData?.subject?.name
              ? `${syllabusData.subject.university} ${syllabusData.subject.name} (${syllabusData.subject.code})`
              : "Delhi University Distributed Systems (CS-204)"}
          </h1>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-400 max-w-2xl">
            Track empirical syllabus weightages, execute discrete time-budget planning, and investigate multi-agent academic research reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/syllabus/planner"
            className="min-h-[44px] px-4 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
          >
            <CalendarCheck className="w-4 h-4" aria-hidden="true" />
            <span>Open Study Planner</span>
          </Link>
          <Link
            to="/dashboard/research"
            className="min-h-[44px] px-4 py-2.5 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-semibold text-label-md rounded-xl hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            <span>New Research</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Curriculum Target */}
        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-academic-slate-500">Curriculum Target</span>
            <Compass className="w-4 h-4 text-academic-primary" aria-hidden="true" />
          </div>
          <div className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-50">
            {isLoadingSyllabus ? "..." : syllabusData?.subject?.code || "CS-204"}
          </div>
          <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            {isLoadingSyllabus ? "Loading units..." : `${topics.length} Prescribed Modules`}
          </div>
        </div>

        {/* Card 2: High-Yield Topics */}
        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-academic-slate-500">High-Yield Topics</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="text-headline-md font-bold text-emerald-600 dark:text-emerald-400">
            {isLoadingSyllabus ? "..." : `${highYieldTopics.length} Modules`}
          </div>
          <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            {isLoadingSyllabus ? "Computing weight..." : `Captures ~${highYieldCoverage.toFixed(1)}% Weight`}
          </div>
        </div>

        {/* Card 3: Identified Blind Spots */}
        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-academic-slate-500">Identified Blind Spots</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Exam Risk
            </span>
          </div>
          <div className="text-headline-md font-bold text-amber-600 dark:text-amber-400">
            {isLoadingSyllabus ? "..." : `${blindSpotTopics.length} Topic${blindSpotTopics.length === 1 ? "" : "s"}`}
          </div>
          <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400 truncate">
            {isLoadingSyllabus ? "Analyzing..." : blindSpotTopics[0]?.name || "Zero blind spots detected"}
          </div>
        </div>

        {/* Card 4: Data Sovereignty */}
        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-academic-slate-500">Privacy Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="text-headline-md font-bold text-emerald-600 dark:text-emerald-400">
            {currentUser?.data_erasure_requested ? "Pending Erasure" : "Sovereign"}
          </div>
          <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Zero Third-Party Trackers
          </div>
        </div>
      </div>

      {/* Main Grid: Syllabus Quick Table & Recent Research Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Top High-Yield Syllabus Topics */}
        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-academic-slate-200 dark:border-academic-slate-700">
            <div className="space-y-0.5">
              <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50 flex items-center gap-2">
                <Compass className="w-5 h-5 text-academic-primary" aria-hidden="true" />
                <span>Top Weighted Topics</span>
              </h2>
              <p className="text-[12px] text-academic-slate-500 dark:text-academic-slate-400">
                Derived from past examination patterns with exponential recency weighting.
              </p>
            </div>
            <Link
              to="/dashboard/syllabus"
              className="text-label-sm font-semibold text-academic-primary hover:underline flex items-center gap-1 min-h-[44px] px-2"
            >
              <span>Full Heatmap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingSyllabus ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-academic-slate-100 dark:bg-academic-slate-700/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : syllabusError ? (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-body-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>Failed to load syllabus topics.</span>
              </div>
              <button
                type="button"
                onClick={() => refetchSyllabus()}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition flex items-center gap-1 text-label-sm min-h-[36px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : topics.length === 0 ? (
            <div className="p-6 text-center text-academic-slate-500 text-body-sm">
              No syllabus topics available for this course.
            </div>
          ) : (
            <div className="space-y-2.5">
              {topics.slice(0, 5).map((topic) => (
                <div
                  key={topic.id}
                  className="p-3 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-700/40 border border-academic-slate-200/80 dark:border-academic-slate-700 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-academic-primary/10 text-academic-primary">
                        Unit {topic.unit_no}
                      </span>
                      <span className="text-body-sm font-semibold text-academic-slate-800 dark:text-academic-slate-200 truncate">
                        {topic.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-academic-slate-500 dark:text-academic-slate-400 mt-0.5">
                      ~{topic.estimated_hours}h estimated study &bull; Last asked {topic.last_year || "N/A"}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-label-md font-bold text-academic-primary">
                      {topic.weight_percentage.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-academic-slate-400">weight</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Research Reports */}
        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-academic-slate-200 dark:border-academic-slate-700">
            <div className="space-y-0.5">
              <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                <span>Recent Research Reports</span>
              </h2>
              <p className="text-[12px] text-academic-slate-500 dark:text-academic-slate-400">
                Multi-agent academic synthesis, DOI citations, and fact-checked claims.
              </p>
            </div>
            <Link
              to="/dashboard/research"
              className="text-label-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 min-h-[44px] px-2"
            >
              <span>All Reports</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingResearch ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-academic-slate-100 dark:bg-academic-slate-700/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : researchError ? (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-body-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>Failed to load research reports.</span>
              </div>
              <button
                type="button"
                onClick={() => refetchResearch()}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition flex items-center gap-1 text-label-sm min-h-[36px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : researchReports.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                No research inquiries created yet. Launch an academic synthesis task to verify claims and citations.
              </div>
              <Link
                to="/dashboard/research"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-label-sm font-semibold rounded-xl hover:bg-purple-700 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Research</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {researchReports.slice(0, 4).map((report) => (
                <Link
                  key={report.id}
                  to={`/dashboard/research/${report.id}`}
                  className="p-3.5 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-700/40 border border-academic-slate-200/80 dark:border-academic-slate-700 flex items-center justify-between gap-3 hover:border-purple-400 dark:hover:border-purple-600 transition group block"
                >
                  <div className="min-w-0">
                    <div className="text-body-sm font-semibold text-academic-slate-800 dark:text-academic-slate-200 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {report.query}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-academic-slate-500 mt-1">
                      <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-academic-slate-200 dark:bg-academic-slate-600">
                        {report.status}
                      </span>
                      <span>&bull;</span>
                      <span>{new Date(report.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-academic-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shortcuts Grid: Study Coach & Study Planner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          to="/dashboard/study-coach"
          className="p-6 rounded-3xl bg-white dark:bg-academic-slate-800 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural hover:border-academic-primary/60 transition group flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-academic-primary/10 text-academic-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50 group-hover:text-academic-primary transition">
              AI Study Coach
            </div>
            <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400 mt-1">
              Ask conceptual questions and receive pedagogical step-by-step guidance. All guidance is explicitly labeled unverified.
            </p>
          </div>
        </Link>

        <Link
          to="/dashboard/syllabus/planner"
          className="p-6 rounded-3xl bg-white dark:bg-academic-slate-800 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural hover:border-academic-primary/60 transition group flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50 group-hover:text-emerald-600 transition">
              Knapsack Time Budget Planner
            </div>
            <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400 mt-1">
              Optimize study hours against marks yield with an automatic 15% revision reserve.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
