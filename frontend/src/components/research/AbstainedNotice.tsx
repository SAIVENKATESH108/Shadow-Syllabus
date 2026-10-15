import React from "react";
import { ShieldAlert, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AbstainedNoticeProps {
  retrievalErrorCode?: string;
  retrievalErrorDetail?: string;
  className?: string;
}

export const AbstainedNotice: React.FC<AbstainedNoticeProps> = ({
  retrievalErrorCode,
  retrievalErrorDetail,
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <div
      role="region"
      aria-label="Research Abstention Notice"
      className={`bg-academic-slate-50 dark:bg-academic-slate-800/60 border-2 border-academic-slate-300 dark:border-academic-slate-700 rounded-xl p-6 text-academic-slate-800 dark:text-academic-slate-100 shadow-structural space-y-4 ${className}`}
      data-testid="abstained-notice"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-academic-slate-200 dark:bg-academic-slate-700 rounded-lg text-academic-slate-700 dark:text-academic-slate-200 flex-shrink-0 mt-0.5">
          <ShieldAlert className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
            {t("research.abstainTitle", "Research Abstained: Insufficient Evidence")}
          </h3>
          <p className="text-body-md text-academic-slate-700 dark:text-academic-slate-300 leading-relaxed font-medium">
            {t(
              "research.abstainMessage",
              "The system could not find sufficient authoritative academic evidence on this topic to formulate a verifiable report."
            )}
          </p>
        </div>
      </div>

      {(retrievalErrorCode || retrievalErrorDetail) && (
        <div className="bg-white dark:bg-academic-slate-900 border border-academic-slate-200 dark:border-academic-slate-700 rounded-lg p-3 text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
          <span className="font-semibold text-academic-slate-800 dark:text-academic-slate-200">
            Diagnostic Code:
          </span>{" "}
          <code>{retrievalErrorCode || "INSUFFICIENT_EVIDENCE"}</code>
          {retrievalErrorDetail && <p className="mt-1 text-label-md">{retrievalErrorDetail}</p>}
        </div>
      )}

      <div className="pt-2 border-t border-academic-slate-200 dark:border-academic-slate-700">
        <h4 className="text-label-md font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-2 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          Recommended Next Steps:
        </h4>
        <ul className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400 space-y-1 list-disc list-inside">
          <li>Refine or broaden the academic terminology in your query.</li>
          <li>Check for common synonyms, standard scientific taxonomy, or accredited course catalog nomenclature.</li>
          <li>Ensure the topic is not restricted by robots.txt or protected commercial repositories.</li>
        </ul>
      </div>
    </div>
  );
};
