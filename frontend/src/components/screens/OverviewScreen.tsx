import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Code2,
  Compass,
  FileCheck2,
  FileSearch,
  GraduationCap,
  Layers,
  Network,
  Play,
  RotateCw,
  Search,
  ShieldAlert,
  Sparkles,
  Terminal,
  UserCheck,
  Zap,
} from "lucide-react";
import { ScreenType, useUIStore } from "../../store/uiStore";

export const OverviewScreen: React.FC = () => {
  const { setActiveScreen, lowBandwidthMode, toggleLowBandwidthMode, setIsOnboardingOpen } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterTabs = [
    { id: "all", label: "All Catalog" },
    { id: "btech", label: "B.Tech / Engineering" },
    { id: "bcom", label: "B.Com / Accounting" },
    { id: "bsc", label: "B.Sc Natural Sciences" },
    { id: "humanities", label: "Humanities & Social Science" },
    { id: "gate", label: "UGC NET / GATE Prep" },
  ];

  const modules: {
    id: ScreenType;
    title: string;
    badge: string;
    badgeColor: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      id: "roadmap",
      title: "Curriculum Roadmap",
      badge: "Sem IV Synced",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300",
      description: "Structured semester milestones across STEM & Commerce. Visual dependency graphs show prerequisites.",
      icon: Network,
      accentColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30",
    },
    {
      id: "papers",
      title: "Past-Paper Bank",
      badge: "1,240+ Solved",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300",
      description: "Official university archives with marking schemes, handwritten answer keys, and dual-pane OCR verification.",
      icon: FileSearch,
      accentColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30",
    },
    {
      id: "research",
      title: "AI Study Assistant & Research",
      badge: "Grounded AI",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300",
      description: "Multi-agent autonomous research engine. Synthesizes peer-reviewed citations and fact-checks textbook claims.",
      icon: Sparkles,
      accentColor: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30",
    },
    {
      id: "console",
      title: "Coding Console",
      badge: "Offline WASM",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300",
      description: "Zero-install client-side WebAssembly sandbox for Python 3.11, C++, and JS. Zero latency execution.",
      icon: Code2,
      accentColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30",
    },
    {
      id: "library",
      title: "Open Books Reader",
      badge: "OpenStax + NCERT",
      badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300",
      description: "High-legibility reader with bionic reading, night paper mode, and marginalia notes for strained eyes.",
      icon: BookOpen,
      accentColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30",
    },
    {
      id: "library",
      title: "Offline PDF Tools",
      badge: "100% Client-Side",
      badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300",
      description: "Compress, merge, split, and redact exam admit cards. Zero server uploads guarantee total data privacy.",
      icon: Layers,
      accentColor: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30",
    },
    {
      id: "career",
      title: "Resume Checker",
      badge: "ATS Parser",
      badgeColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300",
      description: "First-time job seekers receive structural ATS audits, action-verb ratings, and metric validations.",
      icon: UserCheck,
      accentColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30",
    },
    {
      id: "career",
      title: "Interview Coach",
      badge: "Voice & Text",
      badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300",
      description: "Scenario drills and mock technical responses using the STAR method, rubric pacing, and clarity feedback.",
      icon: GraduationCap,
      accentColor: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Low-Bandwidth Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-body-sm text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2.5">
          <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>
            <strong>{lowBandwidthMode ? "Low-Bandwidth Mode Active" : "Standard Bandwidth Mode"}</strong> &bull;{" "}
            {lowBandwidthMode
              ? "142 MB Free &bull; Zero video auto-play &bull; 100% offline cache enabled"
              : "High-definition assets enabled"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLowBandwidthMode}
            className="text-label-sm font-semibold underline hover:no-underline text-emerald-700 dark:text-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
          >
            {lowBandwidthMode ? "Switch to Standard" : "Enable 2G Saver"}
          </button>
          <span className="text-emerald-400">&bull;</span>
          <button
            type="button"
            onClick={() => setIsOnboardingOpen(true)}
            className="text-label-sm font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900 transition"
          >
            Profile &amp; Privacy Setup
          </button>
        </div>
      </div>

      {/* Hero & Discovery Search (Stitch Desktop Screen Spec) */}
      <section className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-10 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-label-sm font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Digital Public Good &bull; Free &bull; Zero Paywall</span>
          </div>
          <h2 className="text-display-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 tracking-tight leading-tight">
            Open, free learning resources for higher education and self-directed study.
          </h2>
          <p className="text-body-lg text-academic-slate-600 dark:text-academic-slate-300 leading-relaxed">
            No paywalls, no login barriers, works on 2G/3G mobile tethering and low-spec laptops. Built explicitly to empower higher education across non-metropolitan universities.
          </p>

          {/* Search Box */}
          <div className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) setActiveScreen("papers");
              }}
              className="flex flex-col sm:flex-row gap-2.5 max-w-2xl"
            >
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-academic-slate-400" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 12,000+ past papers, syllabus roadmaps, coding exercises, or books..."
                  className="w-full pl-11 pr-4 py-3 bg-academic-slate-50 dark:bg-academic-slate-900 border border-academic-slate-300 dark:border-academic-slate-600 rounded-2xl text-body-md text-academic-slate-900 dark:text-academic-slate-100 placeholder:text-academic-slate-400 focus-visible:ring-2 focus-visible:ring-academic-primary transition"
                />
              </div>
              <button
                type="submit"
                className="min-h-touch px-6 py-3 bg-academic-primary text-white font-semibold text-label-md rounded-2xl hover:bg-academic-primary-hover shadow-structural transition flex items-center justify-center gap-2"
              >
                <span>Search Library</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-label-sm font-semibold transition border ${
                  selectedFilter === tab.id
                    ? "bg-academic-primary text-white border-academic-primary shadow-sm"
                    : "bg-academic-slate-100 dark:bg-academic-slate-700/60 text-academic-slate-700 dark:text-academic-slate-300 border-academic-slate-200 dark:border-academic-slate-600 hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-academic-slate-200 dark:border-academic-slate-700 text-center">
            <div className="p-2.5 bg-academic-slate-50 dark:bg-academic-slate-900/60 rounded-xl">
              <div className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">12,480+</div>
              <div className="text-label-sm text-academic-slate-500">Archived Papers</div>
            </div>
            <div className="p-2.5 bg-academic-slate-50 dark:bg-academic-slate-900/60 rounded-xl">
              <div className="text-headline-sm font-bold text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-label-sm text-academic-slate-500">Local Computation</div>
            </div>
            <div className="p-2.5 bg-academic-slate-50 dark:bg-academic-slate-900/60 rounded-xl">
              <div className="text-headline-sm font-bold text-amber-600 dark:text-amber-400">Zero</div>
              <div className="text-label-sm text-academic-slate-500">Login or Paywall</div>
            </div>
            <div className="p-2.5 bg-academic-slate-50 dark:bg-academic-slate-900/60 rounded-xl">
              <div className="text-headline-sm font-bold text-blue-600 dark:text-blue-400">&lt; 35 KB</div>
              <div className="text-label-sm text-academic-slate-500">Baseline Payload</div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Academic Journey Card (Stitch Mobile & Desktop Spec) */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-academic-slate-800 dark:to-academic-slate-850 rounded-3xl p-6 md:p-8 border border-blue-200/80 dark:border-academic-slate-700 shadow-structural">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-bold tracking-wider uppercase text-blue-700 dark:text-blue-400">
                Academic Specialization &bull; Term IV (B.Tech / BCA)
              </span>
            </div>
            <h3 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-100">
              Algorithms &amp; Data Structures
            </h3>
            <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300 max-w-xl">
              Module 6 of 9: Graph Algorithms (Dijkstra, Bellman-Ford &amp; Minimum Spanning Trees). Ready for offline self-evaluation and code compilation.
            </p>
            <div className="flex items-center gap-4 text-label-sm font-semibold text-academic-slate-600 dark:text-academic-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                18 of 28 Topics Verified
              </span>
              <span>&bull;</span>
              <span>Next Exam: In 14 Days</span>
            </div>
          </div>

          <div className="flex items-center gap-6 self-start md:self-auto bg-white dark:bg-academic-slate-900 p-5 rounded-2xl border border-blue-100 dark:border-academic-slate-700 shadow-sm">
            <div className="text-center">
              <div className="text-display-lg font-bold text-blue-600 dark:text-blue-400">64%</div>
              <div className="text-label-sm text-academic-slate-500 uppercase tracking-wider">Completed</div>
            </div>
            <div className="border-l border-academic-slate-200 dark:border-academic-slate-700 pl-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setActiveScreen("roadmap")}
                className="min-h-touch px-4 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2"
              >
                <Play className="w-4 h-4" aria-hidden="true" />
                <span>Launch Problem</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveScreen("console")}
                className="px-3 py-1 text-label-sm font-semibold text-academic-slate-600 dark:text-academic-slate-400 hover:text-academic-primary transition"
              >
                Open REPL Console &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The 8 Essential Student Modules (Stitch Grid Spec) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
              The 8 Essential Student Modules
            </h3>
            <p className="text-body-sm text-academic-slate-500 dark:text-academic-slate-400">
              Zero fees, no sign-in paywalls, engineered for offline browser persistence.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-label-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
            <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>8 of 8 Modules Synced</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => setActiveScreen(mod.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveScreen(mod.id);
                  }
                }}
                className="bg-white dark:bg-academic-slate-800 p-5 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural hover:shadow-structural-elevated hover:border-academic-primary/60 transition cursor-pointer flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-academic-primary"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${mod.accentColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-label-sm font-semibold ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>
                  <h4 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100 group-hover:text-academic-primary transition">
                    {mod.title}
                  </h4>
                  <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400 line-clamp-2">
                    {mod.description}
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between text-label-sm font-semibold text-academic-primary group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Module</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Grounded AI Study Material with Citations & "Verify Before You Trust" Card */}
      <section className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-label-sm font-semibold bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300">
              [AI-generated study material]
            </span>
            <span className="text-body-sm text-academic-slate-500">
              Grounded with RAG on Open Syllabus Textbooks &bull; Model: DeepSeek-R1-Distill (Offline Quantized)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveScreen("research")}
            className="text-label-sm font-semibold text-academic-primary hover:underline flex items-center gap-1"
          >
            Launch Research Inquiry &rarr;
          </button>
        </div>

        {/* Caution Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-2xl p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <h4 className="text-label-md font-bold text-amber-900 dark:text-amber-200">
              Verify Before You Trust
            </h4>
            <p className="text-body-sm text-amber-800/90 dark:text-amber-300">
              Automated study aid. Always verify critical engineering proofs, algorithmic complexity proofs, and formulas against your university-prescribed textbooks before submitting assignments or sitting for exams.
            </p>
          </div>
        </div>

        {/* Content Breakdown with Formal Code Snippet */}
        <div className="space-y-4">
          <div>
            <div className="text-label-sm text-academic-slate-500 uppercase tracking-wider">
              Source: 2023 End-Term Exam (Paper Code: CS-402, Q4b)
            </div>
            <h4 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100 mt-1">
              Question Breakdown: Bellman-Ford Negative Cycle Detection
            </h4>
          </div>

          <p className="text-body-md text-academic-slate-700 dark:text-academic-slate-300 leading-relaxed">
            Bellman-Ford operates by relaxing all |E| edges |V| - 1 times. If we run an additional relaxation pass and any distance decreases (<code>d[v] &gt; d[u] + w(u, v)</code>), the graph contains a reachable <strong>negative-weight cycle</strong>.
          </p>

          <div className="bg-academic-slate-900 text-academic-slate-100 p-4 rounded-xl font-mono text-body-sm overflow-x-auto">
            <pre>{`for each edge (u, v) with weight w:
    if dist[u] + w < dist[v]:
        throw NegativeWeightCycleException()`}</pre>
          </div>

          {/* Citations Box */}
          <div className="bg-academic-slate-50 dark:bg-academic-slate-900 p-4 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 space-y-2">
            <div className="text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300">
              Citations &amp; Primary Pages:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-body-sm">
              <div className="flex items-center gap-2 text-academic-slate-800 dark:text-academic-slate-200">
                <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>CLRS 4th Ed. &bull; Section 24.1 (Pages 651-655, Lemma 24.2 verified)</span>
              </div>
              <div className="flex items-center gap-2 text-academic-slate-800 dark:text-academic-slate-200">
                <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Tanenbaum Computer Networks &bull; Ch. 5 (Distance Vector &amp; Count-to-Infinity)</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveScreen("library")}
                className="text-label-sm font-semibold text-academic-primary hover:underline inline-flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Verified Text in Reader</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Code Preview (Stitch Desktop Spec) */}
      <section className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
          <div className="space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-2 text-label-sm font-semibold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <Terminal className="w-3.5 h-3.5" />
              <span>No Laptop Setup Needed &bull; Client-Side VM</span>
            </div>
            <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
              Execute textbook algorithms immediately.
            </h3>
            <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300">
              Perfect for college library computers with strict administrative locks. Runs safely in client WebAssembly sandbox.
            </p>
            <button
              type="button"
              onClick={() => setActiveScreen("console")}
              className="min-h-touch px-5 py-2.5 bg-emerald-600 text-white font-semibold text-label-md rounded-xl hover:bg-emerald-700 transition inline-flex items-center gap-2 shadow-sm"
            >
              <Code2 className="w-4 h-4" />
              <span>Open Interactive Code Workspace</span>
            </button>
          </div>

          <div className="w-full lg:w-1/2 bg-academic-slate-950 rounded-2xl p-4 border border-academic-slate-800 text-emerald-400 font-mono text-body-sm shadow-structural">
            <div className="flex items-center justify-between pb-3 border-b border-academic-slate-800 text-academic-slate-400 text-label-sm">
              <span>sandbox : python 3.11 wasm</span>
              <span className="text-emerald-400">&bull; 0ms server latency</span>
            </div>
            <pre className="py-3 text-academic-slate-200 overflow-x-auto">{`# Quick Binary Search Verification
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`}</pre>
            <div className="pt-2 text-label-sm text-academic-slate-400 flex items-center justify-between">
              <span>Zero network latency &bull; In-memory execution in 4.2ms</span>
              <span className="text-emerald-400 font-bold">READY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Multilingual Rigor & Typography Clearance Test (Stitch Rigor Spec) */}
      <section className="bg-academic-slate-100/70 dark:bg-academic-slate-800/50 rounded-2xl p-5 border border-academic-slate-200 dark:border-academic-slate-700 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-label-sm text-academic-slate-600 dark:text-academic-slate-400">
          <span className="font-bold uppercase tracking-wider text-academic-slate-700 dark:text-academic-slate-300">
            Script Rigor &amp; Accessibility Affirmation
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            WCAG 2.2 AAA Compliant &bull; Min Tap Target: 44x44px &bull; PWA Offline Ready
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-label-sm">
          <span className="px-2.5 py-1 bg-white dark:bg-academic-slate-900 rounded-lg border border-academic-slate-200 dark:border-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-sans">
            Latin: Verified
          </span>
          <span className="px-2.5 py-1 bg-white dark:bg-academic-slate-900 rounded-lg border border-academic-slate-200 dark:border-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-sans">
            देवनागरी: प्रमाणित
          </span>
          <span className="px-2.5 py-1 bg-white dark:bg-academic-slate-900 rounded-lg border border-academic-slate-200 dark:border-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-sans">
            বাংলা: প্রস্তুত
          </span>
          <span className="px-2.5 py-1 bg-white dark:bg-academic-slate-900 rounded-lg border border-academic-slate-200 dark:border-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-sans">
            தமிழ்: சரிபார்க்கப்பட்டது
          </span>
          <span className="px-2.5 py-1 bg-white dark:bg-academic-slate-900 rounded-lg border border-academic-slate-200 dark:border-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-sans">
            اردو: تصدیق شدہ
          </span>
        </div>
      </section>
    </div>
  );
};
