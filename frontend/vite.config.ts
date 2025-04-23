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
  // no need to pass WEB_PORT and API_WEB_HOST to the client
  define: {
    __API_PORT__: JSON.stringify(smartride_env.API_PORT),
    __PROJECT_MODE__: JSON.stringify(smartride_env.PROJECT_MODE),
    __DEPLOY_TARGET__: JSON.stringify(smartride_env.DEPLOY_TARGET),
    __WLAN_IP__: JSON.stringify(smartride_env.WLAN_IP),
  },
  server: {
    host: true,
    allowedHosts: true,
    port: smartride_env.WEB_PORT,
    proxy: {
      "/api": {
        target: `http://${smartride_env.API_WEB_HOST}:${smartride_env.API_PORT.toString()}`,
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
