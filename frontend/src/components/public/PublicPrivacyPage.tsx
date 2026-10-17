import {
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export const PublicPrivacyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-10">
      {/* Header */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 sm:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4">
        <div className="flex items-center gap-2 text-label-sm font-semibold text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Public Privacy Charter &amp; Sovereign Data Governance</span>
        </div>
        <h1 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50">
          Privacy Policy &amp; Data Subject Rights
        </h1>
        <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300">
          Designed to support GDPR and India’s DPDP Act requirements; formal legal review is pending. We believe learning data belongs solely to the student—without surveillance capitalism, ad targeting, or covert AI training.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
            No Covert Model Training
          </h2>
          <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Student notes, search queries, coding attempts, and study planner inputs are never fed into foundation models without express, affirmative human authorization.
          </p>
        </div>

        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
            Sovereign Data Rights
          </h2>
          <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Every student possesses the right to inspect, export in machine-readable JSON format, or permanently erase their entire account and study record.
          </p>
        </div>
      </div>

      {/* Escalation Policy & Retention */}
      <div className="bg-white dark:bg-academic-slate-800 p-6 sm:p-8 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4">
        <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50">
          Retention &amp; Escalation Policy
        </h2>
        <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300">
          Privacy requests are handled according to the platform’s published retention and escalation policy. Inquiries and data rectification requests can be submitted via the designated Grievance Channel.
        </p>
        <div className="p-4 bg-academic-slate-50 dark:bg-academic-slate-900/60 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 text-body-sm text-academic-slate-600 dark:text-academic-slate-400 space-y-1">
          <div>
            <strong>Contact Grievance Officer:</strong> dpo@siksha-openlearn.org
          </div>
          <div>
            <strong>Legal Review Notice:</strong> Formal legal review is pending prior to production release.
          </div>
        </div>
      </div>

      {/* Licensing notice */}
      <div className="p-4 bg-white dark:bg-academic-slate-800 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
        <strong>Attribution &amp; Fair Use:</strong> Short excerpts are used with attribution. Licensing and permissible-use terms require legal review before public release.
      </div>
    </div>
  );
};
