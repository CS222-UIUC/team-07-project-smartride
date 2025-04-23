import { useEffect, useState } from "react";
import { AUTH_OPTIONS, getApiRoute } from "../utils/api_routes";
import { buildAuthHeaders } from "../jwt/compatible_token_manager";

export async function checkLoginStatus(): Promise<boolean> {
  try {
    const res = await fetch(getApiRoute(AUTH_OPTIONS.AUTH_STATUS), { credentials: "include", headers: buildAuthHeaders({}), });
    const contentType = res.headers.get("content-type") || "";
    if (!(res.ok && contentType.includes("application/json"))) return false;
    const result = (await res.json()) as { success: boolean };
    return result.success;
  } catch {
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
