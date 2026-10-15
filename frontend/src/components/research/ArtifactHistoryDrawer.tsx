import React from "react";
import { History, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ArtifactHistoryDrawerProps {
  includeSuperseded: boolean;
  onToggleSuperseded: (include: boolean) => void;
  supersededCount: number;
  className?: string;
}

export const ArtifactHistoryDrawer: React.FC<ArtifactHistoryDrawerProps> = ({
  includeSuperseded,
  onToggleSuperseded,
  supersededCount,
  className = "",
}) => {
  const { t } = useTranslation();

  if (supersededCount === 0 && !includeSuperseded) {
    return null;
  }

  return (
    <div
      className={`p-3 bg-academic-slate-100 dark:bg-academic-slate-800/80 rounded-xl border border-academic-slate-300 dark:border-academic-slate-700 flex flex-wrap items-center justify-between gap-3 ${className}`}
      data-testid="artifact-history-drawer"
    >
      <div className="flex items-center gap-2 text-body-sm text-academic-slate-700 dark:text-academic-slate-300">
        <History className="w-4 h-4 text-academic-slate-500" aria-hidden="true" />
        <span>
          Prior Draft Runs:{" "}
          <strong className="text-academic-slate-900 dark:text-academic-slate-100">
            {supersededCount} superseded artifact{supersededCount === 1 ? "" : "s"}
          </strong>
        </span>
      </div>

      <button
        type="button"
        onClick={() => onToggleSuperseded(!includeSuperseded)}
        aria-pressed={includeSuperseded}
        className="min-h-touch min-w-touch px-4 py-2 text-label-md font-semibold rounded-lg border border-academic-slate-300 dark:border-academic-slate-600 bg-white dark:bg-academic-slate-900 text-academic-slate-800 dark:text-academic-slate-200 hover:bg-academic-slate-50 dark:hover:bg-academic-slate-800 focus-visible:ring-2 focus-visible:ring-academic-primary transition inline-flex items-center gap-2"
        data-testid="toggle-superseded-button"
      >
        {includeSuperseded ? (
          <>
            <EyeOff className="w-4 h-4" aria-hidden="true" />
            <span>{t("research.hideSuperseded", "Hide superseded draft artifacts")}</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" aria-hidden="true" />
            <span>{t("research.showSuperseded", "Show superseded draft artifacts")}</span>
          </>
        )}
      </button>
    </div>
  );
};
