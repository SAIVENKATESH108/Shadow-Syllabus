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
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-academic-slate-800 border-r border-academic-slate-200 dark:border-academic-slate-700 flex flex-col h-full shadow-structural">
      {/* Brand Header */}
      <div className="p-4 border-b border-academic-slate-200 dark:border-academic-slate-700 h-16 flex items-center">
        <NavLink
          to="/dashboard"
          onClick={onNavClick}
          className="min-h-[44px] flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary rounded-xl p-1"
        >
          <div className="bg-academic-primary text-white p-2 rounded-xl shadow-structural flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <GraduationCap className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-body-md font-bold text-academic-slate-900 dark:text-academic-slate-50 tracking-tight truncate">
              {t("app.title", "Siksha OpenLearn")}
            </div>
            <p className="text-[11px] text-academic-slate-500 dark:text-academic-slate-400 truncate">
              Student Workspace &bull; CS-204
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Landmark */}
      <nav aria-label="Main Navigation" className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavClick}
            className={({ isActive }) =>
              `min-h-[44px] px-3 py-2 rounded-xl flex items-center justify-between transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary ${
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
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive
                        ? "text-white"
                        : "text-academic-slate-500 dark:text-academic-slate-400 group-hover:text-academic-primary dark:group-hover:text-white"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="truncate text-left">
                    <div className="text-label-md truncate">{item.label}</div>
                    <div
                      className={`text-[10px] truncate ${
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
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${
                    isActive ? "text-white translate-x-0.5" : "text-academic-slate-400 opacity-0 group-hover:opacity-100"
                  }`}
                  aria-hidden="true"
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Target Info Footer Box */}
      <div className="p-3 border-t border-academic-slate-200 dark:border-academic-slate-700 bg-academic-slate-50 dark:bg-academic-slate-900/50">
        <div className="p-2.5 bg-academic-primary/10 dark:bg-academic-primary/20 rounded-xl border border-academic-primary/20 text-[11px] space-y-0.5">
          <div className="font-bold text-academic-primary dark:text-academic-slate-200">
            Active Study Target
          </div>
          <div className="text-academic-slate-700 dark:text-academic-slate-300 truncate">
            DU Distributed Systems &bull; May 2024
          </div>
        </div>
      </div>
    </aside>
  );
};
