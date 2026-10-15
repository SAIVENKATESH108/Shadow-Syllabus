import React, { Suspense } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Globe,
  GraduationCap,
  LogIn,
  Moon,
  ShieldCheck,
  Sun,
  UserPlus,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useTranslation } from "react-i18next";
import { PageSkeleton } from "./PageSkeleton";
import { RouteErrorBoundary } from "./RouteErrorBoundary";

export const PublicLayout: React.FC = () => {
  const { theme, toggleTheme, locale, setLocale, highContrast } = useUIStore();
  const { t, i18n } = useTranslation();

  const handleLanguageToggle = () => {
    const nextLocale = locale === "en" ? "hi" : "en";
    setLocale(nextLocale);
    i18n.changeLanguage(nextLocale);
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-academic-slate-50 dark:bg-academic-slate-900 text-academic-slate-900 dark:text-academic-slate-50 transition-colors ${
        highContrast ? "contrast-125" : ""
      }`}
    >
      {/* Public Header */}
      <header className="bg-white/95 dark:bg-academic-slate-800/95 backdrop-blur-md border-b border-academic-slate-200 dark:border-academic-slate-700 py-3.5 px-4 sm:px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-academic-primary rounded-xl"
          >
            <div className="bg-academic-primary text-white p-2.5 rounded-xl shadow-structural flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50 tracking-tight">
                  {t("app.title", "Siksha OpenLearn")}
                </span>
                <span className="hidden sm:inline-block text-label-sm text-academic-slate-500 font-sans">
                  मुक्त शिक्षा
                </span>
              </div>
              <p className="text-[11px] text-academic-slate-500 dark:text-academic-slate-400">
                Accessible Student Learning Platform
              </p>
            </div>
          </Link>

          {/* Public Nav Links */}
          <nav aria-label="Public Navigation" className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-label-md font-semibold transition ${
                  isActive
                    ? "text-academic-primary bg-academic-primary/10 dark:text-white dark:bg-academic-primary/20"
                    : "text-academic-slate-700 dark:text-academic-slate-300 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700/60"
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/syllabus"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-label-md font-semibold transition ${
                  isActive
                    ? "text-academic-primary bg-academic-primary/10 dark:text-white dark:bg-academic-primary/20"
                    : "text-academic-slate-700 dark:text-academic-slate-300 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700/60"
                }`
              }
            >
              Syllabus Preview
            </NavLink>
            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-label-md font-semibold transition ${
                  isActive
                    ? "text-academic-primary bg-academic-primary/10 dark:text-white dark:bg-academic-primary/20"
                    : "text-academic-slate-700 dark:text-academic-slate-300 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700/60"
                }`
              }
            >
              Privacy &amp; Rights
            </NavLink>
          </nav>

          {/* Controls & Auth CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={handleLanguageToggle}
              className="p-2 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 text-label-sm font-semibold hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 transition"
              aria-label="Switch Language"
            >
              <Globe className="w-4 h-4 text-academic-primary" aria-hidden="true" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-200 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 transition"
              aria-label="Toggle Color Theme"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              )}
            </button>

            {/* Auth Buttons */}
            <Link
              to="/signin"
              className="min-h-touch px-3.5 py-2 rounded-xl text-label-md font-semibold text-academic-slate-700 dark:text-academic-slate-200 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 transition flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>

            <Link
              to="/signup"
              className="min-h-touch px-4 py-2 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Public Outlet */}
      <main className="flex-1">
        <RouteErrorBoundary>
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </RouteErrorBoundary>
      </main>

      {/* Compliant Public Footer */}
      <footer className="border-t border-academic-slate-200 dark:border-academic-slate-700 bg-white dark:bg-academic-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-body-sm font-semibold text-academic-slate-800 dark:text-academic-slate-200">
                Designed to support GDPR and India’s DPDP Act requirements; formal legal review is pending.
              </span>
            </div>
            <div className="flex items-center gap-4 text-label-sm text-academic-slate-600 dark:text-academic-slate-400">
              <Link to="/privacy" className="hover:text-academic-primary">
                Privacy Policy
              </Link>
              <span>&bull;</span>
              <Link to="/syllabus" className="hover:text-academic-primary">
                Curriculum Preview
              </Link>
              <span>&bull;</span>
              <Link to="/signin" className="hover:text-academic-primary">
                Student Sign In
              </Link>
            </div>
          </div>
          <div className="text-[12px] text-academic-slate-500 text-center md:text-left">
            Short excerpts are used with attribution. Licensing and permissible-use terms require legal review before public release.
          </div>
        </div>
      </footer>
    </div>
  );
};
