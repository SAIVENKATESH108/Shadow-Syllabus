import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getResearchReports,
  getResearchReport,
  createResearchInquiry,
  rerunResearchReport,
  ApiError,
} from "../../api/research";
import { calculateResearchRefetchInterval } from "../../api/polling";
import { ResearchInquiryForm } from "./ResearchInquiryForm";
import { ResearchReportList } from "./ResearchReportList";
import { ResearchReportDetail } from "./ResearchReportDetail";
import { ResearchRateLimitModal } from "./ResearchRateLimitModal";
import { useUIStore } from "../../store/uiStore";
import { Loader2, AlertCircle } from "lucide-react";

export const ResearchView: React.FC = () => {
  const queryClient = useQueryClient();
  const { activeReportId, setActiveReportId, includeSuperseded, setIncludeSuperseded } = useUIStore();

  const [rateLimitOpen, setRateLimitOpen] = useState(false);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(15);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Fetch user reports list
  const {
    data: reports = [],
    isLoading: isLoadingReports,
    error: reportsError,
  } = useQuery({
    queryKey: ["researchReports"],
    queryFn: getResearchReports,
    staleTime: 10000,
  });

  // 2. Fetch active report detail with polling while processing
  const effectiveActiveId = activeReportId || (reports.length > 0 ? reports[0].id : null);

  const {
    data: activeReport,
    isLoading: isLoadingActiveReport,
    error: activeReportError,
  } = useQuery({
    queryKey: ["researchReport", effectiveActiveId, includeSuperseded],
    queryFn: () => (effectiveActiveId ? getResearchReport(effectiveActiveId, includeSuperseded) : null),
    enabled: !!effectiveActiveId,
    refetchInterval: calculateResearchRefetchInterval,
  });

  // 3. Create research inquiry mutation
  const createMutation = useMutation({
    mutationFn: (query: string) => createResearchInquiry({ query }),
    onSuccess: (newReport) => {
      setErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: ["researchReports"] });
      setActiveReportId(newReport.id);
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.status === 429) {
        setRetryAfterSeconds(err.retryAfterSeconds || 15);
        setRateLimitOpen(true);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to initiate research inquiry.");
      }
    },
  });

  // 4. Rerun research pipeline mutation
  const rerunMutation = useMutation({
    mutationFn: (id: string) => rerunResearchReport(id),
    onSuccess: (updatedReport) => {
      setErrorMessage(null);
      queryClient.setQueryData(["researchReport", updatedReport.id, includeSuperseded], updatedReport);
      queryClient.invalidateQueries({ queryKey: ["researchReports"] });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.status === 429) {
        setRetryAfterSeconds(err.retryAfterSeconds || 15);
        setRateLimitOpen(true);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to rerun research pipeline.");
      }
    },
  });

  const handleCreateInquiry = async (queryText: string) => {
    await createMutation.mutateAsync(queryText);
  };

  const handleRerun = async (id: string) => {
    await rerunMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-8" data-testid="research-view">
      {errorMessage && (
        <div
          role="alert"
          className="p-4 bg-academic-danger-light dark:bg-red-950/40 border border-academic-danger/30 text-academic-danger dark:text-red-400 rounded-xl flex items-center justify-between gap-3 text-body-md"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-label-sm font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Inquiry Submission Form */}
      <ResearchInquiryForm onSubmit={handleCreateInquiry} isLoading={createMutation.isPending} />

      {/* Grid Layout: History List on Left, Active Report Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          {isLoadingReports ? (
            <div className="p-8 text-center text-body-md text-academic-slate-500 flex items-center justify-center gap-2 bg-white dark:bg-academic-slate-800 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700">
              <Loader2 className="w-5 h-5 animate-spin text-academic-primary" aria-hidden="true" />
              <span>Loading inquiries...</span>
            </div>
          ) : reportsError ? (
            <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl text-body-sm text-red-800 dark:text-red-300">
              Unable to load previous inquiries. Check authentication or network connection.
            </div>
          ) : (
            <ResearchReportList
              reports={reports}
              selectedReportId={effectiveActiveId}
              onSelectReport={(id) => setActiveReportId(id)}
            />
          )}
        </div>

        <div className="lg:col-span-2">
          {isLoadingActiveReport ? (
            <div className="p-12 text-center text-body-md text-academic-slate-500 flex flex-col items-center justify-center gap-3 bg-white dark:bg-academic-slate-800 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural">
              <Loader2 className="w-8 h-8 animate-spin text-academic-primary" aria-hidden="true" />
              <span>Retrieving research report details...</span>
            </div>
          ) : activeReportError ? (
            <div className="p-8 text-center text-body-md text-red-700 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-800">
              Failed to load report: {activeReportError instanceof Error ? activeReportError.message : "Unknown error"}
            </div>
          ) : activeReport ? (
            <ResearchReportDetail
              report={activeReport}
              onRerun={handleRerun}
              isRerunning={rerunMutation.isPending}
              includeSuperseded={includeSuperseded}
              onToggleSuperseded={setIncludeSuperseded}
            />
          ) : (
            <div className="p-12 text-center text-body-md text-academic-slate-500 bg-white dark:bg-academic-slate-800 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700">
              Submit an inquiry above or select a past report to view its synthesized sections, citations, and verified claims.
            </div>
          )}
        </div>
      </div>

      {/* 429 Concurrency Rate Limit Modal */}
      <ResearchRateLimitModal
        isOpen={rateLimitOpen}
        onClose={() => setRateLimitOpen(false)}
        retryAfterSeconds={retryAfterSeconds}
      />
    </div>
  );
};
