import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Globe,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  User as UserIcon,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useTranslation } from "react-i18next";

interface DashboardTopBarProps {
  onOpenMobileDrawer: () => void;
}

export const DashboardTopBar: React.FC<DashboardTopBarProps> = ({ onOpenMobileDrawer }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const {
    theme,
    toggleTheme,
    locale,
    setLocale,
    userProfile,
    logout,
    highContrast,
    toggleHighContrast,
  } = useUIStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const handleLanguageToggle = () => {
    const nextLocale = locale === "en" ? "hi" : "en";
    setLocale(nextLocale);
    i18n.changeLanguage(nextLocale);
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 z-20 bg-white/95 dark:bg-academic-slate-800/95 backdrop-blur-md border-b border-academic-slate-200 dark:border-academic-slate-700 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-sm">
      {/* Left: Mobile hamburger & Active Context */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          aria-label="Open navigation menu"
          className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-academic-slate-600 dark:text-academic-slate-300 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary flex items-center justify-center"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block text-label-sm font-semibold text-academic-slate-600 dark:text-academic-slate-300 truncate">
          <span className="text-academic-slate-400 dark:text-academic-slate-500 mr-1.5 font-normal">Syllabus:</span>
          Delhi University CS-204
        </div>
      </div>

      {/* Right: Controls & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Approved Non-Assertive Disclaimer Pill */}
        <div
          title="Designed to support GDPR and India’s DPDP Act requirements. Formal legal review is pending."
          className="hidden xl:flex items-center gap-1.5 text-[11px] font-semibold text-academic-primary dark:text-academic-slate-200 bg-academic-primary/10 dark:bg-academic-primary/20 px-3 py-1 rounded-full border border-academic-primary/20 truncate max-w-xs"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-academic-primary flex-shrink-0" aria-hidden="true" />
          <span className="truncate">GDPR &amp; DPDP Support (Review Pending)</span>
        </div>

        {/* High Contrast Toggle (WCAG 2.2 AA) */}
        <button
          type="button"
          onClick={toggleHighContrast}
          className={`min-h-[44px] px-3 py-2 rounded-xl border text-label-sm font-semibold transition hidden sm:inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary ${
            highContrast
              ? "bg-academic-slate-900 text-white dark:bg-white dark:text-academic-slate-900 border-transparent shadow-sm"
              : "bg-academic-slate-50 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-200 border-academic-slate-200 dark:border-academic-slate-600 hover:bg-academic-slate-100"
          }`}
          aria-label="Toggle High Contrast Mode"
        >
          <span className="font-bold">A</span>
          <span className="text-[11px]">Contrast</span>
        </button>

        {/* Language Switcher */}
        <button
          type="button"
          onClick={handleLanguageToggle}
          className="min-h-[44px] px-3 py-2 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 bg-academic-slate-50 dark:bg-academic-slate-700 text-label-sm font-semibold hover:bg-academic-slate-100 dark:hover:bg-academic-slate-600 transition flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
          aria-label="Switch Language"
        >
          <Globe className="w-4 h-4 text-academic-primary" aria-hidden="true" />
          <span>{locale === "en" ? "हिन्दी" : "English"}</span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 bg-academic-slate-50 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-200 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-600 transition flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
          aria-label="Toggle Color Theme"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
          )}
        </button>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="min-h-[44px] flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
            aria-label={`User account menu for ${userProfile?.username || "Student"}`}
          >
            <div className="w-8 h-8 rounded-full bg-academic-primary text-white flex items-center justify-center font-bold text-label-md">
              {userProfile?.username?.charAt(0).toUpperCase() || "S"}
            </div>
            <span className="hidden md:inline-block text-label-md font-semibold text-academic-slate-800 dark:text-academic-slate-200 truncate max-w-[120px]">
              {userProfile?.username || "Student"}
            </span>
          </button>

          {isUserMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-academic-slate-800 rounded-2xl shadow-xl border border-academic-slate-200 dark:border-academic-slate-700 p-2 z-50 animate-scaleUp"
            >
              <div className="px-3 py-2 border-b border-academic-slate-200 dark:border-academic-slate-700 mb-1">
                <div className="text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-50 truncate">
                  {userProfile?.username || "Student Learner"}
                </div>
                <div className="text-body-sm text-academic-slate-500 truncate">
                  {userProfile?.email || "student@siksha.edu"}
                </div>
              </div>

              <Link
                to="/dashboard/profile"
                role="menuitem"
                onClick={() => setIsUserMenuOpen(false)}
                className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-xl text-label-md text-academic-slate-700 dark:text-academic-slate-300 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
              >
                <UserIcon className="w-4 h-4 text-academic-primary" />
                <span>Student Profile</span>
              </Link>

              <Link
                to="/dashboard/privacy"
                role="menuitem"
                onClick={() => setIsUserMenuOpen(false)}
                className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-xl text-label-md text-academic-slate-700 dark:text-academic-slate-300 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privacy &amp; Data Rights</span>
              </Link>

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-xl text-label-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
