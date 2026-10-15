import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  Compass,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";

export const DashboardHome: React.FC = () => {
  const { userProfile } = useUIStore();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 sm:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-label-sm font-semibold text-academic-primary">
            <GraduationCap className="w-5 h-5" />
            <span>Welcome back, {userProfile?.username || "Student"}!</span>
          </div>
          <h1 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50">
            Delhi University Distributed Systems (CS-204)
          </h1>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-400 max-w-2xl">
            Track high-yield syllabus weightage, execute discrete time-budget planning, and investigate multi-agent academic research reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/syllabus/planner"
            className="min-h-touch px-4 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Open Study Planner</span>
          </Link>
          <Link
            to="/dashboard/research"
            className="min-h-touch px-4 py-2.5 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-semibold text-label-md rounded-xl hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>New Research</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-academic-slate-500">Curriculum Target</span>
            <Compass className="w-4 h-4 text-academic-primary" />
          </div>
          <div className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-50">CS-204</div>
          <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">13 Modules Prescribed</div>
        </div>

        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-academic-slate-500">High-Yield Topics</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-headline-md font-bold text-emerald-600 dark:text-emerald-400">4 Modules</div>
          <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">Captures ~61.5% Weight</div>
        </div>

        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-academic-slate-500">Identified Blind Spots</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Caution</span>
          </div>
          <div className="text-headline-md font-bold text-amber-600 dark:text-amber-400">1 Topic</div>
          <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">DSM &amp; Cache Coherence</div>
        </div>

        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-academic-slate-500">Privacy Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-headline-md font-bold text-emerald-600 dark:text-emerald-400">Sovereign</div>
          <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">Zero Third-Party Trackers</div>
        </div>
      </div>

      {/* Main Workspace Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Shadow Syllabus */}
        <Link
          to="/dashboard/syllabus"
          className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-3 hover:border-academic-primary/50 transition group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
              Shadow Syllabus
            </h2>
            <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
              Explore the complete recency decay heatmap, topic rankings, OCR evidence provenance, and verified evaluation accuracy reports.
            </p>
          </div>
          <div className="text-label-sm font-semibold text-academic-primary inline-flex items-center gap-1.5 pt-2">
            <span>Open Syllabus Heatmap</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: 0/1 Knapsack Planner */}
        <Link
          to="/dashboard/syllabus/planner"
          className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-3 hover:border-academic-primary/50 transition group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
              0/1 Knapsack Study Planner
            </h2>
            <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
              Configure days left and daily study hours to generate a discrete mathematical study schedule with an integrated 15% blind-spot review buffer.
            </p>
          </div>
          <div className="text-label-sm font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5 pt-2">
            <span>Configure Schedule</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: Multi-Agent Deep Research */}
        <Link
          to="/dashboard/research"
          className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-3 hover:border-academic-primary/50 transition group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
              Multi-Agent Research
            </h2>
            <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
              Launch autonomous research pipelines that search authoritative open academic sources, cross-check claims, and audit peer-reviewed citations.
            </p>
          </div>
          <div className="text-label-sm font-semibold text-purple-600 dark:text-purple-400 inline-flex items-center gap-1.5 pt-2">
            <span>Launch Research</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};
