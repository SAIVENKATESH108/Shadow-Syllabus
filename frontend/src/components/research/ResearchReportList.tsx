import React from "react";
import { ResearchReport, isReportAbstained } from "../../api/types";
import { Clock, CheckCircle2, AlertTriangle, FileText, ChevronRight, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ResearchReportListProps {
  reports: ResearchReport[];
  selectedReportId: string | null;
  onSelectReport: (id: string) => void;
  className?: string;
}

export const ResearchReportList: React.FC<ResearchReportListProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  className = "",
}) => {
  const { t, i18n } = useTranslation();

  const getStatusBadge = (report: Pick<ResearchReport, "status" | "is_abstain">) => {
    if (isReportAbstained(report)) {
      return (
        <span
          data-testid="status-abstained"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
        >
          <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
          {t("research.status.ABSTAINED", "Abstained (Insufficient Evidence)")}
        </span>
      );
    }

    switch (report.status) {
      case "COMPLETED":
        return (
          <span
            data-testid="status-completed"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
          >
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            {t("research.status.COMPLETED", "Completed")}
          </span>
        );
      case "PENDING":
      case "ORCHESTRATING":
      case "RESEARCHING":
      case "FACT_CHECKING":
      case "WRITING":
        return (
          <span
            data-testid={`status-${report.status.toLowerCase()}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
          >
            <Clock className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            {t(`research.status.${report.status}`, report.status)}
          </span>
        );
      case "FAILED":
        return (
          <span
            data-testid="status-failed"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-semibold bg-academic-danger-light dark:bg-red-950/40 text-academic-danger dark:text-red-400 border border-red-200 dark:border-red-800"
          >
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            {t("research.status.FAILED", "Failed")}
          </span>
        );
      default:
        // Exhaustive safety: unknown statuses NEVER render as completed
        return (
          <span
            data-testid="status-unknown"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-semibold bg-academic-slate-200 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300 border border-academic-slate-300"
          >
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            {t("research.status.UNKNOWN", "Unknown Status")}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat(i18n.language || "en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  return (
    <div
      className={`bg-white dark:bg-academic-slate-800 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 p-6 shadow-structural space-y-4 ${className}`}
      data-testid="research-report-list"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50 flex items-center gap-2">
          <FileText className="w-5 h-5 text-academic-primary" aria-hidden="true" />
          {t("research.recentReports", "Your Research Reports")}
        </h3>
        <span className="text-label-sm font-semibold text-academic-slate-500 dark:text-academic-slate-400">
          {reports.length} inquiry{reports.length === 1 ? "" : "ies"}
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="p-8 text-center text-body-sm text-academic-slate-500 dark:text-academic-slate-400 border border-dashed border-academic-slate-300 dark:border-academic-slate-700 rounded-xl">
          {t("research.noReports", "No research inquiries submitted yet.")}
        </div>
      ) : (
        <ul className="space-y-2.5" role="list">
          {reports.map((report) => {
            const isSelected = selectedReportId === report.id;
            return (
              <li key={report.id}>
                <button
                  type="button"
                  onClick={() => onSelectReport(report.id)}
                  aria-current={isSelected ? "true" : undefined}
                  className={`w-full min-h-touch p-4 rounded-xl border text-left transition focus-visible:ring-2 focus-visible:ring-academic-primary flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-academic-primary bg-academic-primary-light/30 dark:bg-academic-primary/10"
                      : "border-academic-slate-200 dark:border-academic-slate-700 hover:bg-academic-slate-50 dark:hover:bg-academic-slate-750"
                  }`}
                  data-testid={`report-item-${report.id}`}
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(report)}
                      <span className="text-label-sm text-academic-slate-500 dark:text-academic-slate-400">
                        {formatDate(report.created_at)}
                      </span>
                    </div>
                    <h4 className="text-body-md font-semibold text-academic-slate-900 dark:text-academic-slate-100 truncate">
                      {report.title || report.query}
                    </h4>
                    <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400 truncate">
                      {report.confidence_display}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 flex-shrink-0 transition ${
                      isSelected ? "text-academic-primary" : "text-academic-slate-400"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
