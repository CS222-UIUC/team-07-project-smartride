// import { toast } from "sonner";
// TODO: Capacitor.getPlatform() will move to runtime, i.e. here, and we will change logic accordingly
declare const __PLATFORM__: string;
// declare const __API_HOST__: string;
// declare const __DEPLOY_TARGET__: string;

export const PLATFORM = __PLATFORM__; // e.g., "BUILD-android"

export function isDev(): boolean {
  // toast.info("[PLATFORM] PLATFORM == " + __PLATFORM__ + "\n" +
  //           "[PLATFORM] API_HOST == " + __API_HOST__ + "\n" +
  //           "[PLATFORM] DEPLOY_TARGET == " + __DEPLOY_TARGET__);
  return PLATFORM.startsWith("DEV");
}

export function isBuild(): boolean {
  return PLATFORM.startsWith("BUILD");
}

export function isWeb(): boolean {
  return PLATFORM.endsWith("web");
}

export function isAndroid(): boolean {
  return PLATFORM.endsWith("android");
}

export function isIOS(): boolean {
  return PLATFORM.endsWith("ios");
}

export function getPlatform(): "web" | "android" | "ios" | "unknown" {
  if (isWeb()) return "web";
  if (isAndroid()) return "android";
  if (isIOS()) return "ios";
  return "unknown";
}

export function getProjectMode(): "DEV" | "BUILD" | "UNKNOWN" {
  if (isDev()) return "DEV";
  if (isBuild()) return "BUILD";
  return "UNKNOWN";
}
