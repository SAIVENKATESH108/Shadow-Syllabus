import React, { useState } from "react";
import { UnverifiedBadge } from "./UnverifiedBadge";
import { BookOpen, HelpCircle, Send, ShieldAlert } from "lucide-react";

interface AIResponse {
  content: string;
  is_unverified: boolean;
  model_name: string;
  confidence_score?: number;
}

export const StudyCoach: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    // Simulates call through ai_gateway
    setTimeout(() => {
      setResponse({
        content:
          "To understand this concept, let's break it down into core steps:\n1. Identify the fundamental formula or rule governing this topic.\n2. Note any constraints or given variables.\n3. Consider how changing one variable affects the outcome.\n\nWhat is your initial thought on how to proceed?",
        is_unverified: true,
        model_name: "ai-gateway-pedagogical-coach-v1",
        confidence_score: 0.94,
      });
      setLoading(false);
    }, 400);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-800">Study Coach & Guided Inquiry</h2>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 mb-4 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
        <p>
          <strong>Privacy Notice:</strong> Do not enter personal details (e.g. your full name, email, or phone number).
          The Study Coach provides guidance and hints to help you learn; it will not write completed homework solutions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-700 mb-1">
            What concept or problem would you like guidance on?
          </label>
          <textarea
            id="prompt-input"
            rows={3}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g. I need help understanding how photosynthesis produces oxygen..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          <Send className="w-4 h-4" />
          {loading ? "Thinking..." : "Ask Coach"}
        </button>
      </form>

      {response && (
        <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Model: {response.model_name}
            </span>
            <UnverifiedBadge />
          </div>

          <div className="bg-amber-50/40 rounded-lg p-4 border border-amber-200 text-sm text-slate-800 whitespace-pre-line">
            {response.content}
          </div>

          <p className="text-xs text-slate-400 italic">
            AI feedback is intended as educational guidance, not an absolute evaluation. Check original learning materials.
          </p>
        </div>
      )}
    </div>
  );
};
