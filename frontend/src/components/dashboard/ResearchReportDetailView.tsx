import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getResearchReport, rerunResearchReport, ApiError } from "../../api/research";
import { calculateResearchRefetchInterval } from "../../api/polling";
import { ResearchReportDetail } from "../research/ResearchReportDetail";
import { PageSkeleton } from "../layout/PageSkeleton";
import { ErrorState } from "../layout/ErrorState";
import { useUIStore } from "../../store/uiStore";

export const ResearchReportDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { includeSuperseded, setIncludeSuperseded } = useUIStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: report,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["researchReport", id, includeSuperseded],
    queryFn: () => (id ? getResearchReport(id, includeSuperseded) : null),
    enabled: !!id,
    refetchInterval: calculateResearchRefetchInterval,
  });

  const rerunMutation = useMutation({
    mutationFn: (reportId: string) => rerunResearchReport(reportId),
    onSuccess: () => {
      setErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: ["researchReport", id] });
      queryClient.invalidateQueries({ queryKey: ["researchReports"] });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to rerun research pipeline.");
      }
    },
  });

  const handleRerun = async (reportId: string) => {
    await rerunMutation.mutateAsync(reportId);
  };

  if (isLoading) return <PageSkeleton />;

  if (error || !report) {
    return (
      <div className="space-y-4">
        <Link
          to="/dashboard/research"
          className="inline-flex items-center gap-2 text-label-md font-semibold text-academic-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Research Reports</span>
        </Link>
        <ErrorState
          title="Research Report Not Found"
          message={error instanceof Error ? error.message : "The requested research report could not be found or you do not have permission to view it."}
          onRetry={() => queryClient.invalidateQueries({ queryKey: ["researchReport", id] })}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/research"
          className="inline-flex items-center gap-2 text-label-md font-semibold text-academic-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Research Reports</span>
        </Link>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-body-sm flex items-center gap-2.5"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <ResearchReportDetail
        report={report}
        onRerun={handleRerun}
        isRerunning={rerunMutation.isPending}
        includeSuperseded={includeSuperseded}
        onToggleSuperseded={setIncludeSuperseded}
      />
    </div>
  );
};
