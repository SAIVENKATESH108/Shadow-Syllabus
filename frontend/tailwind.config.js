/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          primary: {
            DEFAULT: "#1D4ED8",
            hover: "#1E40AF",
            light: "#DBEAFE",
            dark: "#3B82F6",
          },
          secondary: {
            DEFAULT: "#B45309",
            hover: "#92400E",
            light: "#FEF3C7",
            dark: "#D97706",
          },
          tertiary: {
            DEFAULT: "#059669",
            hover: "#047857",
            light: "#D1FAE5",
            dark: "#10B981",
          },
          danger: {
            DEFAULT: "#DC2626",
            hover: "#B91C1C",
            light: "#FEE2E2",
            dark: "#EF4444",
          },
          slate: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A",
          },
        },
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        "display-lg": ["2rem", { lineHeight: "2.75rem", letterSpacing: "-0.02em" }],
        "headline-lg": ["1.5rem", { lineHeight: "2.125rem", letterSpacing: "-0.01em" }],
        "headline-md": ["1.125rem", { lineHeight: "1.75rem" }],
        "headline-sm": ["1rem", { lineHeight: "1.5rem" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "body-md": ["1rem", { lineHeight: "1.625rem" }],
        "body-sm": ["0.875rem", { lineHeight: "1.375rem" }],
        "label-lg": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "600" }],
        "label-md": ["0.75rem", { lineHeight: "1.125rem", fontWeight: "600" }],
        "label-sm": ["0.6875rem", { lineHeight: "1rem", fontWeight: "600" }],
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
      boxShadow: {
        structural: "0 1px 3px 0 rgba(15, 23, 42, 0.08)",
        "structural-elevated": "0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};
