import React from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  CalendarCheck,
  Shield,
} from "lucide-react";
import { UnverifiedBadge } from "../UnverifiedBadge";

export const StudyCoachScreen: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 sm:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-label-sm font-semibold text-academic-primary">
            <Bot className="w-5 h-5" aria-hidden="true" />
            <span>Socratic Pedagogical Assistant</span>
          </div>
          <h1 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 tracking-tight">
            AI Study Coach
          </h1>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-400 max-w-2xl">
            Socratic concept guidance and curriculum-aligned reasoning hints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <UnverifiedBadge />
          <Link
            to="/dashboard"
            className="min-h-[44px] px-4 py-2 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-semibold text-label-md rounded-xl hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Honest "Not Connected Yet" State Banner */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-8 sm:p-12 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural text-center space-y-6 max-w-3xl mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
            Feature Not Connected Yet
          </div>
          <h2 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-50">
            AI Study Coach Integration Pending
          </h2>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300 max-w-xl mx-auto">
            While prototype routing exists at <code className="px-1.5 py-0.5 rounded bg-academic-slate-100 dark:bg-academic-slate-700 font-mono text-[12px]">POST /api/v1/ai/coach/</code>, dedicated throttling, full-corpus RAG citation retrieval, and automated abstention pipelines are not yet fully implemented in the backend service.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700 text-left text-body-sm text-academic-slate-600 dark:text-academic-slate-400 space-y-2">
          <div className="font-semibold text-academic-slate-800 dark:text-academic-slate-200 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-academic-primary" />
            <span>Master Plan Integrity Disclosure</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-[13px]">
            <li>No mock or simulated AI responses are rendered as real backend data in production paths.</li>
            <li>Direct Socratic assistance will become active once fine-tuned educational models with verified DOI attribution are deployed.</li>
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/dashboard/syllabus/planner"
            className="min-h-[44px] px-6 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Use Study Planner Instead</span>
          </Link>
          <Link
            to="/dashboard/privacy"
            className="min-h-[44px] px-6 py-2.5 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-semibold text-label-md rounded-xl hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Review Privacy &amp; Data Rights</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
