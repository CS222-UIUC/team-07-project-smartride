import dotenv from "dotenv";
import fs from "fs";
import path from "path";
// import { Capacitor } from "@capacitor/core";

export type EnvVars = {
  API_PORT: number;
  DEV_PORT: number;
  PROJECT_MODE: string;
  DEPLOY_TARGET: string;
  WLAN_IP: string;
};

function getEnv(): EnvVars {
  const envAutoPath = path.resolve(__dirname, "../../.env.auto");
  const envLocalPath = path.resolve(__dirname, "../../.env.local");

  const envAuto = fs.existsSync(envAutoPath)
    ? dotenv.parse(fs.readFileSync(envAutoPath))
    : {};
  const envLocal = fs.existsSync(envLocalPath)
    ? dotenv.parse(fs.readFileSync(envLocalPath))
    : {};

  const rawEnv = {
    ...envAuto,
    ...envLocal,
  };

  const apiPort: number = rawEnv.VITE_API_PORT ? parseInt(rawEnv.VITE_API_PORT, 10) : 5000;
  const devPort: number = rawEnv.VITE_DEV_PORT ? parseInt(rawEnv.VITE_DEV_PORT, 10) : 5173;
  const projectMode = rawEnv.VITE_PROJECT_MODE || "DEV";
  const deployTarget = rawEnv.VITE_DEPLOY_TARGET || "EMULATOR";
  const wlanIp = rawEnv.VITE_WLAN_IP || "127.0.0.1";

  return {
    API_PORT: apiPort,
    DEV_PORT: devPort,
    PROJECT_MODE: projectMode,
    DEPLOY_TARGET: deployTarget,
    WLAN_IP: wlanIp,
  };
}

export const smartride_env = getEnv();
