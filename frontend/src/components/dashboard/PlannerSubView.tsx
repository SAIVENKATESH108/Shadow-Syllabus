import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { ErrorState } from "../layout/ErrorState";

interface PlanTopic {
  id: string;
  name: string;
  unit_no: number;
  position: number;
  estimated_hours: number;
  expected_marks: number;
  yield_tier: string;
}

interface ScheduleDay {
  day: number;
  topics: Array<{ name: string; unit_no: string | number; estimated_hours: number }>;
  total_hours: number;
  is_revision_day?: boolean;
}

interface PlannerResponse {
  days_left: number;
  hours_per_day: number;
  total_available_hours: number;
  study_budget_hours: number;
  revision_reserve_hours: number;
  allocated_study_hours: number;
  expected_marks_captured: number;
  coverage_percentage: number;
  selected_topics: PlanTopic[];
  daily_schedule: ScheduleDay[];
}

export const PlannerSubView: React.FC = () => {
  const [daysLeft, setDaysLeft] = useState(10);
  const [hoursPerDay, setHoursPerDay] = useState(3.0);
  const [plan, setPlan] = useState<PlannerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = async (days: number, hours: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/syllabus/planner/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_code: "CS-204",
          days_left: days,
          hours_per_day: hours,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded (30 requests/min). Please pause before re-submitting.");
        }
        throw new Error(`Planner request failed with HTTP ${response.status}`);
      }

      const data = await response.json();
      setPlan(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to solve time-budget planner.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan(daysLeft, hoursPerDay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlan(daysLeft, hoursPerDay);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 sm:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-label-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <CalendarCheck className="w-4 h-4" />
            <span>0/1 Knapsack Discrete Time-Budget Optimization</span>
          </div>
          <h1 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 mt-1">
            Dynamic Study Schedule Planner
          </h1>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300 max-w-2xl mt-1">
            Allocates study hours to maximize expected exam score while strictly reserving 15% of your available budget for mock drill and blind-spot mitigation.
          </p>
        </div>

        <Link
          to="/dashboard/syllabus"
          className="min-h-touch px-4 py-2.5 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-semibold text-label-md rounded-xl hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex items-center gap-2 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Syllabus</span>
        </Link>
      </div>

      {/* Interactive Controls Form */}
      <form
        onSubmit={handleApply}
        className="bg-white dark:bg-academic-slate-800 p-6 sm:p-8 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Days Left Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="days-left" className="text-label-md font-bold text-academic-slate-800 dark:text-academic-slate-200">
                Days Remaining Until Exam
              </label>
              <span className="font-mono text-headline-sm font-bold text-academic-primary">
                {daysLeft} days
              </span>
            </div>
            <input
              id="days-left"
              type="range"
              min="1"
              max="60"
              value={daysLeft}
              onChange={(e) => setDaysLeft(Number(e.target.value))}
              className="w-full h-2 bg-academic-slate-200 dark:bg-academic-slate-700 rounded-lg appearance-none cursor-pointer accent-academic-primary"
            />
            <div className="flex justify-between text-[11px] text-academic-slate-400">
              <span>1 day (Emergency sprint)</span>
              <span>30 days</span>
              <span>60 days (Full semester)</span>
            </div>
          </div>

          {/* Hours Per Day Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="hours-per-day" className="text-label-md font-bold text-academic-slate-800 dark:text-academic-slate-200">
                Daily Study Capacity
              </label>
              <span className="font-mono text-headline-sm font-bold text-academic-primary">
                {hoursPerDay} hrs/day
              </span>
            </div>
            <input
              id="hours-per-day"
              type="range"
              min="1.0"
              max="12.0"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full h-2 bg-academic-slate-200 dark:bg-academic-slate-700 rounded-lg appearance-none cursor-pointer accent-academic-primary"
            />
            <div className="flex justify-between text-[11px] text-academic-slate-400">
              <span>1.0 hr (Light review)</span>
              <span>4.0 hrs (Standard)</span>
              <span>12.0 hrs (Deep immersion)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-academic-slate-200 dark:border-academic-slate-700">
          <div className="text-body-sm text-academic-slate-500">
            Rate limited to 30 requests/min for authenticated students.
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="min-h-touch px-6 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Solving Knapsack...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Recompute Schedule</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <ErrorState
          title="Optimization Error"
          message={error}
          onRetry={() => fetchPlan(daysLeft, hoursPerDay)}
        />
      )}

      {/* Results View */}
      {plan && !error && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-1">
              <div className="text-label-sm font-semibold text-academic-slate-500">Total Study Budget</div>
              <div className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-50 font-mono">
                {plan.total_available_hours} hrs
              </div>
              <div className="text-[12px] text-academic-slate-400">
                {plan.study_budget_hours}h study + {plan.revision_reserve_hours}h reserve (15%)
              </div>
            </div>

            <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-1">
              <div className="text-label-sm font-semibold text-academic-slate-500">Expected Exam Coverage</div>
              <div className="text-headline-md font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {plan.coverage_percentage}%
              </div>
              <div className="text-[12px] text-academic-slate-400">
                {plan.expected_marks_captured} / 100 marks captured
              </div>
            </div>

            <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-1">
              <div className="text-label-sm font-semibold text-academic-slate-500">Allocated Topics</div>
              <div className="text-headline-md font-bold text-academic-primary font-mono">
                {plan.selected_topics.length} Modules
              </div>
              <div className="text-[12px] text-academic-slate-400">
                Excludes non-leaf duplicate topics
              </div>
            </div>

            <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-1">
              <div className="text-label-sm font-semibold text-academic-slate-500">15% Revision Buffer</div>
              <div className="text-headline-md font-bold text-purple-600 dark:text-purple-400 font-mono">
                {plan.revision_reserve_hours} hrs
              </div>
              <div className="text-[12px] text-academic-slate-400">
                Guaranteed blind-spot drill days
              </div>
            </div>
          </div>

          {/* Day-by-Day Schedule List */}
          <div className="bg-white dark:bg-academic-slate-800 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-4">
              <div>
                <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
                  Pedagogical Day-by-Day Schedule
                </h2>
                <p className="text-body-sm text-academic-slate-500">
                  Strictly chronological by Unit and Curriculum Position to maintain conceptual dependencies.
                </p>
              </div>
              <span className="px-3 py-1 bg-academic-slate-100 dark:bg-academic-slate-700 rounded-full text-label-sm font-bold text-academic-slate-700 dark:text-academic-slate-300">
                {plan.daily_schedule.length} Days Planned
              </span>
            </div>

            <div className="space-y-4">
              {plan.daily_schedule.map((day) => (
                <div
                  key={day.day}
                  className={`p-5 rounded-2xl border transition ${
                    day.is_revision_day
                      ? "bg-purple-50/60 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800"
                      : "bg-academic-slate-50/80 dark:bg-academic-slate-900/60 border-academic-slate-200 dark:border-academic-slate-700"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-academic-primary text-white flex items-center justify-center font-bold text-label-md">
                        {day.day}
                      </span>
                      <span className="font-bold text-headline-sm text-academic-slate-900 dark:text-academic-slate-50">
                        Day {day.day}
                      </span>
                      {day.is_revision_day && (
                        <span className="px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                          15% Buffer &bull; Mock Exam Drill
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-label-sm font-semibold text-academic-slate-500">
                      <Clock className="w-4 h-4 text-academic-primary" />
                      <span>{day.total_hours} study hours</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {day.topics.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-academic-slate-800 border border-academic-slate-200 dark:border-academic-slate-700 text-body-md"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="truncate font-medium text-academic-slate-800 dark:text-academic-slate-200">
                            {t.name}
                          </span>
                        </div>
                        <div className="text-label-sm font-mono text-academic-slate-500 flex-shrink-0 ml-3">
                          {t.estimated_hours}h
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
