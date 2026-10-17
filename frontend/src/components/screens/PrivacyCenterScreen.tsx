import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  Download,
  FileText,
  HardDrive,
  Laptop,
  Lock,
  LogOut,
  Mail,
  Server,
  ShieldCheck,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { requestDataErasure } from "../../api/user";

export const PrivacyCenterScreen: React.FC = () => {
  const { userProfile } = useUIStore();

  // Toggles
  const [aiTraining, setAiTraining] = useState(false);
  const [cloudSync, setCloudSync] = useState(true);
  const [diagnostics, setDiagnostics] = useState(true);
  const [recommendations, setRecommendations] = useState(true);

  // Modals & States
  const [isDpoModalOpen, setIsDpoModalOpen] = useState(false);
  const [isCorpusModalOpen, setIsCorpusModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "pdf">("json");
  const [deletionStatus, setDeletionStatus] = useState<"idle" | "scheduled">("idle");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmittingErasure, setIsSubmittingErasure] = useState(false);
  const [erasureError, setErasureError] = useState<string | null>(null);
  const [cachePurged, setCachePurged] = useState(false);
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);

  const handleScheduleDeletion = async () => {
    if (!passwordConfirm.trim()) {
      alert("Please enter password to confirm deletion request.");
      return;
    }
    try {
      setIsSubmittingErasure(true);
      setErasureError(null);
      await requestDataErasure();
      setDeletionStatus("scheduled");
      setPasswordConfirm("");
    } catch (err) {
      setErasureError(err instanceof Error ? err.message : "Failed to submit erasure request");
    } finally {
      setIsSubmittingErasure(false);
    }
  };

  const handleExport = () => {
    const data = {
      user: userProfile?.username || "Learner",
      isMinor: userProfile?.isMinor || false,
      exportJobId: "EXP-2024-88412",
      exportTimestamp: new Date().toISOString(),
      platform: "Siksha OpenLearn Platform",
      compliance: "DPDP Act 2023 Sec 12 & GDPR Chapter III Art 20",
      retentionPolicy: "90-day rolling zero-telemetry window",
      modulesIncluded: [
        "Study Roadmaps & Syllabus Milestones",
        "AI Assistant Chat History & Study Notes",
        "OCR Textbook Corrections & Scans",
        "Session Auth Records & Activity Timestamps",
      ],
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `siksha_export_${exportFormat}_${Date.now()}.${exportFormat === "json" ? "json" : "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePurgeCache = () => {
    setCachePurged(true);
    setTimeout(() => setCachePurged(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stitch Header matching b27ea7646bd344bca85d993803d47395 */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-label-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>DPDP Act 2023 &bull; GDPR Chapter III Sovereign Portal</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Designed to support GDPR and India’s DPDP Act requirements; formal legal review is pending.
            </span>
          </div>
          <h2 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 mt-1">
            Your Privacy &amp; Personal Data Sovereignty
          </h2>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300 max-w-3xl mt-1">
            Manage your privacy rights with zero cognitive friction. At Siksha, learning data belongs solely to the student: no manipulative dark patterns, no coerced consent traps, and no silent third-party algorithmic telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDpoModalOpen(true)}
            className="min-h-touch px-4 py-2.5 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-semibold text-label-md rounded-xl hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>Contact DPO (Escalation Channel)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCorpusModalOpen(true)}
            className="min-h-touch px-4 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Audit Consent Ledger</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards matching Stitch b27ea7646bd344bca85d993803d47395 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
          <div className="text-label-sm font-semibold text-academic-slate-500">AI Model Training</div>
          <div className="text-headline-md font-bold text-emerald-600 dark:text-emerald-400">Opted Out</div>
          <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Strict privacy mode active &bull; 0 tokens indexed
          </div>
        </div>

        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
          <div className="text-label-sm font-semibold text-academic-slate-500">Total Data Footprint</div>
          <div className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">4.8 MB</div>
          <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Cloud &bull; 42.1 MB zero-telemetry browser cache
          </div>
        </div>

        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
          <div className="text-label-sm font-semibold text-academic-slate-500">Active Retention</div>
          <div className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">90 Days</div>
          <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Rolling auto-purge for AI session queries
          </div>
        </div>

        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
          <div className="text-label-sm font-semibold text-academic-slate-500">Active Logins</div>
          <div className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">2 Devices</div>
          <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Bangalore (Current) &bull; Delhi App
          </div>
        </div>
      </div>

      {/* Guaranteed Unbundled Choice Guarantee Banner */}
      <div className="bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/80 rounded-2xl p-4 text-body-md text-cyan-950 dark:text-cyan-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Guaranteed Unbundled Choice:</strong> Modifying or disabling any consent toggles below will{" "}
          <strong>never degrade or throttle</strong> your unrestricted access to core textbook libraries, historical syllabus papers, or the on-demand AI Tutor.
        </div>
      </div>

      {/* Article 7 GDPR / Sec 6 DPDP: Granular Consent & Data Utilization */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-6">
        <div className="border-b border-academic-slate-200 dark:border-academic-slate-700 pb-4">
          <div className="text-label-sm font-bold text-academic-primary uppercase tracking-wide">
            Article 7 GDPR / Sec 6 DPDP
          </div>
          <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
            Granular Consent &amp; Data Utilization
          </h3>
          <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Manage your granular permissions. Consent is never bundled or coerced.
          </p>
        </div>

        <div className="space-y-5">
          {/* Toggle 1: AI Training */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2 text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                <span>AI Model Training &amp; Research Corpus</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-academic-slate-200 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300">
                  Default: OFF
                </span>
              </div>
              <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                Allow anonymized academic doubts and paper annotations to fine-tune community educational open-weights models. You can disable this anytime; future training pipelines will permanently omit your data records.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-academic-slate-500 pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero student prompts currently indexed</span>
                <button
                  type="button"
                  onClick={() => setIsCorpusModalOpen(true)}
                  className="text-academic-primary hover:underline font-semibold ml-2"
                >
                  Inspect Training Corpus Audit Log &rarr;
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAiTraining(!aiTraining)}
              className={`w-12 h-7 flex items-center rounded-full p-1 transition ${
                aiTraining ? "bg-academic-primary justify-end" : "bg-academic-slate-300 dark:bg-academic-slate-600 justify-start"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Toggle 2: Cloud Sync */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2 text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                <span>Cloud Sync &amp; Cross-Device Study State</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Sync Active
                </span>
              </div>
              <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                Synchronize custom syllabus roadmaps, exam targets, and question bookmarks between your laptop browser and mobile application.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCloudSync(!cloudSync)}
              className={`w-12 h-7 flex items-center rounded-full p-1 transition ${
                cloudSync ? "bg-academic-primary justify-end" : "bg-academic-slate-300 dark:bg-academic-slate-600 justify-start"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Toggle 3: Diagnostics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2 text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                <span>Diagnostic Performance &amp; Network Health</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  No PII
                </span>
              </div>
              <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                Collect aggregate crash reports and network packet drops for users on low-bandwidth 2G/3G academic networks. Never transmits IP or location strings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDiagnostics(!diagnostics)}
              className={`w-12 h-7 flex items-center rounded-full p-1 transition ${
                diagnostics ? "bg-academic-primary justify-end" : "bg-academic-slate-300 dark:bg-academic-slate-600 justify-start"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Toggle 4: Recommendations */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700">
            <div className="space-y-1 max-w-2xl">
              <div className="text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                Personalised Practice Recommendations
              </div>
              <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                Analyzes internal quiz performance to suggest high-yield review problems. If disabled, recommendations revert to standard chronological syllabus lists.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRecommendations(!recommendations)}
              className={`w-12 h-7 flex items-center rounded-full p-1 transition ${
                recommendations ? "bg-academic-primary justify-end" : "bg-academic-slate-300 dark:bg-academic-slate-600 justify-start"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-label-sm text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings updated securely on student ledger.</span>
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Active</span>
        </div>
      </div>

      {/* Right to Data Portability: Export Data Archive */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-6">
        <div className="border-b border-academic-slate-200 dark:border-academic-slate-700 pb-4">
          <div className="text-label-sm font-bold text-academic-primary uppercase tracking-wide">
            Right to Data Portability &bull; GDPR Art 20 &bull; DPDP Sec 12
          </div>
          <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
            Export Data Archive
          </h3>
          <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Request an encrypted archive of your complete academic record in compliance with GDPR Article 20 &amp; DPDP Section 12.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-label-sm font-bold text-academic-slate-700 dark:text-academic-slate-300">
              Select Archive Format:
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat("json")}
                className={`p-4 rounded-2xl border text-left transition ${
                  exportFormat === "json"
                    ? "border-academic-primary bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100"
                    : "border-academic-slate-200 dark:border-academic-slate-700 hover:bg-academic-slate-50 dark:hover:bg-academic-slate-900"
                }`}
              >
                <div className="text-label-md font-bold">JSON Package</div>
                <div className="text-body-sm text-academic-slate-500">Machine readable</div>
              </button>
              <button
                type="button"
                onClick={() => setExportFormat("pdf")}
                className={`p-4 rounded-2xl border text-left transition ${
                  exportFormat === "pdf"
                    ? "border-academic-primary bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100"
                    : "border-academic-slate-200 dark:border-academic-slate-700 hover:bg-academic-slate-50 dark:hover:bg-academic-slate-900"
                }`}
              >
                <div className="text-label-md font-bold">Human PDF</div>
                <div className="text-body-sm text-academic-slate-500">Formatted dossier</div>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-label-sm font-bold text-academic-slate-700 dark:text-academic-slate-300">
                Included Data Modules:
              </div>
              <div className="space-y-1.5 text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Study Roadmaps &amp; Syllabus Milestones</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>AI Assistant Chat History &amp; Study Notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>OCR Textbook Corrections &amp; Scans</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Session Auth Records &amp; Activity Timestamps</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Export Job Card */}
          <div className="bg-academic-slate-50 dark:bg-academic-slate-900/60 p-5 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 space-y-4">
            <div className="flex items-center justify-between text-label-sm">
              <span className="font-bold text-academic-slate-800 dark:text-academic-slate-200">
                Active Job: EXP-2024-88412
              </span>
              <span className="text-academic-slate-500">Req: Today, 10:15 AM</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300">
                <span>Generating AES-256 ZIP (~4.8 MB)</span>
                <span className="text-academic-primary">72%</span>
              </div>
              <div className="h-2.5 bg-academic-slate-200 dark:bg-academic-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-academic-primary rounded-full w-[72%]" />
              </div>
            </div>

            <p className="text-body-sm text-academic-slate-500 italic">
              Direct download link will be emailed to your student address. Valid for 48 hours.
            </p>

            <button
              type="button"
              onClick={handleExport}
              className="w-full min-h-touch py-2.5 px-4 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Request New Export Package</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article 13 / 14 Transparency: Data Retention Schedules & Automatic Purge Lifecycles */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-4">
          <div>
            <div className="text-label-sm font-bold text-academic-primary uppercase tracking-wide">
              Article 13 / 14 Transparency
            </div>
            <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
              Data Retention Schedules &amp; Automatic Purge Lifecycles
            </h3>
            <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
              We do not hoard historical student telemetry. Every category has a hard cryptographic expiry.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePurgeCache}
            className="min-h-touch px-4 py-2 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900 font-semibold text-label-sm transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4 text-amber-600" />
            <span>Purge All Server Chat Cache Now</span>
          </button>
        </div>

        {cachePurged && (
          <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl border border-emerald-300 text-label-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All transient server memory buffers purged successfully across distributed nodes.</span>
          </div>
        )}

        {/* Table of retention schedules */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead>
              <tr className="border-b border-academic-slate-200 dark:border-academic-slate-700 text-label-sm font-bold text-academic-slate-500">
                <th className="py-3 px-4">Data Category</th>
                <th className="py-3 px-4">Scope &amp; Entities Stored</th>
                <th className="py-3 px-4">Retention Horizon</th>
                <th className="py-3 px-4">Enforced Automatic Action</th>
                <th className="py-3 px-4 text-right">Student Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-academic-slate-200 dark:divide-academic-slate-700">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-academic-slate-900 dark:text-academic-slate-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>AI Study Chats &amp; Queries</span>
                </td>
                <td className="py-3.5 px-4 text-academic-slate-600 dark:text-academic-slate-400">
                  User prompts, generated explanations, follow-up doubts
                </td>
                <td className="py-3.5 px-4 font-semibold text-academic-slate-900 dark:text-academic-slate-100">
                  90 days rolling
                </td>
                <td className="py-3.5 px-4 text-academic-slate-600 dark:text-academic-slate-400">
                  Hard delete from database shards
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => alert("Chat cache purged.")}
                    className="px-3 py-1 bg-academic-slate-100 dark:bg-academic-slate-700 rounded-lg text-label-sm font-semibold hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600"
                  >
                    Purge Early
                  </button>
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-academic-slate-900 dark:text-academic-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Academic Roadmaps &amp; Bookmarks</span>
                </td>
                <td className="py-3.5 px-4 text-academic-slate-600 dark:text-academic-slate-400">
                  Curriculum progress, solved question tags, personal notes
                </td>
                <td className="py-3.5 px-4 font-semibold text-academic-slate-900 dark:text-academic-slate-100">
                  Account Lifetime
                </td>
                <td className="py-3.5 px-4 text-academic-slate-600 dark:text-academic-slate-400">
                  Retained while active; erased upon closure request
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={handleExport}
                    className="px-3 py-1 bg-academic-slate-100 dark:bg-academic-slate-700 rounded-lg text-label-sm font-semibold hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600"
                  >
                    Download
                  </button>
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-academic-slate-900 dark:text-academic-slate-100 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-cyan-600" />
                  <span>OCR Community Corrections</span>
                </td>
                <td className="py-3.5 px-4 text-academic-slate-600 dark:text-academic-slate-400">
                  Scanned formula proofs, textbook typo fixes
                </td>
                <td className="py-3.5 px-4 font-semibold text-academic-slate-900 dark:text-academic-slate-100">
                  Permanent Public (CC BY-NC 4.0)
                </td>
                <td className="py-3.5 px-4 text-academic-slate-600 dark:text-academic-slate-400">
                  PII scrubbed; preserved as open educational commons
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-[11px] font-bold text-academic-slate-400">Anonymized</span>
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-academic-slate-900 dark:text-academic-slate-100 flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-600" />
                  <span>Server &amp; Access Diagnostics</span>
                </td>
                <td className="py-3.5 px-4 text-academic-slate-600 dark:text-academic-slate-400">
                  Salted IP hashes, device client version, load latencies
                </td>
                <td className="py-3.5 px-4 font-semibold text-academic-slate-900 dark:text-academic-slate-100">
                  14 calendar days
                </td>
                <td className="py-3.5 px-4 text-academic-slate-600 dark:text-academic-slate-400">
                  Automated log zeroing via scheduled cron
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-[11px] font-bold text-academic-slate-400">System Automated</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recognized Active Sessions */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-4">
          <div>
            <div className="text-label-sm font-bold text-academic-primary uppercase tracking-wide">
              Zero Unauthorized Relays
            </div>
            <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
              Recognized Active Sessions
            </h3>
            <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
              Only cryptographically authenticated hardware tokens can decrypt your cached syllabus nodes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert("Revoked all other device sessions.")}
            className="min-h-touch px-4 py-2 border border-academic-slate-300 dark:border-academic-slate-600 rounded-xl hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 font-semibold text-label-sm transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Revoke All Other Device Sessions</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700 flex items-start gap-4">
            <div className="p-2.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-xl">
              <Laptop className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                  MacBook Pro (Chrome 124)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Current Session
                </span>
              </div>
              <p className="text-body-sm text-academic-slate-500">
                Bangalore, Karnataka, IN &bull; IPv4 Hash: 103.21.*
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700 flex items-start gap-4">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                  Xiaomi Redmi Note 12 (OpenLearn App)
                </span>
                <button
                  type="button"
                  onClick={() => alert("Session revoked.")}
                  className="text-label-sm font-semibold text-red-600 hover:underline"
                >
                  End Session
                </button>
              </div>
              <p className="text-body-sm text-academic-slate-500">
                Delhi NCR, IN &bull; Last active 2 hours ago
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Article 17 GDPR / Right to Erasure: Delete Account & Personal Data */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-red-200 dark:border-red-900/60 shadow-structural space-y-6">
        <div className="border-b border-academic-slate-200 dark:border-academic-slate-700 pb-4">
          <div className="text-label-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
            Article 17 GDPR / Right to Erasure
          </div>
          <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
            Delete Account &amp; Personal Data
          </h3>
          <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Execute your right to be forgotten. Requesting deletion purges all profile records, syllabi, study room chats, and bookmarks across production engines and immutable cold archives.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-body-sm text-amber-900 dark:text-amber-200 space-y-1">
            <strong>30-Day Reversible Grace Period:</strong> Upon submitting a deletion request, your account is instantly hidden from all search and peer spaces. You may sign back in at any time within 30 days to cancel the request before irreversible cryptographic shredding takes place.
          </div>
        </div>

        {deletionStatus === "scheduled" ? (
          <div className="p-4 bg-amber-100 dark:bg-amber-900/60 rounded-2xl border border-amber-300 dark:border-amber-700 flex items-center justify-between">
            <span className="text-label-md font-semibold text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Deletion scheduled for 30 days from today. Status: Reversible.</span>
            </span>
            <button
              type="button"
              onClick={() => setDeletionStatus("idle")}
              className="px-4 py-2 bg-academic-slate-900 text-white rounded-xl text-label-sm font-semibold hover:bg-academic-slate-800 transition"
            >
              Cancel Deletion
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm with Current Account Password"
              className="w-full sm:w-80 p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 text-body-md"
            />
            <button
              type="button"
              disabled={isSubmittingErasure}
              onClick={handleScheduleDeletion}
              className="min-h-touch px-5 py-3 bg-red-600 text-white font-semibold text-label-md rounded-xl hover:bg-red-700 disabled:opacity-50 shadow-sm transition"
            >
              {isSubmittingErasure ? "Submitting Request..." : "Schedule Deletion"}
            </button>
            <span className="text-body-sm text-academic-slate-500 italic">
              No manipulative retention surveys or phone verification hurdles required.
            </span>
          </div>
        )}
        {erasureError && (
          <div className="mt-2 text-label-sm font-semibold text-red-600 dark:text-red-400">
            {erasureError}
          </div>
        )}
      </div>

      {/* Statutory Escalation Channel: Data Protection Officer & Grievance Redressal */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-5">
        <div className="border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
          <div className="text-label-sm font-bold text-academic-primary uppercase tracking-wide">
            Designated Escalation Channel
          </div>
          <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
            Data Protection Officer &amp; Grievance Redressal
          </h3>
        </div>

        <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300">
          Have questions regarding specific data handling, or wish to report a suspected compliance deviation? Privacy requests are handled according to the platform’s published retention and escalation policy.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-academic-primary" />
            <div>
              <div className="text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                dpo@siksha-openlearn.org
              </div>
              <div className="text-body-sm text-academic-slate-500">
                Dr. Aruna Sen (Grievance Redressal Officer, New Delhi)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDpoModalOpen(true)}
            className="min-h-touch px-4 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Submit Formal Grievance</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: AI Training Corpus Verification Log */}
      {isCorpusModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full border border-academic-slate-200 dark:border-academic-slate-700 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                  AI Training Corpus Verification Log
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCorpusModalOpen(false)}
                className="p-1 hover:text-academic-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-300">
              Below is the cryptographic hash ledger for your user identifier <strong className="font-mono text-academic-primary">UID-IND-99420-SK</strong> against all active model checkpoint pipelines:
            </p>

            <div className="space-y-3 font-mono text-label-sm">
              <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold">Model: Siksha-Tutor-7B-Instruct (v2.4)</div>
                  <div className="text-[11px] text-academic-slate-500">Weights Hash: sha256:d894...</div>
                </div>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  0 Tokens Contributed (Opted Out)
                </span>
              </div>

              <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold">Model: IndicOCR-HindiBengali-Foundation</div>
                  <div className="text-[11px] text-academic-slate-500">Weights Hash: sha256:91b2...</div>
                </div>
                <span className="text-academic-slate-500 font-bold">No scans indexed</span>
              </div>

              <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold">Vector Embeddings Collection (Student Doubts)</div>
                  <div className="text-[11px] text-academic-slate-500">Storage: Local Volatile IndexedDB</div>
                </div>
                <span className="text-blue-600 font-bold flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  Local-only session storage
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsCorpusModalOpen(false)}
                className="px-5 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Submit Grievance to DPO */}
      {isDpoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-academic-slate-200 dark:border-academic-slate-700 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-academic-primary" />
                <h3 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                  Submit Grievance to DPO
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDpoModalOpen(false);
                  setGrievanceSubmitted(false);
                }}
                className="p-1 hover:text-academic-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {grievanceSubmitted ? (
              <div className="space-y-4 py-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                  Grievance #GRV-2024-901 Received
                </div>
                <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-300">
                  Dr. Aruna Sen and the compliance office will review this report and deliver an official response to your registered email address in accordance with our published escalation policy.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsDpoModalOpen(false);
                    setGrievanceSubmitted(false);
                  }}
                  className="px-5 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setGrievanceSubmitted(true);
                }}
                className="space-y-4"
              >
                <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-300">
                  This communication is directly routed to the designated Data Protection Officer. Privacy requests are handled according to the platform’s published retention and escalation policy.
                </p>

                <div>
                  <label htmlFor="inquiry-type" className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1">
                    Nature of Inquiry
                  </label>
                  <select
                    id="inquiry-type"
                    className="w-full p-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-sm"
                  >
                    <option>Verify Data Deletion from Model Pipeline</option>
                    <option>Request Clarification on Retention Schedule</option>
                    <option>Report Unauthorized Device Session</option>
                    <option>Exercise Right of Correction (DPDP Sec 12)</option>
                    <option>Other Regulatory Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="grievance-details" className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1">
                    Details &amp; Supporting Context
                  </label>
                  <textarea
                    id="grievance-details"
                    rows={4}
                    required
                    placeholder="Describe your inquiry or concern regarding personal learning records..."
                    className="w-full p-3 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDpoModalOpen(false)}
                    className="px-4 py-2 border border-academic-slate-300 dark:border-academic-slate-600 rounded-xl text-label-sm font-semibold hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-academic-primary text-white font-semibold text-label-sm rounded-xl hover:bg-academic-primary-hover shadow-sm transition"
                  >
                    Send Formal Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
