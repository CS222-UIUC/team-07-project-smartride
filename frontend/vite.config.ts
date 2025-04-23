import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { smartride_env } from "./config/env.ts";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react(), tailwindcss()],
  define: {
    __PLATFORM__: JSON.stringify(smartride_env.PLATFORM),
  },
  server: {
    host: true,
    allowedHosts: true,
    port: smartride_env.DEV_PORT,
    proxy: {
      "/api": {
        target: `http://${smartride_env.API_HOST}:${smartride_env.API_PORT.toString()}`,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    coverage: {
      reporter: ["html"],
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts", "src/setupTests.ts"],
      reportsDirectory: "./coverage",
    },
  }
});
