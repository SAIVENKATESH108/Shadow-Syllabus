import React, { useState } from "react";
import {
  Compass,
  Download,
  Lock,
  Play,
  Plus,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";

interface RoadmapNode {
  id: string;
  number: number;
  title: string;
  status: "mastered" | "active" | "next_up" | "locked" | "elective";
  loggedTime: string;
  subtext: string;
  isElective?: boolean;
}

export const RoadmapScreen: React.FC = () => {
  const [viewFormat, setViewFormat] = useState<"graph" | "outline">("graph");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-3");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(
    "In Raft, nodes start as Followers. If they hear no heartbeat within a randomized election timeout (150–300ms), they transition to Candidates, increment their term, vote for themselves, and send RequestVote RPCs to peers until a strict majority (quorum) confirms leadership."
  );

  const nodes: RoadmapNode[] = [
    {
      id: "node-1",
      number: 1,
      title: "Socket Programming & TCP/UDP",
      status: "mastered",
      loggedTime: "6h logged",
      subtext: "Verified Quiz Score 94%",
    },
    {
      id: "node-2",
      number: 2,
      title: "Remote Procedure Calls (gRPC)",
      status: "mastered",
      loggedTime: "8h logged",
      subtext: "Lab Repo Synced",
    },
    {
      id: "node-3",
      number: 3,
      title: "Consensus & Raft Algorithm",
      status: "active",
      loggedTime: "4 of 10h Completed",
      subtext: "Paced: 3 days left",
    },
    {
      id: "node-4",
      number: 4,
      title: "Vector Clocks & Timestamps",
      status: "next_up",
      loggedTime: "Est. 6h",
      subtext: "Unlocks Week 5",
    },
    {
      id: "node-5",
      number: 5,
      title: "Distributed Key-Value Store",
      status: "locked",
      loggedTime: "12h allocation",
      subtext: "Prerequisite: Complete Node 3 (Raft Consensus)",
    },
    {
      id: "node-6",
      number: 6,
      title: "Byzantine Faults (PBFT)",
      status: "elective",
      loggedTime: "8h",
      subtext: "Optional Honors Track",
      isElective: true,
    },
  ];

  const handleAskAi = (promptText?: string) => {
    const q = promptText || aiQuestion;
    if (!q.trim()) return;
    if (q.includes("Paxos")) {
      setAiResponse(
        "Raft vs Paxos: While Paxos is notoriously difficult to understand and decomposes consensus into dual Synod rounds, Raft decomposes consensus into 3 independent subproblems: Leader Election, Log Replication, and Safety Invariants. Raft guarantees that only servers with up-to-date logs can be elected leaders."
      );
    } else if (q.includes("viva")) {
      setAiResponse(
        "3 Practice Viva Questions:\n1. Why must election timeouts be randomized?\n2. What is the Log Matching Property in Raft?\n3. How does Raft handle a split-brain partitioned network when partitioned nodes elect a local candidate?"
      );
    } else {
      setAiResponse(
        "In Raft, nodes start as Followers. If they hear no heartbeat within a randomized election timeout (150–300ms), they transition to Candidates, increment their term, vote for themselves, and send RequestVote RPCs to peers until a strict majority (quorum) confirms leadership."
      );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Specialization Banner & Pills (Screenshot 1) */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-label-sm">
          <span className="px-3 py-1 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            B.Tech Sem 4 Specialization
          </span>
          <span className="px-3 py-1 rounded-full font-semibold bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300">
            10 hrs / week
          </span>
          <span className="px-3 py-1 rounded-full font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Pace Metric: 7.8 (Baseline Calibration Only — Zero Student Ranking or Public Score)
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-display-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 tracking-tight">
              Distributed Systems &amp; Cloud Engineering
            </h2>
            <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300 leading-relaxed">
              Paced progression mapping for decentralized architectures, consensus protocols, and low-latency storage engines. Calibrated strictly for individual learning velocity without comparative rank tracking.
            </p>
          </div>

          <div className="bg-academic-slate-50 dark:bg-academic-slate-900 p-5 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 flex flex-col items-center justify-center space-y-2 min-w-[240px]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-label-sm font-semibold text-academic-slate-500">
                <span>Curriculum Progress</span>
                <span className="text-blue-600 font-bold">28% Completed</span>
              </div>
              <div className="text-headline-md font-extrabold text-academic-slate-900 dark:text-academic-slate-100 mt-1">
                4 of 14 Nodes Mastered
              </div>
              <div className="text-label-sm text-academic-slate-400">10 Remaining</div>
            </div>
            <button
              type="button"
              onClick={() => alert("Exporting curriculum map to local SQLite database.")}
              className="w-full min-h-touch py-2 px-3 bg-academic-primary text-white text-label-sm font-semibold rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export Roadmap / SQLite</span>
            </button>
          </div>
        </div>

        {/* Pedagogical Sovereignty Engine Banner (Screenshot 1) */}
        <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-body-sm text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-academic-primary flex-shrink-0" />
            <span>
              <strong>PEDAGOGICAL SOVEREIGNTY ENGINE &bull; 100% Student-Editable:</strong> This roadmap is an adaptive suggestion based on your 10 hrs/week schedule. You have full sovereignty: drag to reorder, add custom topics, or remove prerequisites anytime.
            </span>
          </div>
          <button
            type="button"
            onClick={() => alert("Reset sequence to official University of Delhi syllabus.")}
            className="text-label-sm font-semibold text-academic-primary dark:text-blue-300 hover:underline whitespace-nowrap self-end sm:self-auto"
          >
            Reset to University Syllabus
          </button>
        </div>
      </div>

      {/* Main Roadmap Area: Graph Canvas on Left, Target Inspector on Right (Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Central Graph Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewFormat("graph")}
                  className={`px-3 py-1.5 rounded-xl text-label-sm font-semibold transition ${
                    viewFormat === "graph"
                      ? "bg-academic-primary text-white shadow-sm"
                      : "bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300"
                  }`}
                >
                  Interactive Graph
                </button>
                <button
                  type="button"
                  onClick={() => setViewFormat("outline")}
                  className={`px-3 py-1.5 rounded-xl text-label-sm font-semibold transition ${
                    viewFormat === "outline"
                      ? "bg-academic-primary text-white shadow-sm"
                      : "bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300"
                  }`}
                >
                  Tree Outline
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert("Add custom node modal opened.")}
                  className="px-3 py-1.5 bg-academic-primary text-white text-label-sm font-semibold rounded-xl hover:bg-academic-primary-hover flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Node</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert("Nodes auto-aligned by prerequisite topological sort.")}
                  className="px-3 py-1.5 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-200 text-label-sm font-semibold rounded-xl"
                >
                  Auto-Align
                </button>
              </div>
            </div>

            {/* Visual Node Chain */}
            <div className="space-y-3 pt-2">
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isMastered = node.status === "mastered";
                const isActive = node.status === "active";
                const isNext = node.status === "next_up";
                const isLocked = node.status === "locked";
                const isElective = node.isElective;

                return (
                  <div
                    key={node.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedNodeId(node.id)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedNodeId(node.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected ? "ring-2 ring-academic-primary " : ""
                    }${
                      isActive
                        ? "bg-blue-50/90 dark:bg-blue-950/60 border-academic-primary shadow-structural"
                        : isMastered
                        ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60"
                        : isElective
                        ? "bg-amber-50/40 dark:bg-amber-950/20 border-dashed border-amber-300 dark:border-amber-800"
                        : "bg-academic-slate-50 dark:bg-academic-slate-900 border-academic-slate-200 dark:border-academic-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-label-md">
                        {isMastered ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            ✓
                          </div>
                        ) : isActive ? (
                          <div className="w-7 h-7 rounded-full bg-academic-primary text-white flex items-center justify-center">
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </div>
                        ) : isLocked ? (
                          <div className="w-7 h-7 rounded-full bg-academic-slate-300 text-academic-slate-700 dark:bg-academic-slate-700 dark:text-academic-slate-400 flex items-center justify-center">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-academic-slate-400 text-academic-slate-600 flex items-center justify-center">
                            {node.number}
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                            {node.number}. {node.title}
                          </h4>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-600 text-white tracking-wider">
                              CURRENT ACTIVE TARGET
                            </span>
                          )}
                          {isElective && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                              ELECTIVE BRANCH
                            </span>
                          )}
                        </div>
                        <div className="text-body-sm text-academic-slate-500 flex items-center gap-2">
                          <span>{node.loggedTime}</span>
                          <span>&bull;</span>
                          <span>{node.subtext}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-label-sm font-semibold">
                      {isMastered && <span className="text-emerald-600">Mastered</span>}
                      {isActive && <span className="text-blue-600 font-bold">In Progress</span>}
                      {isNext && <span className="text-amber-600">Next Up</span>}
                      {isLocked && <span className="text-academic-slate-400">Locked</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-label-sm text-academic-slate-400 flex items-center justify-between border-t border-academic-slate-200 dark:border-academic-slate-700">
              <span>Drag any node to reprioritize. Dependencies will adaptively redraw without data loss.</span>
              <span className="font-mono text-academic-slate-500">Alt + Arrow: Navigate &bull; M: Move</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Target Inspector & Embedded AI Study Assistant (Screenshot 1) */}
        <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-5">
          <div className="space-y-2 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Unit 3 of 14
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Core Specialization
              </span>
            </div>
            <h3 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
              Consensus &amp; Raft Algorithm
            </h3>
          </div>

          {/* Why This Node is Suggested Here */}
          <div className="p-4 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 space-y-1.5 text-body-sm">
            <div className="text-label-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Why This Node is Suggested Here</span>
            </div>
            <p className="text-academic-slate-700 dark:text-academic-slate-300">
              B.Tech Sem 4 core pillar for semester distributed storage project &amp; prerequisite for cloud lab. Calibrated for your 10 hrs/week study budget (Estimated completion: 3 days remaining).
            </p>
          </div>

          {/* Low Data Video Player (Screenshot 1) */}
          <div className="bg-academic-slate-950 rounded-2xl p-4 border border-academic-slate-800 text-white space-y-3">
            <div className="flex items-center justify-between text-label-sm">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Video className="w-4 h-4" />
                <span>240p Low Data (42 MB)</span>
              </span>
              <span className="font-mono text-academic-slate-400">18:40</span>
            </div>
            <div className="h-28 bg-black/60 rounded-xl flex items-center justify-center border border-academic-slate-800 relative">
              <Play className="w-10 h-10 text-white/90 hover:scale-110 transition-transform cursor-pointer" />
            </div>
            <div className="flex items-center justify-between text-label-sm text-academic-slate-400">
              <span>High efficiency VP9 codec (65% less data)</span>
              <button
                type="button"
                onClick={() => alert("Video downloaded for 100% offline study.")}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Save Offline (42 MB)
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => alert("Marked as Mastered!")}
              className="flex-1 min-h-touch py-2.5 bg-academic-primary text-white text-label-sm font-semibold rounded-xl hover:bg-academic-primary-hover shadow-sm transition"
            >
              Mark as Mastered
            </button>
            <button
              type="button"
              onClick={() => alert("Note drawer opened.")}
              className="px-4 py-2.5 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-200 text-label-sm font-semibold rounded-xl"
            >
              Add Note
            </button>
            <button
              type="button"
              onClick={() => alert("Node editor opened.")}
              className="px-4 py-2.5 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-200 text-label-sm font-semibold rounded-xl"
            >
              Edit Node
            </button>
          </div>

          {/* Ask AI to Explain (Grounded in Open Textbooks) */}
          <div className="bg-academic-slate-50 dark:bg-academic-slate-900 p-4 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-bold text-academic-slate-800 dark:text-academic-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Ask AI to Explain</span>
              </span>
              <span className="text-label-sm text-academic-slate-400">Grounded in Open Textbooks</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleAskAi("Leader election simplified?")}
                className="px-2.5 py-1 rounded-lg text-label-sm bg-white dark:bg-academic-slate-800 border border-academic-slate-200 dark:border-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300 hover:bg-academic-slate-100"
              >
                Leader election simplified?
              </button>
              <button
                type="button"
                onClick={() => handleAskAi("Raft vs Paxos comparison")}
                className="px-2.5 py-1 rounded-lg text-label-sm bg-white dark:bg-academic-slate-800 border border-academic-slate-200 dark:border-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300 hover:bg-academic-slate-100"
              >
                Raft vs Paxos comparison
              </button>
              <button
                type="button"
                onClick={() => handleAskAi("3 viva exam practice Qs")}
                className="px-2.5 py-1 rounded-lg text-label-sm bg-white dark:bg-academic-slate-800 border border-academic-slate-200 dark:border-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300 hover:bg-academic-slate-100"
              >
                3 viva exam practice Qs
              </button>
            </div>

            {aiResponse && (
              <div className="p-3.5 bg-white dark:bg-academic-slate-800 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 text-body-sm text-academic-slate-800 dark:text-academic-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-label-sm text-academic-slate-400">
                  <span className="font-semibold text-purple-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Generated Summary
                  </span>
                  <span>Node 3 Context</span>
                </div>
                <p className="leading-relaxed whitespace-pre-line">{aiResponse}</p>

                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 text-label-sm text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Verify Before You Trust:</strong> Tanenbaum &amp; Van Steen, <em>Distributed Systems: Principles and Paradigms</em>, Chapter 8.2 (Consensus Algorithms).
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAi();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask a doubt on Raft Algorithm..."
                className="flex-1 px-3 py-2 text-body-sm bg-white dark:bg-academic-slate-800 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 text-academic-slate-900 dark:text-academic-slate-100 focus-visible:ring-2 focus-visible:ring-academic-primary"
              />
              <button
                type="submit"
                className="p-2 bg-academic-primary text-white rounded-xl hover:bg-academic-primary-hover shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* System Resilience & Pacing States (Screenshot 1 Footer) */}
      <section className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 md:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-4">
        <div className="flex items-center justify-between border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
          <div>
            <h4 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-academic-primary" />
              <span>System Resilience &amp; Pacing States</span>
            </h4>
            <p className="text-body-sm text-academic-slate-500">
              Live Field Diagnostics &amp; Edge Fallbacks across varied devices.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-body-sm">
          {/* 1. Pacing Synthesis */}
          <div className="p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900 border border-academic-slate-200 dark:border-academic-slate-700 space-y-2">
            <div className="text-label-sm font-bold text-blue-700 dark:text-blue-400 uppercase">
              1. Pacing Synthesis &bull;
            </div>
            <p className="text-academic-slate-600 dark:text-academic-slate-400 text-label-sm">
              Synthesizing pacing roadmap from weekly 10h schedule...
            </p>
          </div>

          {/* 2. Blank Canvas */}
          <div className="p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900 border border-academic-slate-200 dark:border-academic-slate-700 space-y-2">
            <div className="text-label-sm font-bold text-amber-700 dark:text-amber-400 uppercase">
              2. Blank Canvas
            </div>
            <p className="text-academic-slate-600 dark:text-academic-slate-400 text-label-sm">
              No custom milestones placed. Pick university preset.
            </p>
            <button
              type="button"
              onClick={() => alert("Default syllabus imported.")}
              className="text-label-sm font-semibold text-academic-primary hover:underline block pt-1"
            >
              Import Default Syllabus &rarr;
            </button>
          </div>

          {/* 3. Sync Fault */}
          <div className="p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900 border border-academic-slate-200 dark:border-academic-slate-700 space-y-2">
            <div className="text-label-sm font-bold text-rose-700 dark:text-rose-400 uppercase">
              3. Sync Fault
            </div>
            <p className="text-academic-slate-600 dark:text-academic-slate-400 text-label-sm">
              Unable to reach central cloud node. Local draft safely stored.
            </p>
            <button
              type="button"
              onClick={() => alert("Sync retried successfully.")}
              className="text-label-sm font-semibold text-rose-600 hover:underline block pt-1"
            >
              Retry Sync &rarr;
            </button>
          </div>

          {/* 4. Offline Mode */}
          <div className="p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900 border border-academic-slate-200 dark:border-academic-slate-700 space-y-2">
            <div className="text-label-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase">
              4. Offline Mode
            </div>
            <p className="text-academic-slate-600 dark:text-academic-slate-400 text-label-sm">
              14 video notes &amp; Raft algorithm animations cached locally.
            </p>
            <div className="flex gap-2 text-label-sm font-bold text-emerald-600">
              <span>48 MB Saved</span>
              <span>100% Ready</span>
            </div>
          </div>

          {/* 5. Track Mastery */}
          <div className="p-4 rounded-2xl bg-academic-slate-50 dark:bg-academic-slate-900 border border-academic-slate-200 dark:border-academic-slate-700 space-y-2">
            <div className="text-label-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase">
              5. Track Mastery
            </div>
            <p className="text-academic-slate-600 dark:text-academic-slate-400 text-label-sm">
              All 14 distributed systems modules mastered.
            </p>
            <button
              type="button"
              onClick={() => alert("Certificate generated.")}
              className="w-full py-1.5 bg-indigo-600 text-white rounded-xl text-label-sm font-semibold hover:bg-indigo-700 shadow-sm"
            >
              Get Certificate
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
