import React from "react";

export const PageSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-6 animate-pulse max-w-7xl mx-auto p-4 sm:p-6"
    >
      <span className="sr-only">Loading page content...</span>

      {/* Top Banner Skeleton */}
      <div className="h-32 bg-academic-slate-200 dark:bg-academic-slate-800 rounded-3xl" />

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-academic-slate-200 dark:bg-academic-slate-800 rounded-2xl"
          />
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-academic-slate-200 dark:bg-academic-slate-800 rounded-3xl" />
        <div className="h-96 bg-academic-slate-200 dark:bg-academic-slate-800 rounded-3xl" />
      </div>
    </div>
  );
};
