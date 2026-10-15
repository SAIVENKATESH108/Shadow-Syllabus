import { create } from "zustand";

export type ScreenType =
  | "overview"
  | "syllabus"
  | "roadmap"
  | "papers"
  | "research"
  | "coach"
  | "console"
  | "library"
  | "career"
  | "privacy";

interface UIState {
  theme: "light" | "dark";
  locale: "en" | "hi";
  activeScreen: ScreenType;
  isOnboardingOpen: boolean;
  lowBandwidthMode: boolean;
  highContrast: boolean;
  fontSizeScale: "normal" | "large" | "x-large";
  activeReportId: string | null;
  includeSuperseded: boolean;
  isAuthenticated: boolean;
  userProfile: { username: string; email?: string; isMinor: boolean; isGuest: boolean; role?: "student" | "guest" } | null;
  toggleTheme: () => void;
  setLocale: (locale: "en" | "hi") => void;
  setActiveScreen: (screen: ScreenType) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  toggleLowBandwidthMode: () => void;
  toggleHighContrast: () => void;
  setFontSizeScale: (scale: "normal" | "large" | "x-large") => void;
  setActiveReportId: (id: string | null) => void;
  setIncludeSuperseded: (include: boolean) => void;
  setUserProfile: (profile: { username: string; email?: string; isMinor: boolean; isGuest: boolean; role?: "student" | "guest" } | null) => void;
  login: (email?: string) => void;
  logout: () => void;
}

/**
 * Minimalist UI state store.
 * Master Plan Compliance:
 * Storing AI research report text, prompts, queries, or auth tokens in persistent storage
 * is strictly prohibited to guarantee privacy and security isolation.
 */
export const useUIStore = create<UIState>((set) => ({
  theme: "light",
  locale: "en",
  activeScreen: "overview",
  isOnboardingOpen: false,
  lowBandwidthMode: true,
  highContrast: false,
  fontSizeScale: "normal",
  activeReportId: null,
  includeSuperseded: false,
  isAuthenticated: false,
  userProfile: null,
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "light" ? "dark" : "light";
      if (typeof document !== "undefined") {
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return { theme: nextTheme };
    }),
  setLocale: (locale) => set({ locale }),
  setActiveScreen: (activeScreen) => set({ activeScreen }),
  setIsOnboardingOpen: (isOnboardingOpen) => set({ isOnboardingOpen }),
  toggleLowBandwidthMode: () => set((state) => ({ lowBandwidthMode: !state.lowBandwidthMode })),
  toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
  setFontSizeScale: (fontSizeScale) => set({ fontSizeScale }),
  setActiveReportId: (activeReportId) => set({ activeReportId }),
  setIncludeSuperseded: (includeSuperseded) => set({ includeSuperseded }),
  setUserProfile: (userProfile) => set({ userProfile }),
  login: (email = "student@siksha.edu") =>
    set({
      isAuthenticated: true,
      userProfile: { username: email.split("@")[0], email, isMinor: false, isGuest: false, role: "student" },
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      userProfile: null,
    }),
}));

