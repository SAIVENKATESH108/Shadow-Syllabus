import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Compass,
  ShieldAlert,
} from "lucide-react";
import { PageSkeleton } from "../layout/PageSkeleton";

interface TopicPreview {
  id: string;
  name: string;
  unit_no: number;
  weight_percentage: number;
  yield_tier: string;
  is_blind_spot: boolean;
  is_dormant: boolean;
  estimated_hours: number;
}

export const PublicSyllabusPreview: React.FC = () => {
  const [topics, setTopics] = useState<TopicPreview[]>([]);
  const [subjectInfo, setSubjectInfo] = useState<{
    name: string;
    code: string;
    university: string;
    year: number;
    total_marks: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/syllabus/topics/?subject_code=CS-204")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSubjectInfo({
          name: data.subject.name,
          code: data.subject.code,
          university: data.subject.university,
          year: data.syllabus_version.year,
          total_marks: data.syllabus_version.total_marks,
        });
        setTopics(data.topics || []);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback preview data conforming to non-sensitive curriculum metadata only
        setSubjectInfo({
          name: "Distributed Systems",
          code: "CS-204",
          university: "University of Delhi",
          year: 2024,
          total_marks: 100,
        });
        setTopics([
          {
            id: "1",
            name: "Logical Clocks (Lamport Timestamps & Vector Clocks)",
            unit_no: 2,
            weight_percentage: 18.2,
            yield_tier: "HIGH_YIELD",
            is_blind_spot: false,
            is_dormant: false,
            estimated_hours: 4.5,
          },
          {
            id: "2",
            name: "Consensus in Crash-Fault Environments (Raft & Paxos)",
            unit_no: 3,
            weight_percentage: 16.4,
            yield_tier: "HIGH_YIELD",
            is_blind_spot: false,
            is_dormant: false,
            estimated_hours: 5.0,
          },
          {
            id: "3",
            name: "Distributed Mutual Exclusion (Ricart-Agrawala, Maekawa)",
            unit_no: 2,
            weight_percentage: 14.1,
            yield_tier: "HIGH_YIELD",
            is_blind_spot: false,
            is_dormant: false,
            estimated_hours: 4.0,
          },
          {
            id: "4",
            name: "Distributed Transactions & Two-Phase Commit (2PC)",
            unit_no: 4,
            weight_percentage: 12.8,
            yield_tier: "HIGH_YIELD",
            is_blind_spot: false,
            is_dormant: false,
            estimated_hours: 4.5,
          },
          {
            id: "5",
            name: "Distributed Shared Memory & Cache Coherence",
            unit_no: 4,
            weight_percentage: 0.0,
            yield_tier: "LOW_YIELD",
            is_blind_spot: true,
            is_dormant: false,
            estimated_hours: 3.5,
          },
        ]);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 sm:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-label-sm font-semibold text-academic-primary">
            <Compass className="w-4 h-4" />
            <span>Public Curriculum Preview &bull; Academic Year {subjectInfo?.year}</span>
          </div>
          <h1 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 mt-1">
            {subjectInfo?.name} ({subjectInfo?.code})
          </h1>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300 mt-1">
            {subjectInfo?.university} &bull; Total Prescribed Marks: {subjectInfo?.total_marks}
          </p>
        </div>

        <Link
          to="/signup"
          className="min-h-touch px-5 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2 flex-shrink-0"
        >
          <span>Unlock Full Dynamic Planner</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Public/Private Data Boundary Notice */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-body-sm text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Public Preview Scope:</span> This preview displays non-sensitive curriculum metadata, aggregate recency weightages, and blind-spot risk flags. Full OCR question excerpts, interactive 0/1 knapsack budget planning, and private research history are restricted to authenticated accounts.
        </div>
      </div>

      {/* Curriculum Heatmap Table Preview */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural overflow-hidden">
        <div className="p-6 border-b border-academic-slate-200 dark:border-academic-slate-700">
          <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
            Curriculum Topic Weightage Summary
          </h2>
          <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Computed using half-life decay (H=3.0) against historical examination sessions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-md">
            <thead className="bg-academic-slate-50 dark:bg-academic-slate-900/60 text-label-sm text-academic-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Unit</th>
                <th className="px-6 py-3.5">Topic Name</th>
                <th className="px-6 py-3.5">Yield Tier</th>
                <th className="px-6 py-3.5 text-right">Aggregate Weight</th>
                <th className="px-6 py-3.5">Exam Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-academic-slate-200 dark:divide-academic-slate-700">
              {topics.map((t) => (
                <tr key={t.id} className="hover:bg-academic-slate-50 dark:hover:bg-academic-slate-700/40 transition">
                  <td className="px-6 py-4 font-mono text-label-md font-semibold text-academic-slate-600 dark:text-academic-slate-400">
                    Unit {t.unit_no}
                  </td>
                  <td className="px-6 py-4 font-medium text-academic-slate-900 dark:text-academic-slate-50">
                    {t.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-label-sm font-bold ${
                        t.yield_tier === "HIGH_YIELD"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : t.yield_tier === "MEDIUM_YIELD"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-academic-slate-100 text-academic-slate-700 dark:bg-academic-slate-700 dark:text-academic-slate-300"
                      }`}
                    >
                      {t.yield_tier.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-academic-slate-900 dark:text-academic-slate-50 font-mono">
                    {t.weight_percentage}%
                  </td>
                  <td className="px-6 py-4">
                    {t.is_blind_spot ? (
                      <span className="inline-flex items-center gap-1.5 text-label-sm font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Blind Spot</span>
                      </span>
                    ) : t.is_dormant ? (
                      <span className="inline-flex items-center gap-1.5 text-label-sm font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                        <span>Dormant (&ge;3y)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-label-sm font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sign-in Callout for Authenticated Features */}
      <div className="bg-academic-primary/10 dark:bg-academic-primary/20 rounded-3xl p-6 sm:p-8 border border-academic-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
            Ready to plan your preparation?
          </h3>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300">
            Sign in to run the 0/1 knapsack study planner with custom daily study budgets.
          </p>
        </div>
        <Link
          to="/signin"
          className="min-h-touch px-6 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex-shrink-0"
        >
          Sign In Now
        </Link>
      </div>
    </div>
  );
};
