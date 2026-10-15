import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load data",
  message,
  onRetry,
  className = "",
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`min-h-[220px] flex flex-col items-center justify-center p-6 bg-white dark:bg-academic-slate-800 rounded-3xl border border-rose-200 dark:border-rose-900 shadow-structural text-center space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
          {title}
        </h3>
        <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="min-h-touch px-4 py-2 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-semibold text-label-md rounded-xl hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
