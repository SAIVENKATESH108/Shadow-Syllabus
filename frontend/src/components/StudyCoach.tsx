import React, { useState } from "react";
import { UnverifiedBadge } from "./UnverifiedBadge";
import {
  AlertTriangle,
  Bookmark,
  BookOpen,
  Copy,
  Download,
  FileText,
  Filter,
  Flag,
  Mic,
  Paperclip,
  Radio,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  confidence?: number;
  isEpistemicLimit?: boolean;
  citations?: { id: number; title: string; ref: string }[];
}

export const StudyCoach: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [activeCitation, setActiveCitation] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "user",
      text: "Can you explain the difference between Lamport timestamps and Vector Clocks in distributed systems? Specifically why Lamport clocks cannot detect concurrent events?",
      timestamp: "10:41 AM &bull; Student (CS-204)",
    },
    {
      id: "msg-2",
      sender: "ai",
      text: `The core distinction lies in whether the clock mechanism establishes a **partial causal ordering** or an **exact causal characterization** of event concurrency across isolated nodes.

### 1. The Fundamental Lamport Clock Limitation
Lamport's algorithm satisfies the *Clock Condition*: If an event $a$ happens before $b$ ($a \\to b$), then the scalar timestamp must satisfy:
$$\\mathbf{C(a) < C(b)}$$

Crucially, the *converse is not true*. If $C(a) < C(b)$, you **cannot** conclude that $a \\to b$. The two events might be completely concurrent ($a \\parallel b$), possessing arbitrarily ordered scalar values due to local processor increment rates [1].

**DISTRIBUTED EVENT COMPARISON (Synthesized from Lecture Diagrams):**
• **Lamport Scalars (Partial Order):** Single integer per process. Total ordering achieved solely via tie-breaking PID. *Incapable of detecting concurrency ($a \\parallel b$)*.
• **Vector Clocks (Causal Order):** Vector of size $N$ (# of processes). Captures global causal dependency. *Detects concurrency when neither vector dominates [2]*.`,
      timestamp: "Synthesized via Offline Index in 240ms &bull; CS-204 Module 3",
      confidence: 94,
      citations: [
        { id: 1, title: "Tanenbaum & Van Steen, Sec 6.2, p. 248", ref: "Distributed Systems: Principles and Paradigms (3rd Ed), Ch. 6: Synchronization" },
        { id: 2, title: "CS-204 Mid-Term 2019, Question 3(b)", ref: "University Board Archived Question Bank" },
        { id: 3, title: "Lamport (1978) CACM Vol. 21, p. 560", ref: "Time, Clocks, and the Ordering of Events in a Distributed System" },
      ],
    },
    {
      id: "msg-3",
      sender: "user",
      text: "Is Professor Ramanathan's internal exam grading key for question 4 leaked anywhere in these papers? Can you share the marking scheme?",
      timestamp: "10:44 AM &bull; Student (CS-204)",
    },
    {
      id: "msg-4",
      sender: "ai",
      text: `**I cannot provide internal examination answer keys or unpublished staff materials.**

Siksha OpenLearn strictly indexes open-access textbooks, statutorily archived previous university question papers, and licensed lecture notes. Internal college grading keys, confidential faculty notes, or leaked test items are strictly excluded from our neural repository to preserve academic integrity.

**APPROVED CURRICULUM GUIDANCE:**
However, based on standard University Board Evaluation Criteria for Dynamic Programming & Synchronization questions, examiners award credit using this verified rubric:
• **40% Formulation:** Accurate state variables & recurrence definition
• **30% Proof / Trace:** Boundary cases, base matrix conditions
• **30% Complexity:** Strict asymptotic time & space proofs`,
      timestamp: "Siksha Epistemic Limit &bull; Zero Proprietary Data Indexed",
      isEpistemicLimit: true,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: "Just now &bull; Student Query",
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentPrompt = prompt;
    setPrompt("");

    setTimeout(() => {
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Regarding **"${currentPrompt}"**, here is the verified syllabus grounding:\n\n1. **Core Invariant:** Grounded in prescribed university reference curricula.\n2. **Formal Verification:** Cross-checked against syllabus benchmarks.\n\nWould you like to step through the proof boundary conditions?`,
        timestamp: "Synthesized via Campus Mesh Node in 210ms",
        confidence: 95,
        citations: [
          { id: 1, title: "University Approved Academic Syllabus", ref: "CS-204 Core Principles" },
        ],
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 450);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stitch Top Scope Bar (Stitch e3f481e82f7547188fe9300f0d3eece4) */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-5 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-100">
              Study Coach &amp; Guided Inquiry
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              AI Academic Assistant &bull; Grounded strictly in Open Curricula
            </span>
          </div>
          <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Ai Tutor (Offline) &bull; CS-204 Past Papers &amp; Book Sources &bull; Synthesized from validated past papers, OpenStax textbooks, and university lecture archives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <UnverifiedBadge />
          <span className="px-2.5 py-1 rounded-xl text-label-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <span>Low-Bandwidth (2G/3G) Active</span>
          </span>
        </div>
      </div>

      {/* Grounding Scope & Privacy Guard Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-label-sm">
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-3 text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span>
            <strong>GROUNDING SCOPE:</strong> Tanenbaum Distributed Systems (Sec 6.2) &bull; CS-204 Past Papers (2018–2023)
          </span>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-2xl p-3 text-blue-900 dark:text-blue-200 flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <span>
            <strong>Privacy Guard:</strong> Never enter Aadhaar/Roll IDs, phone numbers, or unreleased question papers.
          </span>
        </div>
      </div>

      {/* Main 2-Column Desktop Grid matching Stitch e3f481e82f7547188fe9300f0d3eece4 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chat Workspace */}
        <div className="xl:col-span-8 bg-white dark:bg-academic-slate-800 rounded-3xl p-6 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-6">
          {/* Chat Messages Stream */}
          <div className="space-y-5 max-h-[640px] overflow-y-auto pr-2">
            {messages.map((msg) => {
              if (msg.sender === "user") {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-2xl bg-academic-primary text-white p-4 md:p-5 rounded-3xl rounded-tr-md space-y-2 shadow-sm">
                      <p className="text-body-md font-medium leading-relaxed">{msg.text}</p>
                      <div
                        className="text-[11px] text-blue-100 flex items-center justify-end gap-1.5"
                        dangerouslySetInnerHTML={{ __html: msg.timestamp }}
                      />
                    </div>
                  </div>
                );
              }

              // AI Epistemic Limit Guardrail Box
              if (msg.isEpistemicLimit) {
                return (
                  <div key={msg.id} className="flex justify-start">
                    <div className="max-w-2xl bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-3xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-800/80 pb-3">
                        <div className="flex items-center gap-2 text-label-md font-bold text-amber-900 dark:text-amber-200">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                          <span>Epistemic Limit &bull; Ethical Guardrail Triggered</span>
                        </div>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                          Zero Proprietary Data Indexed
                        </span>
                      </div>

                      <div className="text-body-md text-amber-950 dark:text-amber-100 space-y-3 leading-relaxed">
                        <p>
                          <strong>I cannot provide internal examination answer keys or unpublished staff materials.</strong>
                        </p>
                        <p className="text-body-sm text-amber-900 dark:text-amber-200">
                          Siksha OpenLearn only indexes open-access textbooks, statutorily archived previous university question papers, and licensed lecture notes. Internal college grading keys, confidential faculty notes, or leaked test items are strictly excluded from our neural repository to preserve academic integrity.
                        </p>
                      </div>

                      {/* Approved Curriculum Guidance */}
                      <div className="bg-white dark:bg-academic-slate-900 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-3">
                        <div className="text-label-sm font-bold text-academic-slate-800 dark:text-academic-slate-200 uppercase tracking-wide">
                          Approved Curriculum Guidance &bull; University Evaluation Criteria
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-200 dark:border-amber-800">
                            <div className="text-headline-sm font-bold text-amber-800 dark:text-amber-300">40%</div>
                            <div className="text-label-sm font-semibold text-academic-slate-800 dark:text-academic-slate-200">Formulation</div>
                            <div className="text-[11px] text-academic-slate-500">State variables &amp; recurrence</div>
                          </div>
                          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-200 dark:border-amber-800">
                            <div className="text-headline-sm font-bold text-amber-800 dark:text-amber-300">30%</div>
                            <div className="text-label-sm font-semibold text-academic-slate-800 dark:text-academic-slate-200">Proof / Trace</div>
                            <div className="text-[11px] text-academic-slate-500">Boundary &amp; base conditions</div>
                          </div>
                          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-200 dark:border-amber-800">
                            <div className="text-headline-sm font-bold text-amber-800 dark:text-amber-300">30%</div>
                            <div className="text-label-sm font-semibold text-academic-slate-800 dark:text-academic-slate-200">Complexity</div>
                            <div className="text-[11px] text-academic-slate-500">Asymptotic time &amp; space</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-label-sm">
                        <button
                          type="button"
                          onClick={() => alert("Forwarded to verified academic peer network.")}
                          className="px-3.5 py-1.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition"
                        >
                          Ask a Verified Peer Reviewer
                        </button>
                        <button
                          type="button"
                          onClick={() => alert("Reported false positive to audit log.")}
                          className="text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
                        >
                          <Flag className="w-3.5 h-3.5" />
                          <span>Flag as false positive</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // Normal Grounded AI Response
              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="max-w-2xl bg-academic-slate-50 dark:bg-academic-slate-900 border border-academic-slate-200 dark:border-academic-slate-700 rounded-3xl p-5 space-y-4 shadow-sm">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {msg.confidence}% Grounded &bull; Open Textbook
                        </span>
                        <span className="text-[11px] text-academic-slate-500">
                          Verified against CS-204 Module 3
                        </span>
                      </div>
                      <span className="text-[11px] text-academic-slate-400">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* AI Response Text */}
                    <div className="text-body-md text-academic-slate-800 dark:text-academic-slate-200 space-y-3 leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Citations Box */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="bg-white dark:bg-academic-slate-800/80 p-4 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 space-y-2">
                        <div className="text-label-sm font-bold text-academic-slate-700 dark:text-academic-slate-300 uppercase tracking-wide">
                          Indexed References:
                        </div>
                        <div className="space-y-1.5">
                          {msg.citations.map((c) => (
                            <div
                              key={c.id}
                              onClick={() => setActiveCitation(c.id)}
                              className={`p-2 rounded-xl text-label-sm cursor-pointer transition flex items-center justify-between ${
                                activeCitation === c.id
                                  ? "bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200"
                                  : "hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700/50 text-academic-slate-700 dark:text-academic-slate-300"
                              }`}
                            >
                              <span>
                                <strong>[{c.id}]</strong> {c.title}
                              </span>
                              <span className="text-[11px] text-academic-slate-400">{c.ref}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-academic-slate-200 dark:border-academic-slate-700 text-label-sm text-academic-slate-500">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveCitation(1)}
                          className="px-3 py-1.5 bg-academic-primary text-white rounded-xl text-label-sm font-semibold hover:bg-academic-primary-hover transition flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Inspect Source [1]</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => alert("Report filed for academic review.")}
                          className="px-3 py-1.5 border border-academic-slate-300 dark:border-academic-slate-600 rounded-xl hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300 transition"
                        >
                          Report an Error
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => alert("Copied answer to clipboard.")}
                          className="p-1.5 hover:text-academic-slate-700 dark:hover:text-academic-slate-200"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => alert("Answer bookmarked for offline study.")}
                          className="p-1.5 hover:text-academic-slate-700 dark:hover:text-academic-slate-200"
                          title="Bookmark"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Confidence: 94% Semantic Match
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Live Streaming Indicator (Stitch Spec) */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2">
              <div className="flex items-center justify-between text-label-sm text-blue-700 dark:text-blue-300">
                <span className="flex items-center gap-2 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  Streaming response (Low-Bandwidth Mode &bull; 240 B/s)
                </span>
                <span className="text-[11px] text-blue-500">Synthesizing causal graph from Tanenbaum Fig 6.3...</span>
              </div>
              <p className="text-body-sm text-academic-slate-700 dark:text-academic-slate-300 italic">
                “Consider two independent processes P1 and P2 with no network message exchanges between them. Event e1 occurs on P1 at tick 3, while event e2 occurs on P2 at tick 4. Because no causal chain exists between P1 and P2, both events are strictly concurrent.”
              </p>
            </div>
          </div>

          {/* Query Bar */}
          <div className="border-t border-academic-slate-200 dark:border-academic-slate-700 pt-4 space-y-3">
            <div className="flex items-center justify-between text-label-sm text-academic-slate-500">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-PII Zone: Do not share student roll codes, phone numbers, or unreleased question papers.</span>
              </span>
              <span className="text-[11px]">Tokens remaining: 48,200 &bull; Free for Students</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask a question from your course papers or textbooks (e.g. 'Explain proof of Lemma 4 in CLRS Chapter 16')..."
                  className="w-full p-4 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-2xl border border-academic-slate-300 dark:border-academic-slate-600 text-body-md text-academic-slate-900 dark:text-academic-slate-100 focus-visible:ring-2 focus-visible:ring-academic-primary transition"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert("Scan question paper with camera or file upload.")}
                    className="px-3 py-1.5 bg-academic-slate-100 dark:bg-academic-slate-700 rounded-xl text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-200 hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex items-center gap-1.5"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attach Question Paper Scan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Filter applied to Module 3 (Distributed Systems).")}
                    className="px-3 py-1.5 bg-academic-slate-100 dark:bg-academic-slate-700 rounded-xl text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-200 hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex items-center gap-1.5"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter Syllabus Module</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Voice query active for Hindi/English.")}
                    className="px-3 py-1.5 bg-academic-slate-100 dark:bg-academic-slate-700 rounded-xl text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-200 hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex items-center gap-1.5"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Query (हिंदी / Eng)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-academic-slate-400 hidden sm:inline">Ctrl + Enter</span>
                  <button
                    type="submit"
                    disabled={!prompt.trim()}
                    className="min-h-touch px-5 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Ask Tutor</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Source Inspector (Stitch e3f481e82f7547188fe9300f0d3eece4) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-5">
            <div className="flex items-center justify-between border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-academic-primary" />
                <h3 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                  Source Inspector
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Citation [{activeCitation}] Active
              </span>
            </div>

            {/* Target Publication Details */}
            <div className="space-y-2">
              <div className="text-label-sm font-bold text-academic-slate-500 uppercase tracking-wider">
                Target Publication
              </div>
              <div className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-100">
                Distributed Systems: Principles and Paradigms (3rd Ed)
              </div>
              <div className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                Andrew S. Tanenbaum, Maarten van Steen &bull; Chapter 6: Synchronization
              </div>
            </div>

            {/* Page 248 Excerpt */}
            <div className="bg-academic-slate-50 dark:bg-academic-slate-900/80 p-4 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-academic-slate-400">
                <span>PAGE 248 EXCERPT</span>
                <span className="font-mono">Checksum: sha256:714a...</span>
              </div>
              <blockquote className="text-body-sm text-academic-slate-800 dark:text-academic-slate-200 italic leading-relaxed pl-3 border-l-2 border-academic-primary">
                &ldquo;...The problem with Lamport timestamps is that they satisfy only a partial order. Specifically, while the condition a &rarr; b implies C(a) &lt; C(b) holds, its contrapositive does not guarantee reverse causality. From C(a) &lt; C(b), we cannot conclude that event a happened before event b. The two events may be causally independent...&rdquo;
              </blockquote>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => alert("Opening PDF reader at Page 248 (Tanenbaum Ch. 6).")}
                className="w-full min-h-touch py-2.5 px-4 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open PDF at Page 248</span>
              </button>
              <button
                type="button"
                onClick={() => alert("Downloading verified offline proof snippet (180 KB).")}
                className="w-full min-h-touch py-2.5 px-4 bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-800 dark:text-academic-slate-200 font-semibold text-label-md rounded-xl hover:bg-academic-slate-200 dark:hover:bg-academic-slate-600 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Offline Proof Snippet (180 KB)</span>
              </button>
            </div>

            {/* Curriculum Health card */}
            <div className="pt-3 border-t border-academic-slate-200 dark:border-academic-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-label-sm font-semibold text-academic-slate-600 dark:text-academic-slate-400">
                  Curriculum Health
                </span>
                <span className="flex items-center gap-1.5 text-label-sm font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Syllabus Grounding Match: 98.2%
                </span>
              </div>
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-body-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Connected to Campus Mesh Node <strong>#BLR-SOUTH-04</strong>. Low latency mode active.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
