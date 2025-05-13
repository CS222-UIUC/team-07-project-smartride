import { useEffect, useState } from "react";
import { AUTH_OPTIONS, getApiRoute } from "@/api/api_routes";
import { buildAuthHeaders } from "@/api/core/jwt/compatible_token_manager";
import { toast } from "sonner";

export async function checkLoginStatus(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = 5000; // milliseconds

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const url = getApiRoute(AUTH_OPTIONS.AUTH_STATUS);
    const headers = buildAuthHeaders({});
    const response = await fetch(url, {
      credentials: "include",
      headers: headers,
      signal: controller.signal,
    });

    clearTimeout(timer);

    const contentType = response.headers.get("content-type") || "";
    if (!(response.ok && contentType.includes("application/json")))
      return false;

    const result = (await response.json()) as { success: boolean };
    return result.success;
  } catch (err: unknown) {
    if ((err as Error).name === "AbortError") {
      toast.info("Login status check timed out.");
    } else {
      toast.info("Unexpected Error during status check: " + String(err));
    }
    return false;
  }
}

export function useAuthCheck() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkLoginStatus()
      .then(setIsLoggedIn)
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  return isLoggedIn;
}
