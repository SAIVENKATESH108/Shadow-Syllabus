import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useUIStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
