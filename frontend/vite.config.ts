import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { Capacitor } from "@capacitor/core";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  type EnvVars = {
    API_PORT?: string;
    DEV_PORT?: string;
    PROJECT_MODE?: string;
    DEPLOY_TARGET?: string;
    WLAN_IP?: string;
  };

  const rawEnv = loadEnv(mode, path.resolve(__dirname, ".."));
  const env: EnvVars = {
    API_PORT: rawEnv.VITE_API_PORT,
    DEV_PORT: rawEnv.VITE_DEV_PORT,
    PROJECT_MODE: rawEnv.VITE_PROJECT_MODE,
    DEPLOY_TARGET: rawEnv.VITE_DEPLOY_TARGET,
    WLAN_IP: rawEnv.VITE_WLAN_IP,
  };

  const apiPort: string = env.API_PORT || "5000";
  const devPort: number = parseInt(env.DEV_PORT || "5173");
  let apiHost: string = "127.0.0.1";
  if (env.PROJECT_MODE === "BUILD") {
    if (
      Capacitor.getPlatform() === "android" &&
      env.DEPLOY_TARGET === "EMULATOR"
    ) {
      apiHost = "10.0.2.2";
    } else {
      apiHost = env.WLAN_IP || "127.0.0.1";
    }
  }
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
          target: `http://${apiHost}:${apiPort}`,
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
