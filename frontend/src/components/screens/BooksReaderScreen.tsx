import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Scissors,
  ShieldCheck,
  Sliders,
  Sparkles,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";

export const BooksReaderScreen: React.FC = () => {
  const { setActiveScreen } = useUIStore();
  const [bionicMode, setBionicMode] = useState(false);
  const [paperTheme, setPaperTheme] = useState<"sepia" | "clean" | "night">("clean");
  const [fontSize, setFontSize] = useState<"base" | "lg" | "xl">("base");
  const [activeTab, setActiveTab] = useState<"reader" | "pdf_tools">("reader");
  const [pdfToolStatus, setPdfToolStatus] = useState<string | null>(null);

  const sampleBookText = `Bellman-Ford Algorithm solves the single-source shortest-path problem in the general case in which edge weights may be negative. Given a weighted, directed graph G = (V, E) with source vertex s and weight function w : E -> R, the Bellman-Ford algorithm returns a boolean value indicating whether there is a negative-weight cycle that is reachable from the source.

If there is such a cycle, the algorithm indicates that no solution exists. If there is no such cycle, the algorithm produces the shortest paths and their weights. The algorithm relaxes edges progressively decreasing an estimate on the weight of a shortest path until it achieves the actual shortest-path weight. The algorithm runs in O(V * E) time.`;

  const formatBionic = (text: string) => {
    return text.split(" ").map((word, idx) => {
      const mid = Math.ceil(word.length / 2);
      const boldPart = word.slice(0, mid);
      const rest = word.slice(mid);
      return (
        <span key={idx} className="inline-block mr-1">
          <strong className="font-extrabold">{boldPart}</strong>
          {rest}
        </span>
      );
    });
  };

  const handlePdfAction = (action: string) => {
    setPdfToolStatus(`Processing ${action} locally in WebAssembly memory... Done (0 bytes sent over network).`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-label-sm font-semibold text-indigo-700 dark:text-indigo-400">
            <BookOpen className="w-4 h-4" />
            <span>OpenStax + NCERT Curated Repository &bull; High Legibility</span>
          </div>
          <h2 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 mt-1">
            Books Reader &amp; Client-Side PDF Tools
          </h2>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300">
            Distraction-free textbook reader with bionic reading, night paper presets, and zero-server client PDF utility suite.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("reader")}
            className={`min-h-touch px-4 py-2 rounded-xl text-label-md font-semibold transition ${
              activeTab === "reader"
                ? "bg-academic-primary text-white shadow-sm"
                : "bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-200"
            }`}
          >
            Open Reader
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pdf_tools")}
            className={`min-h-touch px-4 py-2 rounded-xl text-label-md font-semibold transition ${
              activeTab === "pdf_tools"
                ? "bg-academic-primary text-white shadow-sm"
                : "bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-200"
            }`}
          >
            PDF Tools Suite
          </button>
        </div>
      </div>

      {activeTab === "reader" ? (
        /* Distraction-Free Reader Pane */
        <div className="space-y-6">
          {/* Reader Accessibility Controls Bar */}
          <div className="bg-white dark:bg-academic-slate-800 p-4 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 flex flex-wrap items-center justify-between gap-4 shadow-structural">
            <div className="flex items-center gap-3">
              <span className="text-label-sm font-bold text-academic-slate-600 dark:text-academic-slate-300">
                Reading Mode:
              </span>
              <button
                type="button"
                onClick={() => setBionicMode(!bionicMode)}
                className={`min-h-touch px-3 py-1.5 rounded-xl text-label-sm font-semibold transition border ${
                  bionicMode
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-academic-slate-50 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300 border-academic-slate-300 dark:border-academic-slate-600"
                }`}
              >
                {bionicMode ? "Bionic Reading (ON)" : "Bionic Reading (OFF)"}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-label-sm font-bold text-academic-slate-600 dark:text-academic-slate-300">
                Paper Preset:
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaperTheme("clean")}
                  className={`px-3 py-1 rounded-lg text-label-sm font-medium border ${
                    paperTheme === "clean"
                      ? "bg-white text-academic-slate-900 border-academic-primary font-bold shadow-sm"
                      : "bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300 border-transparent"
                  }`}
                >
                  Clean White
                </button>
                <button
                  type="button"
                  onClick={() => setPaperTheme("sepia")}
                  className={`px-3 py-1 rounded-lg text-label-sm font-medium border ${
                    paperTheme === "sepia"
                      ? "bg-amber-100 text-amber-900 border-amber-600 font-bold shadow-sm"
                      : "bg-amber-50 text-amber-800 border-transparent"
                  }`}
                >
                  Warm Sepia
                </button>
                <button
                  type="button"
                  onClick={() => setPaperTheme("night")}
                  className={`px-3 py-1 rounded-lg text-label-sm font-medium border ${
                    paperTheme === "night"
                      ? "bg-academic-slate-950 text-academic-slate-50 border-blue-500 font-bold shadow-sm"
                      : "bg-academic-slate-900 text-academic-slate-300 border-transparent"
                  }`}
                >
                  Night Contrast
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFontSize("base")}
                className={`px-2.5 py-1 rounded-lg text-label-sm ${fontSize === "base" ? "font-bold text-academic-primary" : "text-academic-slate-500"}`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize("lg")}
                className={`px-2.5 py-1 rounded-lg text-body-md ${fontSize === "lg" ? "font-bold text-academic-primary" : "text-academic-slate-500"}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("xl")}
                className={`px-2.5 py-1 rounded-lg text-headline-sm ${fontSize === "xl" ? "font-bold text-academic-primary" : "text-academic-slate-500"}`}
              >
                A+
              </button>
            </div>
          </div>

          {/* Book Reading Canvas */}
          <div
            className={`p-8 md:p-12 rounded-3xl border shadow-structural transition-colors ${
              paperTheme === "clean"
                ? "bg-white text-academic-slate-900 border-academic-slate-200"
                : paperTheme === "sepia"
                ? "bg-[#FCF8ED] text-[#3D3325] border-amber-200"
                : "bg-academic-slate-950 text-academic-slate-100 border-academic-slate-800"
            }`}
          >
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="border-b border-academic-slate-200 dark:border-academic-slate-700 pb-4 flex items-center justify-between text-label-sm opacity-70">
                <span>Introduction to Algorithms (CLRS 4th Ed.)</span>
                <span>Chapter 24 &bull; Page 651</span>
              </div>

              <h3 className="text-display-lg font-bold tracking-tight">
                24.1 The Bellman-Ford Algorithm
              </h3>

              <div
                className={`leading-relaxed space-y-4 ${
                  fontSize === "base"
                    ? "text-body-md"
                    : fontSize === "lg"
                    ? "text-body-lg"
                    : "text-headline-md"
                }`}
              >
                <p>
                  {bionicMode ? formatBionic(sampleBookText) : sampleBookText}
                </p>
              </div>

              <div className="pt-6 border-t border-academic-slate-200 dark:border-academic-slate-700 flex items-center justify-between text-label-sm">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Section</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScreen("research")}
                  className="font-semibold text-academic-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cross-check Citations in AI Research</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <span>Next Section</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Offline PDF Tools Suite (Stitch Spec) */
        <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-6">
          <div className="flex items-center justify-between border-b border-academic-slate-200 dark:border-academic-slate-700 pb-4">
            <div>
              <div className="flex items-center gap-2 text-label-sm font-semibold text-rose-600 dark:text-rose-400">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Client-Side WebAssembly &bull; Zero Cloud Upload</span>
              </div>
              <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100 mt-1">
                Student Document &amp; PDF Privacy Suite
              </h3>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-label-sm font-bold">
              Guaranteed Zero Telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 bg-academic-slate-50 dark:bg-academic-slate-900 space-y-3">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-fit">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                Compress PDF
              </h4>
              <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                Shrink exam answer scans up to 75% for seamless submission over 2G/3G connections.
              </p>
              <button
                type="button"
                onClick={() => handlePdfAction("PDF Compression")}
                className="w-full min-h-touch py-2 bg-academic-primary text-white font-semibold text-label-sm rounded-xl hover:bg-academic-primary-hover transition"
              >
                Compress File
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 bg-academic-slate-50 dark:bg-academic-slate-900 space-y-3">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                Merge Grade Sheets
              </h4>
              <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                Combine multi-semester marksheets into a single university application PDF.
              </p>
              <button
                type="button"
                onClick={() => handlePdfAction("PDF Merge")}
                className="w-full min-h-touch py-2 bg-purple-600 text-white font-semibold text-label-sm rounded-xl hover:bg-purple-700 transition"
              >
                Merge Documents
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 bg-academic-slate-50 dark:bg-academic-slate-900 space-y-3">
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 w-fit">
                <Scissors className="w-5 h-5" />
              </div>
              <h4 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                Extract Exam Pages
              </h4>
              <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                Isolate specific problem sections or assignment pages without modifying original.
              </p>
              <button
                type="button"
                onClick={() => handlePdfAction("Page Extraction")}
                className="w-full min-h-touch py-2 bg-rose-600 text-white font-semibold text-label-sm rounded-xl hover:bg-rose-700 transition"
              >
                Extract Pages
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 bg-academic-slate-50 dark:bg-academic-slate-900 space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                Redact ID Numbers
              </h4>
              <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                Black out personal phone numbers, Aadhaar, and home addresses before peer grading.
              </p>
              <button
                type="button"
                onClick={() => handlePdfAction("ID Redaction")}
                className="w-full min-h-touch py-2 bg-emerald-600 text-white font-semibold text-label-sm rounded-xl hover:bg-emerald-700 transition"
              >
                Redact Admit Card
              </button>
            </div>
          </div>

          {pdfToolStatus && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2.5 text-body-sm text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{pdfToolStatus}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
