import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Copy,
  Download,
  FileCheck2,
  FileText,
  Headphones,
  Info,
  Mic,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

export const CareerPrepScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"resume" | "interview">("resume");
  const [viewDevice, setViewDevice] = useState<"desktop" | "mobile">("desktop");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);
  const [isFairnessModalOpen, setIsFairnessModalOpen] = useState(false);

  // Interview state
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [interviewFeedback, setInterviewFeedback] = useState<null | {
    score: number;
    starPacing: string;
    technicalDepth: string;
    actionAdvice: string;
  }>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const handleEvaluateInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewAnswer.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setInterviewFeedback({
        score: 84,
        starPacing: "Strong STAR progression. Identified database concurrency bottleneck (Situation), isolated foreign key contention (Task), introduced Redis distributed lock (Action), and reduced p99 latency by 58% (Result).",
        technicalDepth: "Correctly contrasted pessimistic database locks vs distributed leases with TTLs in Redis.",
        actionAdvice: "Lead immediately with the quantitative latency drop in your first opening sentence.",
      });
      setIsSubmitting(false);
    }, 450);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stitch Header matching a77b066abd2241dc8c7b2ab459ebca67 */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-label-sm font-semibold text-cyan-700 dark:text-cyan-400">
            <Briefcase className="w-4 h-4" />
            <span>Siksha Career Studio &bull; Formative Growth Guidance &bull; 100% Confidential Sandbox</span>
          </div>
          <h2 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 mt-1">
            Career Studio &bull; Resume Lab &amp; Mock Interview Room
          </h2>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300 max-w-3xl mt-1">
            Formative coaching benchmarks to help you communicate academic projects, engineering metrics, and technical depth effectively.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-academic-slate-100 dark:bg-academic-slate-700 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab("resume")}
              className={`px-4 py-2 rounded-xl text-label-md font-semibold transition ${
                activeTab === "resume"
                  ? "bg-academic-primary text-white shadow-sm"
                  : "text-academic-slate-700 dark:text-academic-slate-300 hover:text-academic-primary"
              }`}
            >
              Resume Lab
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("interview")}
              className={`px-4 py-2 rounded-xl text-label-md font-semibold transition ${
                activeTab === "interview"
                  ? "bg-academic-primary text-white shadow-sm"
                  : "text-academic-slate-700 dark:text-academic-slate-300 hover:text-academic-primary"
              }`}
            >
              Mock Interview Room
            </button>
          </div>

          <button
            type="button"
            onClick={() => setViewDevice(viewDevice === "desktop" ? "mobile" : "desktop")}
            className="px-3 py-2 rounded-xl text-label-sm font-semibold border border-academic-slate-300 dark:border-academic-slate-600 hover:bg-academic-slate-50 dark:hover:bg-academic-slate-700 transition"
          >
            Switch to {viewDevice === "desktop" ? "Mobile View (375px)" : "Desktop View"}
          </button>
        </div>
      </div>

      {/* Top Banner: Personal Growth Guidance &bull; Not a Hiring Decision */}
      <div className="p-5 rounded-3xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <Info className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-label-md font-bold text-cyan-950 dark:text-cyan-200">
              Personal Growth Guidance &bull; Not a Hiring Decision
            </div>
            <p className="text-body-sm text-cyan-900/90 dark:text-cyan-300/90 max-w-2xl">
              These insights are formative coaching suggestions designed to help you communicate your academic projects and skills effectively. They reflect algorithmic heuristics and never determine your actual hiring potential.
            </p>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-academic-slate-900 rounded-2xl border border-cyan-200 dark:border-cyan-800 flex items-center justify-between gap-3 text-label-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-600" />
            <div>
              <div className="font-bold text-academic-slate-900 dark:text-academic-slate-100">
                Priya_Sharma_Resume_CS_2024.pdf
              </div>
              <div className="text-[11px] text-academic-slate-500">
                240 KB &bull; Encrypted Local Session &bull; Zero Cloud Retention
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsWipeModalOpen(true)}
            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
            title="Delete Resume & Analysis Immediately"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTab === "resume" ? (
        /* TAB 1: RESUME LAB (Stitch a77b066abd2241dc8c7b2ab459ebca67 & 2a81e00d546f40a69d55ec31b366b193) */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Diagnostic Summary (Stitch Spec) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-5">
                <div className="flex items-center justify-between border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
                  <div>
                    <div className="text-label-sm font-bold text-academic-slate-500 uppercase tracking-wide">
                      Diagnostic Summary
                    </div>
                    <div className="text-label-md font-bold text-academic-slate-800 dark:text-academic-slate-200">
                      Development Readiness Index
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Coaching Benchmark &bull; Not Pass/Fail
                  </span>
                </div>

                <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                  Assesses the degree of quantifiable engineering impact, role-specific vocabulary, and verifiable structural readability.
                </p>

                {/* Big Score Display */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 border border-cyan-200 dark:border-cyan-800 text-center space-y-2">
                  <div className="text-display-lg font-black text-cyan-800 dark:text-cyan-200">
                    82 <span className="text-headline-md font-normal text-academic-slate-400">/ 100</span>
                  </div>
                  <div className="text-label-md font-bold text-cyan-900 dark:text-cyan-100">
                    Curricular Alignment: High Potential
                  </div>
                  <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-300 max-w-sm mx-auto">
                    Demonstrates core computer science competencies with clear opportunities to foreground measurable system performance.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700">
                    <div className="text-headline-sm font-bold text-cyan-700 dark:text-cyan-300">4</div>
                    <div className="text-label-sm text-academic-slate-600 dark:text-academic-slate-400">Target Growth Areas</div>
                  </div>
                  <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700">
                    <div className="text-headline-sm font-bold text-emerald-600 dark:text-emerald-400">8</div>
                    <div className="text-label-sm text-academic-slate-600 dark:text-academic-slate-400">Strong Elements</div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-body-sm text-blue-900 dark:text-blue-200">
                  <strong>Next suggested baseline revision:</strong> Incorporate Latency &amp; Throughput Metrics.
                </div>
              </div>

              {/* Bias-Free Safeguard Guarantee (Stitch Spec) */}
              <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                    Bias-Free Safeguard Guarantee
                  </h3>
                </div>
                <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400 leading-relaxed">
                  Our model evaluates only technical communication clarity and project framing. It strictly ignores names, institutions, gender markers, postal codes, and demographic indicators.
                </p>

                <div className="space-y-2 text-label-sm">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Demographic Anonymization Mask Applied</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Institution Prestige Weighting Disabled</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Zero Data Sharing with Recruitment Algorithms</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFairnessModalOpen(true)}
                  className="text-label-sm font-semibold text-academic-primary hover:underline flex items-center gap-1 pt-1"
                >
                  <span>Review Algorithmic Fairness Audit &amp; Data Rights</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Detailed Dimension Coaching (Stitch Spec - 4 Evaluation Pillars) */}
            <div className="lg:col-span-7 bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-4">
                <div>
                  <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                    Detailed Dimension Coaching
                  </h3>
                  <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                    Examine plain-language explanations and rewrite suggestions customized to your draft.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-label-sm font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                  4 Evaluation Pillars
                </span>
              </div>

              {/* Criterion 01 */}
              <div className="p-5 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-academic-slate-400 uppercase">Criterion 01</span>
                    <h4 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                      Action-Oriented Impact
                    </h4>
                  </div>
                  <div className="text-headline-sm font-bold text-cyan-700 dark:text-cyan-300">
                    78 <span className="text-label-sm font-normal text-academic-slate-400">/ 100</span>
                  </div>
                </div>
                <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                  This dimension tracks whether you describe outcomes and measurable results rather than simply listing passive duty logs.
                </p>

                <div className="p-3 bg-white dark:bg-academic-slate-900 rounded-xl border border-red-200 dark:border-red-900/50 space-y-1">
                  <div className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase">Current Draft Excerpt</div>
                  <p className="text-body-sm text-academic-slate-700 dark:text-academic-slate-300 italic">
                    “Worked on website database backend.”
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Formative Revision Proposal</div>
                  <p className="text-body-sm text-emerald-950 dark:text-emerald-100 font-medium">
                    “Architected PostgreSQL schema for distributed library search, reducing query latency by 35% across 10,000 book records.”
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      Focus: Quantify data scale &amp; speedup
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("c1", "Architected PostgreSQL schema for distributed library search, reducing query latency by 35% across 10,000 book records.")}
                      className="px-3 py-1 bg-white dark:bg-academic-slate-800 rounded-lg text-label-sm font-semibold border border-emerald-300 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedItem === "c1" ? "Copied!" : "Copy Improvement"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Criterion 02 */}
              <div className="p-5 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-academic-slate-400 uppercase">Criterion 02</span>
                    <h4 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                      Technical Breadth
                    </h4>
                  </div>
                  <div className="text-headline-sm font-bold text-cyan-700 dark:text-cyan-300">
                    85 <span className="text-label-sm font-normal text-academic-slate-400">/ 100</span>
                  </div>
                </div>
                <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                  Assesses the modern toolchains, libraries, frameworks, and foundational computer science principles cited across your work.
                </p>

                <div className="p-3 bg-white dark:bg-academic-slate-900 rounded-xl border border-red-200 dark:border-red-900/50 space-y-1">
                  <div className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase">Current Draft Excerpt</div>
                  <p className="text-body-sm text-academic-slate-700 dark:text-academic-slate-300 italic">
                    “Built student dashboard using JavaScript and HTML.”
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Formative Revision Proposal</div>
                  <p className="text-body-sm text-emerald-950 dark:text-emerald-100 font-medium">
                    “Engineered modular student performance portal using TypeScript and React with client-side caching via IndexedDB.”
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      Focus: Explicit framework ecosystem
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("c2", "Engineered modular student performance portal using TypeScript and React with client-side caching via IndexedDB.")}
                      className="px-3 py-1 bg-white dark:bg-academic-slate-800 rounded-lg text-label-sm font-semibold border border-emerald-300 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedItem === "c2" ? "Copied!" : "Copy Improvement"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Criterion 03 */}
              <div className="p-5 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-academic-slate-400 uppercase">Criterion 03</span>
                    <h4 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                      Structure &amp; Readability
                    </h4>
                  </div>
                  <div className="text-headline-sm font-bold text-cyan-700 dark:text-cyan-300">
                    90 <span className="text-label-sm font-normal text-academic-slate-400">/ 100</span>
                  </div>
                </div>
                <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                  Measures visual scanning efficiency, consistent bullet grammar, typographic hierarchy, and clean parsing compatibility.
                </p>

                <div className="p-3 bg-white dark:bg-academic-slate-900 rounded-xl border border-red-200 dark:border-red-900/50 space-y-1">
                  <div className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase">Current Draft Excerpt</div>
                  <p className="text-body-sm text-academic-slate-700 dark:text-academic-slate-300 italic">
                    “Responsible for testing code, debugging errors, and helped team members with git conflicts.”
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Formative Revision Proposal</div>
                  <p className="text-body-sm text-emerald-950 dark:text-emerald-100 font-medium">
                    “Standardized CI test suites and automated Git conflict resolution workflows, raising pull request verification speed by 40%.”
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      Focus: Lead with active imperative verbs
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("c3", "Standardized CI test suites and automated Git conflict resolution workflows, raising pull request verification speed by 40%.")}
                      className="px-3 py-1 bg-white dark:bg-academic-slate-800 rounded-lg text-label-sm font-semibold border border-emerald-300 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedItem === "c3" ? "Copied!" : "Copy Improvement"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Criterion 04 */}
              <div className="p-5 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-academic-slate-400 uppercase">Criterion 04</span>
                    <h4 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                      Curriculum Relevance
                    </h4>
                  </div>
                  <div className="text-headline-sm font-bold text-cyan-700 dark:text-cyan-300">
                    76 <span className="text-label-sm font-normal text-academic-slate-400">/ 100</span>
                  </div>
                </div>
                <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                  Evaluates how smoothly classroom academic achievements translate into clear vocational and industry-standard capabilities.
                </p>

                <div className="p-3 bg-white dark:bg-academic-slate-900 rounded-xl border border-red-200 dark:border-red-900/50 space-y-1">
                  <div className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase">Current Draft Excerpt</div>
                  <p className="text-body-sm text-academic-slate-700 dark:text-academic-slate-300 italic">
                    “Completed semester capstone project on AI algorithms with high marks.”
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Formative Revision Proposal</div>
                  <p className="text-body-sm text-emerald-950 dark:text-emerald-100 font-medium">
                    “Trained Random Forest &amp; SVM classifiers on 50k sensor datapoints, achieving 94.2% precision for predictive maintenance.”
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      Focus: Highlight models and validation accuracy
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("c4", "Trained Random Forest & SVM classifiers on 50k sensor datapoints, achieving 94.2% precision for predictive maintenance.")}
                      className="px-3 py-1 bg-white dark:bg-academic-slate-800 rounded-lg text-label-sm font-semibold border border-emerald-300 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedItem === "c4" ? "Copied!" : "Copy Improvement"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-academic-slate-200 dark:border-academic-slate-700 space-y-3">
                <div className="text-label-md font-bold text-academic-slate-800 dark:text-academic-slate-200">
                  Ready to upgrade your draft?
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => alert("Applied suggestions directly to Resume Lab draft.")}
                    className="min-h-touch px-4 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Apply Suggestions to Resume Lab</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Upload a fresh resume PDF for instant re-analysis.")}
                    className="min-h-touch px-4 py-2.5 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-semibold text-label-md rounded-xl hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Run Another Draft</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Generating encrypted offline PDF report...")}
                    className="min-h-touch px-4 py-2.5 border border-academic-slate-300 dark:border-academic-slate-600 rounded-xl font-semibold text-label-md hover:bg-academic-slate-50 dark:hover:bg-academic-slate-700 transition flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Private PDF Report</span>
                  </button>
                </div>
                <div className="text-[11px] text-academic-slate-500 pt-2 flex items-center justify-between">
                  <span>Session fully compliant with Siksha OpenLearn Zero-Trace Student Privacy Charter</span>
                  <a href="#privacy" onClick={() => alert("Navigate to Privacy & Data Rights Centre")} className="text-academic-primary hover:underline font-semibold">
                    Data Rights &amp; Deletion Centre &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: MOCK INTERVIEW ROOM (Stitch ab558f4532484f9fbd712719d70b1265 & d9008725849f4d22a850252c77835f1a) */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-label-sm font-bold text-teal-700 dark:text-teal-400 uppercase">
                <Headphones className="w-4 h-4" />
                <span>Educational Simulator &bull; Coaching Feedback Only</span>
              </div>
              <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                Audio Session #MOCK-492 &bull; Concurrency &amp; System Bottlenecks
              </h3>
              <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                Zero Assessment Decisions &bull; Safe Practice Space &bull; No recruiter or institution ever sees this data.
              </p>
            </div>

            <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-center gap-3 text-label-sm">
              <div>
                <div className="font-bold text-academic-slate-900 dark:text-academic-slate-100">Stored in RAM Buffer</div>
                <div className="text-[11px] text-academic-slate-500">Recorded today &bull; 12 mins length</div>
              </div>
              <button
                type="button"
                onClick={() => alert("Interview recording purged permanently from memory.")}
                className="px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 rounded-xl text-label-sm font-semibold hover:bg-red-200 transition"
              >
                Delete Recording Permanently
              </button>
            </div>
          </div>

          {/* Metric Cards (Stitch ab558f4532484f9fbd712719d70b1265) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
              <div className="text-label-sm font-semibold text-academic-slate-500">Overall Rhythm</div>
              <div className="text-display-md font-black text-teal-700 dark:text-teal-300">82 / 100</div>
              <div className="text-label-md font-bold text-academic-slate-800 dark:text-academic-slate-200">
                Strong Structure &bull; Level 2 Engineer
              </div>
              <p className="text-body-sm text-academic-slate-500">
                Scoring measures structure, precision, and rationale. We deliberately omit pass/fail labels so you can isolate and polish storytelling mechanics.
              </p>
            </div>

            <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
              <div className="text-label-sm font-semibold text-academic-slate-500">Clarity of Reasoning</div>
              <div className="text-display-md font-black text-cyan-700 dark:text-cyan-300">82 / 100</div>
              <div className="text-label-md font-bold text-academic-slate-800 dark:text-academic-slate-200">
                Explaining the "why" behind trade-offs
              </div>
              <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                You stated the Big-O spatial trade-off before proposing Hash Maps. This gave your interviewer full visibility into your deliberate memory choices.
              </p>
            </div>

            <div className="bg-white dark:bg-academic-slate-800 p-6 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-2">
              <div className="text-label-sm font-semibold text-academic-slate-500">Direct Question Answering</div>
              <div className="text-display-md font-black text-emerald-700 dark:text-emerald-300">86 / 100</div>
              <div className="text-label-md font-bold text-academic-slate-800 dark:text-academic-slate-200">
                Front-loading direct answers
              </div>
              <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                Excellent bottom-line answering! In Question 1, you explicitly defined race conditions in your first 15 seconds before explaining Redis locks.
              </p>
            </div>
          </div>

          {/* STAR Framework Structure Card (Stitch Spec) */}
          <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-5">
            <div className="flex items-center justify-between border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
              <div>
                <span className="text-[11px] font-bold text-academic-primary uppercase tracking-wide">
                  Core Evaluation Rubric
                </span>
                <h4 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                  STAR Framework Structure (78 / 100)
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full text-label-sm font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Situation &bull; Task &bull; Action &bull; Result
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/60 space-y-2">
                <div className="text-label-sm font-bold text-red-800 dark:text-red-300 uppercase">
                  What You Said (Vague Task &amp; Result)
                </div>
                <blockquote className="text-body-sm text-red-950 dark:text-red-200 italic leading-relaxed">
                  “Our API was really slow during test runs so we rewrote the query logic and afterwards people said it loaded much better.”
                </blockquote>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="text-label-sm font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                  STAR Elevated Upgrade
                </div>
                <div className="text-body-sm text-emerald-950 dark:text-emerald-100 leading-relaxed space-y-1">
                  <p><strong>[Situation]</strong> Under a 10k request load test, our checkout endpoint timed out at 3.2s.</p>
                  <p><strong>[Action]</strong> I indexed foreign keys and implemented query caching with Redis.</p>
                  <p><strong>[Result]</strong> Latency dropped by 64% down to 1.1s.</p>
                </div>
              </div>
            </div>

            {/* Anti-Bias Commitment */}
            <div className="p-4 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Anti-Bias Commitment</span>
                </div>
                <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                  We strictly do <strong>not</strong> measure accent, pitch, voice modulation, eye contact, head movement, or visual facial expressions.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-label-sm font-bold text-emerald-700 dark:text-emerald-400">
                <span>&check; 100% Transcript Logic</span>
                <span>&check; Zero Accent Weighting</span>
                <span>&check; Zero Biometric Tracking</span>
              </div>
            </div>

            {/* Quick Audio Snippet Review */}
            <div className="space-y-3 pt-2">
              <div className="text-label-sm font-bold text-academic-slate-700 dark:text-academic-slate-300 uppercase">
                Quick Audio Snippet Review &bull; Audit Pacing
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                      Q1: Concurrency Architecture
                    </div>
                    <div className="text-[11px] text-academic-slate-500">0:45 audio sample &bull; p99 latency trade-off</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(isPlayingAudio === "q1" ? null : "q1")}
                    className="p-2.5 rounded-full bg-academic-primary text-white hover:bg-academic-primary-hover transition"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900/60 border border-academic-slate-200 dark:border-academic-slate-700 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                      Q2: Distributed Cache Fallback
                    </div>
                    <div className="text-[11px] text-academic-slate-500">1:12 audio sample &bull; Redis circuit breaker</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(isPlayingAudio === "q2" ? null : "q2")}
                    className="p-2.5 rounded-full bg-academic-primary text-white hover:bg-academic-primary-hover transition"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Drill Practice Form */}
          <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-5">
            <div className="space-y-1 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
              <div className="text-label-sm font-bold text-academic-primary uppercase tracking-wide">
                Live Interactive Simulator Drill
              </div>
              <h4 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
                Prompt: “Tell me about a complex database or concurrency bug you solved.”
              </h4>
            </div>

            <form onSubmit={handleEvaluateInterview} className="space-y-4">
              <div>
                <label htmlFor="interview-input" className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1">
                  Type or dictate your response following the STAR framework:
                </label>
                <textarea
                  id="interview-input"
                  rows={4}
                  value={interviewAnswer}
                  onChange={(e) => setInterviewAnswer(e.target.value)}
                  placeholder="In our distributed learning project, we noticed database connection timeout errors when 18 concurrent requests hit PostgreSQL... (Type your full answer here)"
                  className="w-full p-4 rounded-2xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-label-sm text-academic-slate-500">
                  <Mic className="w-4 h-4 text-teal-600" />
                  <span>Speech-to-text operates locally via Web Speech API &bull; Zero audio sent to cloud</span>
                </div>
                <button
                  type="submit"
                  disabled={!interviewAnswer.trim() || isSubmitting}
                  className="min-h-touch px-6 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Analyzing STAR Nuances..." : "Evaluate Response"}</span>
                </button>
              </div>
            </form>

            {interviewFeedback && (
              <div className="p-5 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="text-headline-sm font-bold text-teal-900 dark:text-teal-200">
                    STAR Evaluation Score: {interviewFeedback.score}/100
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                    Strong Technical Delivery
                  </span>
                </div>
                <div className="space-y-2 text-body-sm text-teal-950 dark:text-teal-100">
                  <p><strong>STAR Pacing:</strong> {interviewFeedback.starPacing}</p>
                  <p><strong>Technical Depth:</strong> {interviewFeedback.technicalDepth}</p>
                  <p><strong>Coach Advice:</strong> {interviewFeedback.actionAdvice}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Wipe Confirmation */}
      {isWipeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full border border-academic-slate-200 dark:border-academic-slate-700 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                Permanently Delete Resume?
              </h3>
            </div>
            <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-300">
              This will instantly erase <strong className="font-mono">Priya_Sharma_Resume_CS_2024.pdf</strong> and all cached formative feedback metrics from your sandbox. This action is irreversible.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsWipeModalOpen(false)}
                className="px-4 py-2 border border-academic-slate-300 dark:border-academic-slate-600 rounded-xl text-label-sm font-semibold hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700"
              >
                Keep My Document
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsWipeModalOpen(false);
                  alert("Resume and cached formative metrics wiped immediately.");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-label-sm font-semibold hover:bg-red-700"
              >
                Yes, Wipe Data Immediately
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Algorithmic Fairness Audit */}
      {isFairnessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-academic-slate-200 dark:border-academic-slate-700 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                  Algorithmic Fairness Audit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFairnessModalOpen(false)}
                className="p-1 hover:text-academic-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-body-sm text-academic-slate-600 dark:text-academic-slate-300">
              <p>
                The Siksha Career Studio uses an isolated deterministic grammar and entity-extraction pipeline.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Personal identifiers (names, phone numbers, email handles) are masked before NLP inference.</li>
                <li>No college tier rankings or institutional prestige multipliers are applied.</li>
                <li>Zero telemetry or student resume copies are saved to training corpuses or shared with commercial recruiters.</li>
              </ul>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsFairnessModalOpen(false)}
                className="px-4 py-2 bg-academic-primary text-white rounded-xl text-label-sm font-semibold hover:bg-academic-primary-hover"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
