declare const __PLATFORM__: string;

export const PLATFORM = __PLATFORM__; // e.g., "BUILD-android"

export function isDev(): boolean {
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
