import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Lock, Mail, User, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import { useUIStore } from "../../store/uiStore";

export const SignUpPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdult, setIsAdult] = useState(true);
  const [consentTelemetry, setConsentTelemetry] = useState(false);
  const [consentResearchHistory, setConsentResearchHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useUIStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      login(email);
      navigate("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-lg w-full bg-white dark:bg-academic-slate-800 rounded-3xl p-6 sm:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-academic-primary text-white flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50">
            Create Student Account
          </h1>
          <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Zero third-party tracking &bull; Sovereign student data control
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-body-sm flex items-start gap-2.5"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="signup-name"
              className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-academic-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="signup-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md focus:ring-2 focus:ring-academic-primary outline-none transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-academic-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md focus:ring-2 focus:ring-academic-primary outline-none transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1"
            >
              Password (min. 8 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-academic-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="signup-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md focus:ring-2 focus:ring-academic-primary outline-none transition"
              />
            </div>
          </div>

          {/* Age Verification Bracket */}
          <div className="p-3.5 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 space-y-2">
            <span className="text-label-sm font-semibold text-academic-slate-800 dark:text-academic-slate-200">
              Age Verification
            </span>
            <div className="flex items-center gap-4 text-body-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ageBracket"
                  checked={isAdult}
                  onChange={() => setIsAdult(true)}
                  className="text-academic-primary focus:ring-academic-primary"
                />
                <span>18 years or older</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ageBracket"
                  checked={!isAdult}
                  onChange={() => setIsAdult(false)}
                  className="text-academic-primary focus:ring-academic-primary"
                />
                <span>Under 18 (Minor student)</span>
              </label>
            </div>
            {!isAdult && (
              <p className="text-[12px] text-academic-slate-500 italic">
                Minor accounts receive enhanced data protection defaults in accordance with India DPDP Act Sec 9.
              </p>
            )}
          </div>

          {/* Unticked Granular Consent Toggles */}
          <div className="space-y-2 pt-1 text-label-sm text-academic-slate-600 dark:text-academic-slate-400">
            <div className="text-[11px] font-bold text-academic-slate-400 uppercase tracking-wider">
              Optional Privacy Preferences (Unticked by Default)
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentTelemetry}
                onChange={(e) => setConsentTelemetry(e.target.checked)}
                className="mt-0.5 rounded border-academic-slate-300 text-academic-primary focus:ring-academic-primary"
              />
              <span>Allow anonymous syllabus query performance telemetry</span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentResearchHistory}
                onChange={(e) => setConsentResearchHistory(e.target.checked)}
                className="mt-0.5 rounded border-academic-slate-300 text-academic-primary focus:ring-academic-primary"
              />
              <span>Retain research report drafts across sessions (stored in local database)</span>
            </label>
          </div>

          {/* Non-assertive Legal Disclaimer */}
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-2 text-[11px] text-emerald-900 dark:text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              Designed to support GDPR and India’s DPDP Act requirements; formal legal review is pending. Privacy requests are handled according to the platform’s published retention and escalation policy.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-touch py-3 px-4 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Creating account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold text-academic-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
