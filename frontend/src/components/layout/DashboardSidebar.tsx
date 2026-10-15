import React from "react";
import { NavLink } from "react-router-dom";
import {
  Compass,
  GraduationCap,
  LayoutDashboard,
  Shield,
  Sparkles,
  User,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface DashboardSidebarProps {
  onNavClick?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ onNavClick }) => {
  const { t } = useTranslation();

  const navLinks = [
    {
      to: "/dashboard",
      end: true,
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Quick stats & active syllabus",
    },
    {
      to: "/dashboard/syllabus",
      end: true,
      label: "Shadow Syllabus",
      icon: Compass,
      description: "Recency heatmap & ranking",
    },
    {
      to: "/dashboard/syllabus/planner",
      end: false,
      label: "Study Planner",
      icon: CalendarCheck,
      description: "0/1 Knapsack time budget",
    },
    {
      to: "/dashboard/research",
      end: false,
      label: "Multi-Agent Research",
      icon: Sparkles,
      description: "Synthesis & fact checking",
    },
    {
      to: "/dashboard/profile",
      end: false,
      label: "Student Profile",
      icon: User,
      description: "Academic & study preferences",
    },
    {
      to: "/dashboard/privacy",
      end: false,
      label: "Privacy Centre",
      icon: Shield,
      description: "Data sovereignty & rights",
    },
  ];

  return (
    <aside className="w-72 flex-shrink-0 bg-white dark:bg-academic-slate-800 border-r border-academic-slate-200 dark:border-academic-slate-700 flex flex-col h-full shadow-structural">
      {/* Brand Header */}
      <div className="p-5 border-b border-academic-slate-200 dark:border-academic-slate-700">
        <NavLink
          to="/dashboard"
          onClick={onNavClick}
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-academic-primary rounded-xl"
        >
          <div className="bg-academic-primary text-white p-2.5 rounded-xl shadow-structural flex items-center justify-center group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50 tracking-tight">
              {t("app.title", "Siksha OpenLearn")}
            </div>
            <p className="text-[11px] text-academic-slate-500 dark:text-academic-slate-400">
              Student Workspace &bull; CS-204
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Landmark */}
      <nav aria-label="Main Navigation" className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavClick}
            className={({ isActive }) =>
              `min-h-touch px-3.5 py-3 rounded-2xl flex items-center justify-between transition-all group ${
                isActive
                  ? "bg-academic-primary text-white shadow-structural font-semibold"
                  : "text-academic-slate-700 dark:text-academic-slate-300 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-700/60 font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive
                        ? "text-white"
                        : "text-academic-slate-500 dark:text-academic-slate-400 group-hover:text-academic-primary dark:group-hover:text-white"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="truncate text-left">
                    <div className="text-body-md truncate">{item.label}</div>
                    <div
                      className={`text-[11px] truncate ${
                        isActive
                          ? "text-white/80"
                          : "text-academic-slate-400 dark:text-academic-slate-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    isActive ? "text-white translate-x-0.5" : "text-academic-slate-400 opacity-0 group-hover:opacity-100"
                  }`}
                  aria-hidden="true"
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-academic-slate-200 dark:border-academic-slate-700 bg-academic-slate-50 dark:bg-academic-slate-900/50">
        <div className="p-3 bg-academic-primary/10 dark:bg-academic-primary/20 rounded-2xl border border-academic-primary/20 text-label-sm space-y-1">
          <div className="font-bold text-academic-primary dark:text-academic-slate-200">
            Active Study Target
          </div>
          <div className="text-academic-slate-700 dark:text-academic-slate-300">
            DU Distributed Systems &bull; May 2024
          </div>
        </div>
      </div>
    </aside>
  );
};
