import React, { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

export const PastPapersScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(115);
  const [isInverted, setIsInverted] = useState(false);
  const [line4Confirmed, setLine4Confirmed] = useState(false);
  const [line4Text, setLine4Text] = useState(
    "an imbalance at the left child of the right subtree? (Double Left-Right Rotation)"
  );
  const [isEditingLine4, setIsEditingLine4] = useState(false);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Copyright & Statutory Fair Dealing Banner (Screenshot 3) */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-body-sm text-academic-slate-600 dark:text-academic-slate-300 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Licence:</strong> Short excerpts are used with attribution. Licensing and permissible-use terms require legal review before public release.
            </span>
          </div>
          <button
            type="button"
            onClick={() => alert("Statutory Takedown Portal: SLA 24 hours.")}
            className="text-label-sm font-semibold text-rose-600 hover:underline flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Report Copyright Concern / Immediate Takedown</span>
          </button>
        </div>

        {/* Paper Metadata & Status Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-label-sm font-extrabold bg-blue-600 text-white">
                END-TERM 2018
              </span>
              <span className="font-mono text-label-sm text-academic-slate-500 font-bold">
                ID: BTECH-CSE-2018-P1
              </span>
              <span className="text-academic-slate-400">&bull;</span>
              <span className="text-label-sm text-amber-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Faded Ink &amp; Bleed (68% Auto-confidence)
              </span>
            </div>
            <h2 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-100">
              Exam Paper: CS-204 Data Structures &amp; Algorithms
            </h2>
            <div className="text-body-sm text-academic-slate-500">
              Univ. Examination Archive &bull; Uploaded by Anonymous Volunteer &bull; Batch 4 of 6 pages (78% transcribed)
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-white dark:bg-academic-slate-800 disabled:opacity-40"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 text-label-md font-bold bg-academic-slate-100 dark:bg-academic-slate-700 rounded-xl">
              Page {currentPage} / 6
            </span>
            <button
              type="button"
              disabled={currentPage >= 6}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-white dark:bg-academic-slate-800 disabled:opacity-40"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => alert("Page verification submitted to peer consensus queue.")}
              className="px-4 py-2 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm"
            >
              Submit Page Verification
            </button>
          </div>
        </div>

        {/* Progress Strip */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-label-sm text-academic-slate-500">
            <span>Processing line 24 of 32 on page 1 &bull; 78% completed (24/32 lines)</span>
            <span className="text-emerald-600 font-semibold">Zero Telemetry Mode &bull; Bi-directional Cursor Sync</span>
          </div>
          <div className="w-full bg-academic-slate-200 dark:bg-academic-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-academic-primary h-2 rounded-full w-[78%]" />
          </div>
        </div>
      </div>

      {/* Main Dual-Pane OCR Workstation (Screenshot 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane: PHYSICAL SCAN (300 DPI) */}
        <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4">
          <div className="flex items-center justify-between border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3 text-label-sm">
            <span className="font-bold uppercase tracking-wider text-academic-slate-700 dark:text-academic-slate-300">
              Physical Scan (300 DPI) Grayscale / Raw
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel(zoomLevel === 115 ? 140 : 115)}
                className="px-2 py-1 bg-academic-slate-100 dark:bg-academic-slate-700 rounded-lg text-label-sm font-semibold"
              >
                {zoomLevel}%
              </button>
              <button
                type="button"
                onClick={() => setIsInverted(!isInverted)}
                className="px-2 py-1 bg-academic-slate-100 dark:bg-academic-slate-700 rounded-lg text-label-sm font-semibold"
              >
                Invert
              </button>
            </div>
          </div>

          {/* Scanned Examination Paper Mockup */}
          <div
            className={`p-8 rounded-2xl border font-serif select-none transition-colors relative overflow-hidden shadow-inner min-h-[460px] ${
              isInverted
                ? "bg-academic-slate-950 text-academic-slate-200 border-academic-slate-800"
                : "bg-[#FAF7EE] text-[#2C2416] border-amber-200"
            }`}
          >
            {/* Archived Stamp */}
            <div className="absolute top-4 right-4 rotate-12 border-2 border-red-500/70 text-red-600/80 px-2.5 py-0.5 text-label-sm font-sans font-extrabold uppercase rounded tracking-wider">
              Archived Record &bull; 2018
            </div>

            <div className="text-center space-y-1 mb-6">
              <h3 className="font-sans font-extrabold text-headline-sm uppercase tracking-wide">
                Department of Computer Science &amp; Engineering
              </h3>
              <div className="font-sans text-label-sm text-academic-slate-500 flex justify-center gap-4">
                <span>Time: 3 Hours</span>
                <span>Maximum Marks: 100</span>
                <span>Paper Code: B-402</span>
              </div>
            </div>

            <div className="space-y-4 text-body-md leading-relaxed">
              <div>
                <strong>Q1. (a)</strong> Define an AVL tree. What are the rotation operations needed when an insertion causes
              </div>

              {/* Bounding Box #04 - Bleed Smudge */}
              <div className="p-3 my-2 rounded-xl border-2 border-dashed border-amber-500 bg-amber-500/10 font-mono text-body-sm relative">
                <span className="absolute -top-3 left-3 bg-amber-600 text-white text-[10px] font-sans font-bold px-1.5 py-0.5 rounded">
                  Bounding Box #04 - Confidence 38% (Bleed Smudge)
                </span>
                <span className="opacity-70 blur-[0.3px]">
                  an imba.......ce at the left child of ...sub...eflnk
                </span>
                <span className="block text-[11px] font-sans text-amber-700 dark:text-amber-300 mt-1 italic">
                  [bleed through from reverse page]
                </span>
              </div>

              <div>
                <strong>(b)</strong> State the worst-case and average-case time complexities of QuickSort. Explain the role of the pivot element in partitioning.
              </div>

              <div className="pt-2">
                <strong>Q2. (a)</strong> Illustrate the step-by-step construction of a Minimum Spanning Tree using Prim's algorithm for the given weighted undirected graph...
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-label-sm text-academic-slate-400 pt-2 border-t border-academic-slate-200 dark:border-academic-slate-700">
            <span>Calibration: Verified 1:1 Scale &bull; Sensor: Flatbed 300dpi</span>
            <span>Bounding boxes: 6/32 mapped</span>
          </div>
        </div>

        {/* Right Pane: SAFEGUARD PRINCIPLE: Verification Isolation Model (Screenshot 3) */}
        <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4">
          <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 space-y-1 text-body-sm">
            <div className="font-bold text-label-md text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-academic-primary" />
              <span>SAFEGUARD PRINCIPLE: Verification Isolation Model</span>
            </div>
            <p className="text-blue-800 dark:text-blue-300 text-label-sm">
              AI text predictions are isolated with distinct visual boundaries. Never treat algorithmic reconstructions as original exam text until verified against the scan.
            </p>
          </div>

          <div className="space-y-3">
            {/* Line 1 */}
            <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-center justify-between text-body-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    98% Match
                  </span>
                  <span className="text-label-sm text-academic-slate-400">Verified by 2 peers</span>
                  <span className="text-label-sm text-academic-slate-400">&bull; HEADER</span>
                </div>
                <div className="font-semibold text-academic-slate-900 dark:text-academic-slate-100">
                  DEPARTMENT OF COMPUTER SCIENCE &amp; ENGINEERING
                </div>
              </div>
              <span className="text-emerald-600 font-bold text-label-sm flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Confirmed
              </span>
            </div>

            {/* Line 2 */}
            <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-center justify-between text-body-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    94% Match
                  </span>
                  <span className="text-label-sm text-academic-slate-400">&bull; METADATA</span>
                </div>
                <div className="font-semibold text-academic-slate-900 dark:text-academic-slate-100">
                  Time: 3 Hours | Maximum Marks: 100 | Question Paper Code: B-402
                </div>
              </div>
              <span className="text-emerald-600 font-bold text-label-sm flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Confirmed
              </span>
            </div>

            {/* Line 3 */}
            <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-center justify-between text-body-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    74% Match
                  </span>
                  <span className="text-label-sm text-academic-slate-400">Reviewer pending &bull; QUESTION</span>
                </div>
                <div className="font-medium text-academic-slate-900 dark:text-academic-slate-100">
                  Q1. (a) Define an AVL tree. What are the rotation operations needed when an insertion causes...
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1 bg-academic-primary text-white text-label-sm font-semibold rounded-lg"
              >
                Confirm [Alt+C]
              </button>
            </div>

            {/* Line 4: Reconstructed, Unverified - Algorithmic Guess (Screenshot 3 & 4 Callout) */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border-2 border-amber-400 dark:border-amber-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-label-sm font-extrabold text-amber-800 dark:text-amber-200 uppercase">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Line 4 &bull; Reconstructed, Unverified - Algorithmic Guess
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                  38% Confidence
                </span>
              </div>

              <div className="p-2.5 bg-white dark:bg-academic-slate-900 rounded-xl border border-amber-200 dark:border-amber-800 font-mono text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                <div className="text-[10px] font-bold text-academic-slate-400 mb-0.5 uppercase">Raw OCR Output [Fragmented]:</div>
                an imba...ce at the left child of ... right sub...ee?
              </div>

              <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-body-sm">
                <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-0.5 uppercase">Proposed Reconstruction [ML Suggestion]:</div>
                {isEditingLine4 ? (
                  <input
                    type="text"
                    value={line4Text}
                    onChange={(e) => setLine4Text(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-academic-slate-800 text-body-sm"
                  />
                ) : (
                  <div className="font-semibold text-academic-slate-900 dark:text-academic-slate-100">
                    {line4Text}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLine4Confirmed(true)}
                    className="px-4 py-2 bg-academic-primary text-white text-label-sm font-semibold rounded-xl hover:bg-academic-primary-hover shadow-sm"
                  >
                    {line4Confirmed ? "Confirmed & Saved ✓" : "Confirm & Save Line"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingLine4(!isEditingLine4)}
                    className="px-3 py-2 bg-white dark:bg-academic-slate-800 border border-academic-slate-300 dark:border-academic-slate-600 text-label-sm font-semibold rounded-xl"
                  >
                    {isEditingLine4 ? "Done Editing" : "Edit Line Text"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Marked line as illegible. Triggering secondary flatbed scan request.")}
                  className="text-label-sm text-rose-600 hover:underline"
                >
                  Mark as Illegible / Needs Rescan
                </button>
              </div>
            </div>

            {/* Line 5 */}
            <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-center justify-between text-body-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    91% Match
                  </span>
                  <span className="text-label-sm text-academic-slate-400">&bull; QUESTION</span>
                </div>
                <div className="font-medium text-academic-slate-900 dark:text-academic-slate-100">
                  (b) State the worst-case and average-case time complexities of QuickSort.
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1 bg-academic-primary text-white text-label-sm font-semibold rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>

          <div className="pt-2 text-label-sm text-academic-slate-400 flex flex-wrap gap-3 border-t border-academic-slate-200 dark:border-academic-slate-700">
            <span>Alt+C Confirm Line</span>
            <span>&bull;</span>
            <span>Alt+E Edit Line</span>
            <span>&bull;</span>
            <span>Alt+N Next Low-Confidence</span>
            <span>&bull;</span>
            <span>Space Toggle Invert</span>
          </div>
        </div>
      </div>

      {/* Bottom Contributor Consensus & Quality Checklist (Screenshot 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-headline-sm">Contributor Consensus</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Level 2 Gating
            </span>
          </div>
          <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Siksha OpenLearn requires dual independent peer confirmations before transcribing paper to public student databases.
          </p>
          <div className="text-label-sm font-semibold text-emerald-600">
            Page 1 Verification Progress: 2 of 3 Peer Votes
          </div>
          <div className="text-label-sm text-academic-slate-400">
            Active Contributors: 5 online &bull; <span className="underline cursor-pointer">View Peer Log</span>
          </div>
        </div>

        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-3">
          <span className="font-bold text-headline-sm">Provenance &amp; Quality Checklist</span>
          <div className="space-y-1.5 text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Non-commercial historical past-paper verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Contains zero commercial textbook reprints or paywalled keys</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Exam questions verified strictly without syllabus altering</span>
            </div>
          </div>
          <div className="text-label-sm font-mono text-academic-slate-400 pt-1">
            Cryptographic hash: sha256:7f49c0...8a1
          </div>
        </div>

        <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-headline-sm">Licensing &amp; Provenance</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
              Escalation Channel
            </span>
          </div>
          <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Short excerpts are used with attribution. Licensing and permissible-use terms require legal review before public release.
          </p>
          <div className="text-label-sm text-blue-600 font-semibold underline cursor-pointer">
            Inquiries &bull; Handled via platform escalation policy
          </div>
        </div>
      </div>
    </div>
  );
};
