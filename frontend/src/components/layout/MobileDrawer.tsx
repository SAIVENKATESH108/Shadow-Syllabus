import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 lg:hidden flex"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative flex-1 max-w-xs w-full bg-white dark:bg-academic-slate-800 shadow-2xl z-10 flex flex-col h-full animate-slideInRight"
      >
        <div className="absolute top-3 right-3 z-20">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Navigation"
            className="p-2 rounded-xl text-academic-slate-500 hover:text-academic-slate-900 dark:hover:text-white bg-academic-slate-100 dark:bg-academic-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <DashboardSidebar onNavClick={onClose} />
      </div>
    </div>
  );
};
