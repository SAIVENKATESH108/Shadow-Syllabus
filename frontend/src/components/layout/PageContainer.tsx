import React from "react";
import { Breadcrumbs } from "./Breadcrumbs";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
  showBreadcrumbs = true,
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {showBreadcrumbs && <Breadcrumbs />}
      {children}
    </div>
  );
};
