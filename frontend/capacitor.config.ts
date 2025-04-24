import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.app.smartride",
  appName: "smartride",
  webDir: "dist",
  android: { allowMixedContent: true, webContentsDebuggingEnabled: true },
};

export default config;
