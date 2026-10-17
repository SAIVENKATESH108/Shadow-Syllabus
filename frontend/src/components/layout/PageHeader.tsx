import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
}) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-academic-slate-200 dark:border-academic-slate-700">
      <div className="space-y-1">
        <div className="flex items-center flex-wrap gap-2.5">
          <h1 className="text-headline-md font-bold text-academic-slate-900 dark:text-academic-slate-50 tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-400 max-w-3xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
    </header>
  );
};
