import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  type EnvVars = {
    API_PORT?: string;
    DEV_PORT?: string;
  };

  const rawEnv = loadEnv(mode, path.resolve(__dirname, ".."));
  const env: EnvVars = {
    API_PORT: rawEnv.VITE_API_PORT,
    DEV_PORT: rawEnv.VITE_DEV_PORT,
  };

  const apiPort: string = env.API_PORT || "5000";
  const devPort: number = parseInt(env.DEV_PORT || "5173");

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      allowedHosts: true,
      port: devPort,
      proxy: {
        "/api": {
          target: `http://127.0.0.1:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/setupTests.ts",
    },
  };
});
