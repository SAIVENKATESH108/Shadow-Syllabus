import React, { useState } from "react";
import { Search, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ResearchInquiryFormProps {
  onSubmit: (query: string) => Promise<void>;
  isLoading: boolean;
  className?: string;
}

export const ResearchInquiryForm: React.FC<ResearchInquiryFormProps> = ({
  onSubmit,
  isLoading,
  className = "",
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (trimmed.length < 5) {
      setValidationError("Inquiry topic must be at least 5 characters long.");
      return;
    }
    if (trimmed.length > 500) {
      setValidationError("Inquiry topic cannot exceed 500 characters.");
      return;
    }

    setValidationError(null);
    try {
      await onSubmit(trimmed);
      setQuery("");
    } catch {
      // Error handled by parent / modal
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white dark:bg-academic-slate-800 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 p-6 shadow-structural space-y-4 ${className}`}
      data-testid="research-inquiry-form"
    >
      <div className="flex items-center gap-2.5 mb-1">
        <div className="p-2 bg-academic-primary-light dark:bg-academic-primary/20 text-academic-primary dark:text-academic-primary-dark rounded-xl">
          <Sparkles className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
            {t("research.newInquiry", "New Research Inquiry")}
          </h2>
          <p className="text-body-sm text-academic-slate-500 dark:text-academic-slate-400">
            {t(
              "research.subtitle",
              "Synthesize authoritative academic sources, cross-check claims, and audit evidence."
            )}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="research-query-input"
          className="block text-label-md text-academic-slate-800 dark:text-academic-slate-200 font-semibold"
        >
          Academic Question or Topic
        </label>
        <textarea
          id="research-query-input"
          rows={3}
          value={query}
          disabled={isLoading}
          onChange={(e) => {
            setQuery(e.target.value);
            if (validationError) setValidationError(null);
          }}
          placeholder={t(
            "research.inquiryPlaceholder",
            "Enter an academic topic or question (e.g., Photosynthesis light-dependent reactions in C4 plants)..."
          )}
          className="w-full rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-white dark:bg-academic-slate-900 px-4 py-3 text-body-md text-academic-slate-900 dark:text-academic-slate-50 placeholder:text-academic-slate-400 focus-visible:ring-2 focus-visible:ring-academic-primary transition"
          aria-describedby="guidance-note query-error"
          aria-invalid={!!validationError}
        />
        {validationError && (
          <p id="query-error" role="alert" className="text-label-sm font-semibold text-academic-danger">
            {validationError}
          </p>
        )}
      </div>

      <div
        id="guidance-note"
        className="bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700/80 rounded-xl p-3 text-body-sm text-academic-slate-600 dark:text-academic-slate-400 flex items-start gap-2.5"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <p className="leading-relaxed">
          {t(
            "research.guidanceNote",
            "Student research inquiries are independently evaluated by autonomous agents using verified academic sources, peer-reviewed DOIs, and strict robots.txt boundaries."
          )}
        </p>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          aria-busy={isLoading}
          className="min-h-touch min-w-touch px-6 py-2.5 bg-academic-primary hover:bg-academic-primary-hover disabled:opacity-50 text-white text-label-md font-semibold rounded-xl focus-visible:ring-2 focus-visible:ring-academic-primary transition inline-flex items-center gap-2 shadow-structural"
          data-testid="submit-research-button"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>{t("research.submitting", "Starting Research Agents...")}</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>{t("research.submitInquiry", "Initiate Research")}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
