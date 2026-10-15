import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      role="region"
      aria-label={title}
      className={`min-h-[280px] flex flex-col items-center justify-center p-8 bg-white dark:bg-academic-slate-800 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural text-center space-y-4 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-500 dark:text-academic-slate-400 flex items-center justify-center">
        <Icon className="w-7 h-7" aria-hidden="true" />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
          {title}
        </h3>
        <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-400">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="min-h-touch px-4 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
