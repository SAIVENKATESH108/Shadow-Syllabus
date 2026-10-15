import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Globe,
  Home,
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
  const location = useLocation();
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

  // Compute dynamic breadcrumbs from path
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getBreadcrumbLabel = (segment: string): string => {
    switch (segment) {
      case "dashboard":
        return "Dashboard";
      case "syllabus":
        return "Shadow Syllabus";
      case "planner":
        return "Study Planner";
      case "research":
        return "Multi-Agent Research";
      case "profile":
        return "Student Profile";
      case "privacy":
        return "Privacy Centre";
      default:
        return segment.length > 12 ? `${segment.slice(0, 10)}...` : segment;
    }
  };

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
    <header className="bg-white dark:bg-academic-slate-800 border-b border-academic-slate-200 dark:border-academic-slate-700 h-16 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-sm sticky top-0 z-30">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-xl text-academic-slate-600 dark:text-academic-slate-300 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 focus-visible:ring-2 focus-visible:ring-academic-primary"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex items-center gap-1.5 text-label-sm font-medium text-academic-slate-500 dark:text-academic-slate-400 truncate">
            <li>
              <Link
                to="/dashboard"
                className="hover:text-academic-primary dark:hover:text-white transition flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="sr-only">Dashboard Home</span>
              </Link>
            </li>
            {pathnames.map((segment, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              const label = getBreadcrumbLabel(segment);

              return (
                <li key={routeTo} className="flex items-center gap-1.5 truncate">
                  <ChevronRight className="w-3.5 h-3.5 text-academic-slate-400 flex-shrink-0" aria-hidden="true" />
                  {isLast ? (
                    <span
                      aria-current="page"
                      className="font-bold text-academic-slate-900 dark:text-academic-slate-50 truncate"
                    >
                      {label}
                    </span>
                  ) : (
                    <Link
                      to={routeTo}
                      className="hover:text-academic-primary dark:hover:text-white transition truncate"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Right: Controls & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Legal Disclaimer Pill */}
        <div
          title="Designed to support GDPR and India’s DPDP Act requirements; formal legal review is pending."
          className="hidden xl:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 truncate max-w-xs"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">GDPR &amp; DPDP Support (Legal Review Pending)</span>
        </div>

        {/* High Contrast Toggle */}
        <button
          type="button"
          onClick={toggleHighContrast}
          className={`min-h-touch px-2.5 py-1.5 rounded-xl border text-label-sm font-semibold transition hidden sm:inline-flex items-center gap-1 ${
            highContrast
              ? "bg-academic-slate-900 text-white dark:bg-white dark:text-academic-slate-900 border-transparent shadow-sm"
              : "bg-academic-slate-50 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-200 border-academic-slate-200 dark:border-academic-slate-600 hover:bg-academic-slate-100"
          }`}
          aria-label="Toggle High Contrast Mode"
        >
          <span className="font-bold">A</span>
          <span className="text-[10px]">Contrast</span>
        </button>

        {/* Language Switcher */}
        <button
          type="button"
          onClick={handleLanguageToggle}
          className="min-h-touch px-2.5 py-1.5 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 bg-academic-slate-50 dark:bg-academic-slate-700 text-label-sm font-semibold hover:bg-academic-slate-100 dark:hover:bg-academic-slate-600 transition flex items-center gap-1"
          aria-label="Switch Language"
        >
          <Globe className="w-4 h-4 text-academic-primary" aria-hidden="true" />
          <span>{locale === "en" ? "हिन्दी" : "English"}</span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="min-h-touch p-2 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 bg-academic-slate-50 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-200 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-600 transition"
          aria-label="Toggle Color Theme"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
          )}
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 transition focus-visible:ring-2 focus-visible:ring-academic-primary"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
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
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-label-md text-academic-slate-700 dark:text-academic-slate-300 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 transition"
              >
                <UserIcon className="w-4 h-4 text-academic-primary" />
                <span>Student Profile</span>
              </Link>

              <Link
                to="/dashboard/privacy"
                role="menuitem"
                onClick={() => setIsUserMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-label-md text-academic-slate-700 dark:text-academic-slate-300 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700 transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privacy &amp; Data Rights</span>
              </Link>

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-label-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition mt-1"
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
