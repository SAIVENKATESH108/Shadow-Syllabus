import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
        return;
      }
      if (e.key === "Tab" && isOpen && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      // Automatically focus the close button when opened
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
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
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close Navigation"
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-academic-slate-500 hover:text-academic-slate-900 dark:hover:text-white bg-academic-slate-100 dark:bg-academic-slate-700 transition flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <DashboardSidebar onNavClick={onClose} />
      </div>
    </div>
  );
};
