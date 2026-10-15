import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  Compass,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 py-8 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-academic-primary/10 text-academic-primary dark:bg-academic-primary/20 dark:text-academic-slate-200 text-label-sm font-semibold border border-academic-primary/20">
          <Sparkles className="w-4 h-4" />
          <span>Open-Source University-Independent Study Platform</span>
        </div>

        <h1 className="text-display-sm sm:text-display-md font-bold text-academic-slate-900 dark:text-academic-slate-50 tracking-tight leading-tight">
          Master Your University Syllabus with Honest, Empirical Intelligence
        </h1>

        <p className="text-body-lg text-academic-slate-600 dark:text-academic-slate-300">
          Reverse-engineer exam trends through empirical recency decay, eliminate blind spots with 0/1 knapsack time budgeting, and conduct deep multi-agent academic research.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/signup"
            className="w-full sm:w-auto min-h-touch px-6 py-3 bg-academic-primary text-white font-semibold text-label-lg rounded-2xl hover:bg-academic-primary-hover shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/syllabus"
            className="w-full sm:w-auto min-h-touch px-6 py-3 bg-white dark:bg-academic-slate-800 text-academic-slate-800 dark:text-academic-slate-200 border border-academic-slate-200 dark:border-academic-slate-700 font-semibold text-label-lg rounded-2xl hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 transition flex items-center justify-center gap-2"
          >
            <Compass className="w-5 h-5 text-academic-primary" />
            <span>View Public Syllabus Preview</span>
          </Link>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Shadow Syllabus */}
        <div className="bg-white dark:bg-academic-slate-800 p-8 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4 hover:border-academic-primary/50 transition">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-50">
            Shadow Syllabus &amp; Heatmaps
          </h2>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-400">
            Exponential recency decay weighting (half-life H=3.0) calculates verified high-yield topics and warns against unexamined dormant modules.
          </p>
          <div className="pt-2">
            <Link
              to="/syllabus"
              className="text-label-md font-semibold text-academic-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Explore curriculum preview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Pillar 2: 0/1 Knapsack Planner */}
        <div className="bg-white dark:bg-academic-slate-800 p-8 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4 hover:border-academic-primary/50 transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h2 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-50">
            0/1 Knapsack Time Planner
          </h2>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-400">
            Discrete dynamic programming allocates your revision hours to maximize expected exam coverage while strictly reserving a 15% buffer for blind-spot review.
          </p>
          <div className="pt-2">
            <Link
              to="/signin"
              className="text-label-md font-semibold text-academic-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Access authenticated planner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Pillar 3: Multi-Agent Deep Research */}
        <div className="bg-white dark:bg-academic-slate-800 p-8 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4 hover:border-academic-primary/50 transition">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-50">
            Multi-Agent Deep Research
          </h2>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-400">
            Autonomous researcher, fact-checker, and writer agents cross-verify academic claims against peer-reviewed DOIs with prompt injection defense.
          </p>
          <div className="pt-2">
            <Link
              to="/signin"
              className="text-label-md font-semibold text-academic-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Launch research workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy Commitment Strip */}
      <section className="bg-white dark:bg-academic-slate-800 rounded-3xl p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-label-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Sovereign Data Rights &bull; Zero Dark Patterns</span>
          </div>
          <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-50">
            Designed for Student Privacy &amp; Data Protection
          </h3>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300 max-w-2xl">
            Designed to support GDPR and India’s DPDP Act requirements; formal legal review is pending. We never sell student data or train models without verifiable consent.
          </p>
        </div>

        <Link
          to="/privacy"
          className="min-h-touch px-5 py-2.5 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-semibold text-label-md rounded-xl hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex-shrink-0"
        >
          Read Privacy Charter
        </Link>
      </section>
    </div>
  );
};
