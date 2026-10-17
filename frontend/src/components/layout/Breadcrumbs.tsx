import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface RouteMeta {
  label: string;
}

const ROUTE_LABELS: Record<string, RouteMeta> = {
  dashboard: { label: "Dashboard" },
  syllabus: { label: "Shadow Syllabus" },
  planner: { label: "Study Planner" },
  "study-coach": { label: "AI Study Coach" },
  research: { label: "Multi-Agent Research" },
  profile: { label: "Student Profile" },
  privacy: { label: "Privacy Centre" },
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1 text-label-sm font-medium text-academic-slate-500 dark:text-academic-slate-400">
        <li>
          <Link
            to="/dashboard"
            className="min-h-[44px] min-w-[44px] hover:text-academic-primary dark:hover:text-white transition inline-flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary rounded-xl"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Dashboard Home</span>
          </Link>
        </li>

        {segments.map((segment, index) => {
          const routeTo = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const meta = ROUTE_LABELS[segment];
          const label = meta ? meta.label : segment.length > 16 ? `${segment.slice(0, 14)}...` : segment;

          return (
            <li key={routeTo} className="inline-flex items-center gap-1 min-w-0">
              <ChevronRight className="w-3.5 h-3.5 text-academic-slate-400 flex-shrink-0" aria-hidden="true" />
              {isLast ? (
                <span
                  aria-current="page"
                  className="min-h-[44px] inline-flex items-center px-2 font-bold text-academic-slate-900 dark:text-academic-slate-50 truncate"
                >
                  {label}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="min-h-[44px] px-2 hover:text-academic-primary dark:hover:text-white transition inline-flex items-center truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary rounded-xl"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
