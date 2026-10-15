/// <reference types="vitest" />
import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { transformCspHtml } from "./src/utils/csp";

export function cspPlugin(mode: string, apiBaseUrl?: string): Plugin {
  return {
    name: "html-csp-transform",
    transformIndexHtml(html: string) {
      return transformCspHtml(html, mode, apiBaseUrl);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), cspPlugin(mode, env.VITE_API_BASE_URL)],
    server: {
      port: 5173,
      host: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router")
            ) {
              return "vendor-react";
            }
            if (id.includes("node_modules/@tanstack/react-query")) {
              return "vendor-query";
            }
            if (id.includes("node_modules/lucide-react")) {
              return "vendor-icons";
            }
            if (id.includes("node_modules/i18next") || id.includes("node_modules/react-i18next")) {
              return "vendor-i18n";
            }
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
    },
  };
});
