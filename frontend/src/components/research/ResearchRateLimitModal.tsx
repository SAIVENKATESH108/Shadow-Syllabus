import React, { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ResearchRateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  retryAfterSeconds?: number;
}

export const ResearchRateLimitModal: React.FC<ResearchRateLimitModalProps> = ({
  isOpen,
  onClose,
  retryAfterSeconds = 15,
}) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(retryAfterSeconds);

  useEffect(() => {
    if (!isOpen) return;
    setCountdown(retryAfterSeconds);
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, retryAfterSeconds]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rate-limit-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      data-testid="rate-limit-modal"
    >
      <div className="bg-white dark:bg-academic-slate-800 rounded-2xl max-w-md w-full p-6 border-2 border-amber-300 dark:border-amber-700 shadow-structural-elevated space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
              <AlertCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3
              id="rate-limit-title"
              className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50"
            >
              {t("research.rateLimitTitle", "Active Research Limit Reached")}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-touch min-w-touch p-2 text-academic-slate-500 hover:text-academic-slate-700 dark:text-academic-slate-400 dark:hover:text-academic-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-academic-primary flex items-center justify-center"
            aria-label={t("research.close", "Close")}
            data-testid="close-rate-limit-modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300 leading-relaxed">
          {t(
            "research.rateLimitMessage",
            "You have reached the maximum allowed concurrent research pipelines (3 parallel tasks). Please wait for an active task to finish before launching a new one."
          )}
        </p>

        {countdown > 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-body-sm font-semibold text-amber-800 dark:text-amber-300 text-center border border-amber-200 dark:border-amber-800">
            {t("research.retryIn", { seconds: countdown, defaultValue: `Retry available in ${countdown} seconds` })}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-touch min-w-touch px-5 py-2.5 bg-academic-primary text-white text-label-md font-semibold rounded-xl hover:bg-academic-primary-hover focus-visible:ring-2 focus-visible:ring-academic-primary transition"
          >
            {t("research.close", "Understood")}
          </button>
        </div>
      </div>
    </div>
  );
};
