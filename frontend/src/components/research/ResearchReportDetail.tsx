import { ResearchReport, isActiveResearchStatus, isReportAbstained } from "../../api/types";
import { UnverifiedReportBanner } from "./UnverifiedReportBanner";
import { ClaimVerificationBadge } from "./ClaimVerificationBadge";
import { AbstainedNotice } from "./AbstainedNotice";
import { ArtifactHistoryDrawer } from "./ArtifactHistoryDrawer";
import {
  RotateCcw,
  BookOpen,
  Link as LinkIcon,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Calendar,
  Layers,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ResearchReportDetailProps {
  report: ResearchReport;
  onRerun: (id: string) => Promise<void>;
  isRerunning: boolean;
  includeSuperseded: boolean;
  onToggleSuperseded: (include: boolean) => void;
  className?: string;
}

export const ResearchReportDetail: React.FC<ResearchReportDetailProps> = ({
  report,
  onRerun,
  isRerunning,
  includeSuperseded,
  onToggleSuperseded,
  className = "",
}) => {
  const { t, i18n } = useTranslation();

  const supersededSections = report.sections.filter((s) => s.is_superseded);
  const supersededSources = report.sources.filter((s) => s.is_superseded);
  const supersededClaims = report.claims.filter((c) => c.is_superseded);
  const totalSuperseded = supersededSections.length + supersededSources.length + supersededClaims.length;

  const visibleSections = includeSuperseded ? report.sections : report.sections.filter((s) => !s.is_superseded);
  const visibleSources = includeSuperseded ? report.sources : report.sources.filter((s) => !s.is_superseded);
  const visibleClaims = includeSuperseded ? report.claims : report.claims.filter((c) => !c.is_superseded);

  const isProcessing = isActiveResearchStatus(report.status);

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat(i18n.language || "en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  return (
    <article
      className={`bg-white dark:bg-academic-slate-800 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 p-6 md:p-8 shadow-structural space-y-6 ${className}`}
      data-testid="research-report-detail"
      aria-labelledby="report-main-heading"
    >
      {/* Header with Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-academic-slate-200 dark:border-academic-slate-700">
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <ClaimVerificationBadge
              verifiedCount={report.verified_claims_count}
              totalCount={report.total_claims_count}
              confidenceScore={report.confidence_score ?? 0}
              isAbstain={report.is_abstain}
            />
            {report.pipeline_run_id && (
              <span className="text-label-sm font-mono text-academic-slate-500 dark:text-academic-slate-400 bg-academic-slate-100 dark:bg-academic-slate-900 px-2.5 py-1 rounded-md border border-academic-slate-200 dark:border-academic-slate-700">
                Run: {report.pipeline_run_id.slice(0, 8)}
              </span>
            )}
          </div>
          <h2
            id="report-main-heading"
            className="text-display-lg md:text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 leading-tight"
          >
            {report.title || report.query}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-body-sm text-academic-slate-500 dark:text-academic-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              {formatDate(report.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4" aria-hidden="true" />
              {report.sections.length} sections &bull; {report.sources.length} sources &bull; {report.claims.length} claims
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRerun(report.id)}
          disabled={isRerunning || isProcessing}
          aria-busy={isRerunning}
          className="min-h-touch min-w-touch px-4 py-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-white dark:bg-academic-slate-900 text-academic-slate-800 dark:text-academic-slate-200 hover:bg-academic-slate-50 dark:hover:bg-academic-slate-800 disabled:opacity-50 text-label-md font-semibold transition focus-visible:ring-2 focus-visible:ring-academic-primary inline-flex items-center justify-center gap-2 shadow-structural"
          data-testid="rerun-report-button"
        >
          <RotateCcw className={`w-4 h-4 ${isRerunning ? "animate-spin" : ""}`} aria-hidden="true" />
          <span>{isRerunning ? t("research.rerunning", "Rerunning...") : t("research.rerun", "Rerun Pipeline")}</span>
        </button>
      </div>

      {/* Prominent Mandatory AI Unverified Banner */}
      <UnverifiedReportBanner />

      {/* Async Polling Progress Banner */}
      {isProcessing && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-3 text-body-md text-blue-900 dark:text-blue-200 font-medium"
        >
          <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
          <span>Multi-agent research pipeline is actively searching, verifying citations, and fact-checking claims...</span>
        </div>
      )}

      {/* Artifact Supersession Controller */}
      <ArtifactHistoryDrawer
        includeSuperseded={includeSuperseded}
        onToggleSuperseded={onToggleSuperseded}
        supersededCount={totalSuperseded}
      />

      {/* Case 1: Abstained Report */}
      {isReportAbstained(report) ? (
        <AbstainedNotice
          retrievalErrorCode={report.retrieval_error_code}
          retrievalErrorDetail={report.retrieval_error_detail}
        />
      ) : (
        <>
          {/* Executive Summary */}
          {report.summary && (
            <section
              aria-label="Executive Summary"
              className="bg-academic-slate-50 dark:bg-academic-slate-900/60 p-5 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700/80 space-y-2"
            >
              <h3 className="text-label-lg font-bold text-academic-slate-900 dark:text-academic-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-academic-primary" aria-hidden="true" />
                Executive Summary
              </h3>
              <p className="text-body-md text-academic-slate-700 dark:text-academic-slate-300 leading-relaxed">
                {report.summary}
              </p>
            </section>
          )}

          {/* Synthesized Sections */}
          <section aria-labelledby="sections-heading" className="space-y-4">
            <h3
              id="sections-heading"
              className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-50"
            >
              {t("research.sections", "Synthesized Sections")}
            </h3>
            <div className="space-y-4">
              {visibleSections.map((section) => (
                <div
                  key={section.id}
                  className={`p-5 rounded-xl border transition ${
                    section.is_superseded
                      ? "bg-academic-slate-50/60 dark:bg-academic-slate-900/40 border-dashed border-academic-slate-300 dark:border-academic-slate-700 opacity-80"
                      : "bg-white dark:bg-academic-slate-800/80 border-academic-slate-200 dark:border-academic-slate-700 shadow-structural"
                  }`}
                  data-testid={`section-${section.id}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-headline-sm font-semibold text-academic-slate-900 dark:text-academic-slate-100">
                      {section.order_index + 1}. {section.title}
                    </h4>
                    {section.is_superseded && (
                      <span className="text-label-sm px-2 py-0.5 rounded-full bg-academic-slate-200 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300 font-semibold">
                        {t("research.supersededBadge", "Superseded Draft")}
                      </span>
                    )}
                  </div>
                  <div className="text-body-md text-academic-slate-700 dark:text-academic-slate-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Referenced Sources & Citations */}
          <section aria-labelledby="sources-heading" className="space-y-4 pt-4 border-t border-academic-slate-200 dark:border-academic-slate-700">
            <h3
              id="sources-heading"
              className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-50 flex items-center gap-2"
            >
              <LinkIcon className="w-5 h-5 text-academic-secondary" aria-hidden="true" />
              {t("research.sources", "Referenced Sources & Citations")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visibleSources.map((source) => (
                <div
                  key={source.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-2 ${
                    source.is_superseded
                      ? "bg-academic-slate-50 dark:bg-academic-slate-900/40 border-dashed border-academic-slate-300 dark:border-academic-slate-700 opacity-80"
                      : "bg-white dark:bg-academic-slate-900 border-academic-slate-200 dark:border-academic-slate-700 shadow-structural"
                  }`}
                  data-testid={`source-${source.id}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-label-sm font-semibold text-academic-slate-500 dark:text-academic-slate-400 truncate">
                        {source.container || "Academic Repository"}
                      </span>
                      {source.is_peer_reviewed_doi && (
                        <span className="text-label-sm px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-700 flex items-center gap-1 font-semibold">
                          <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                          {t("research.peerReviewed", "Peer-Reviewed DOI")}
                        </span>
                      )}
                    </div>
                    <h5 className="text-body-md font-semibold text-academic-slate-900 dark:text-academic-slate-100">
                      {source.title}
                    </h5>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-body-sm">
                    {source.doi ? (
                      <span className="font-mono text-label-sm text-academic-slate-500 dark:text-academic-slate-400">
                        DOI: {source.doi}
                      </span>
                    ) : (
                      <span className="text-label-sm text-academic-slate-400">Web Reference</span>
                    )}

                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-touch px-3 py-1 text-label-md text-academic-primary hover:underline focus-visible:ring-2 focus-visible:ring-academic-primary inline-flex items-center gap-1 font-semibold"
                        aria-label={`Open external source: ${source.title}`}
                      >
                        Visit Source &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Fact-Checked Claims & Confidence Audits */}
          <section aria-labelledby="claims-heading" className="space-y-4 pt-4 border-t border-academic-slate-200 dark:border-academic-slate-700">
            <h3
              id="claims-heading"
              className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-50"
            >
              {t("research.claims", "Fact-Checked Claims & Verification Audits")}
            </h3>
            <div className="space-y-3">
              {visibleClaims.map((claim) => (
                <div
                  key={claim.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    claim.is_superseded
                      ? "bg-academic-slate-50 dark:bg-academic-slate-900/40 border-dashed border-academic-slate-300 dark:border-academic-slate-700 opacity-80"
                      : "bg-white dark:bg-academic-slate-900 border-academic-slate-200 dark:border-academic-slate-700 shadow-structural"
                  }`}
                  data-testid={`claim-${claim.id}`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-label-sm font-semibold text-academic-slate-500 dark:text-academic-slate-400 uppercase tracking-wider">
                        {claim.subtopic || "General"}
                      </span>
                      {claim.is_superseded && (
                        <span className="text-label-sm px-2 py-0.5 rounded-full bg-academic-slate-200 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300">
                          {t("research.supersededBadge", "Superseded")}
                        </span>
                      )}
                    </div>
                    <p className="text-body-md font-medium text-academic-slate-900 dark:text-academic-slate-100">
                      "{claim.claim_text}"
                    </p>
                    {claim.notes && (
                      <p className="text-body-sm text-academic-slate-500 dark:text-academic-slate-400 italic">
                        Auditor Note: {claim.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {claim.status === "VERIFIED" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-md font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        {t("research.verified", "Verified")}
                      </span>
                    ) : claim.status === "REFUTED" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-md font-semibold bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" aria-hidden="true" />
                        {t("research.refuted", "Refuted")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-md font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                        {t("research.unverified", "Unverified")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </article>
  );
};
