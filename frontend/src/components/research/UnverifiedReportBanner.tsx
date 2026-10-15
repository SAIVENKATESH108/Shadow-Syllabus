import React from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UnverifiedReportBannerProps {
  className?: string;
}

export const UnverifiedReportBanner: React.FC<UnverifiedReportBannerProps> = ({ className = "" }) => {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-amber-900 shadow-structural flex items-start gap-3.5 ${className}`}
      data-testid="unverified-report-banner"
    >
      <div className="p-1 bg-amber-100 rounded-lg text-amber-700 flex-shrink-0 mt-0.5">
        <AlertTriangle className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-label-lg font-bold text-amber-950 flex items-center gap-2">
          {t("research.unverifiedBannerTitle", "Verify before you trust")}
          <span className="text-label-sm font-semibold px-2 py-0.5 bg-amber-200/70 text-amber-900 rounded-full border border-amber-300">
            {t("research.unverifiedBadge", "AI-Generated & Unverified")}
          </span>
        </h3>
        <p className="text-body-sm text-amber-900/90 leading-relaxed">
          {t(
            "research.unverifiedBannerText",
            "Research reports are synthesized by AI and unverified by default. Independent verification against primary sources is required."
          )}
        </p>
      </div>
    </div>
  );
};
