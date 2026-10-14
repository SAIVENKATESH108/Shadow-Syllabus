import React from "react";
import { StudyCoach } from "./components/StudyCoach";
import { GraduationCap, ShieldCheck } from "lucide-react";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Open Learning Platform</h1>
              <p className="text-xs text-slate-500">Secure Modular Monolith Architecture</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            <span>GDPR & DPDP Compliant</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8">
        <div className="mb-8 text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Empowering Student Discovery</h2>
          <p className="text-sm text-slate-600">
            An open-source, minor-safe educational platform with pedagogical AI guidance, strict object-level permissions, and verifiable data governance.
          </p>
        </div>

        <StudyCoach />
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>Open Student Learning Platform &bull; Appendix A.3 Security Baseline Applied</p>
      </footer>
    </div>
  );
};

export default App;
