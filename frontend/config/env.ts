import dotenv from "dotenv";
import fs from "fs";
import path from "path";

export type EnvVars = {
  API_PORT: number;
  WEB_PORT: number;
  PROJECT_MODE: string;
  DEPLOY_TARGET: string;
  WLAN_IP: string;
  API_WEB_HOST: string;
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
  const webPort: number = rawEnv.VITE_WEB_PORT ? parseInt(rawEnv.VITE_WEB_PORT, 10) : 5173;
  const projectMode = rawEnv.VITE_PROJECT_MODE || "DEV";
  const deployTarget = rawEnv.VITE_DEPLOY_TARGET || "EMULATOR";
  const wlanIp = rawEnv.VITE_WLAN_IP || "127.0.0.1";
  const apiWebHost = (projectMode === "DEV") ? "localhost" : wlanIp;

  return {
    API_PORT: apiPort,
    WEB_PORT: webPort,
    PROJECT_MODE: projectMode,
    DEPLOY_TARGET: deployTarget,
    WLAN_IP: wlanIp,
    API_WEB_HOST: apiWebHost,
  };
}

export const smartride_env = getEnv();
