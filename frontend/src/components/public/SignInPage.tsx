import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useUIStore } from "../../store/uiStore";

export const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUIStore();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please provide a valid student or institutional email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      login(email);
      navigate(from, { replace: true });
    }, 400);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white dark:bg-academic-slate-800 rounded-3xl p-6 sm:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-academic-primary text-white flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50">
            Sign In to Siksha OpenLearn
          </h1>
          <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
            Access your personalized Shadow Syllabus and research workspace
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-body-sm flex items-start gap-2.5"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="signin-email"
              className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-academic-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md focus:ring-2 focus:ring-academic-primary focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signin-password"
              className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-academic-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md focus:ring-2 focus:ring-academic-primary focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-label-sm">
            <label className="flex items-center gap-2 cursor-pointer text-academic-slate-600 dark:text-academic-slate-400">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-academic-slate-300 text-academic-primary focus:ring-academic-primary"
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="text-academic-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-touch py-3 px-4 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-2 border-t border-academic-slate-200 dark:border-academic-slate-700 text-center">
          <button
            type="button"
            onClick={() => {
              login("student@delhi.ac.in");
              navigate(from, { replace: true });
            }}
            className="text-label-sm font-semibold text-academic-primary hover:underline"
          >
            Quick Demo Sign In as DU Distributed Systems Student
          </button>
        </div>

        {/* Link to Signup */}
        <div className="text-center text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
          Don’t have an account yet?{" "}
          <Link to="/signup" className="font-semibold text-academic-primary hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
