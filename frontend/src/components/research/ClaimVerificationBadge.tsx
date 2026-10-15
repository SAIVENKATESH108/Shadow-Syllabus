import React from "react";
import { CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

interface ClaimVerificationBadgeProps {
  verifiedCount: number;
  totalCount: number;
  confidenceScore: number;
  isAbstain?: boolean;
  className?: string;
}

export const ClaimVerificationBadge: React.FC<ClaimVerificationBadgeProps> = ({
  verifiedCount,
  totalCount,
  confidenceScore,
  isAbstain = false,
  className = "",
}) => {
  if (isAbstain) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm font-medium bg-academic-slate-100 dark:bg-academic-slate-800 text-academic-slate-700 dark:text-academic-slate-300 border border-academic-slate-300 dark:border-academic-slate-700 ${className}`}
        data-testid="claim-verification-badge-abstained"
      >
        <HelpCircle className="w-4 h-4 text-academic-slate-500" aria-hidden="true" />
        <span>Abstained (0 verified claims)</span>
      </div>
    );
  }

  // Format ratio strictly per master plan requirement:
  // "Confidence is displayed as 'Verified X of Y extracted claims (Z%)', not as overall factual certainty."
  const percentage = totalCount > 0 ? ((verifiedCount / totalCount) * 100).toFixed(1) : confidenceScore.toFixed(1);
  const ratioText = `Verified ${verifiedCount} of ${totalCount} extracted claims (${percentage}%)`;

  const isHighVerification = totalCount > 0 && verifiedCount / totalCount >= 0.7;

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg text-body-sm font-medium border shadow-structural ${
        isHighVerification
          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800"
          : "bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800"
      } ${className}`}
      data-testid="claim-verification-badge"
      title="Confidence represents verifiable claims audited against cited sources, not overall factual truth."
    >
      {isHighVerification ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" aria-hidden="true" />
      ) : (
        <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" aria-hidden="true" />
      )}
      <span className="font-semibold">{ratioText}</span>
    </div>
  );
};
