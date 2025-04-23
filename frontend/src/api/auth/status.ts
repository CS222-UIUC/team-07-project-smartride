import { useEffect, useState } from "react";
// import { AUTH_OPTIONS, getApiRoute } from "../utils/api_routes";
import { buildAuthHeaders } from "../jwt/compatible_token_manager";
import { toast } from "sonner";
// import { getToken } from "../jwt/raw_token_manager";

export async function checkLoginStatus(): Promise<boolean> {
  try {
    // const url = getApiRoute(AUTH_OPTIONS.AUTH_STATUS);
    const url = "http://10.0.2.2:5050/api/mob/profile/";
    // toast.info("[checkLoginStatus] token = "+String(getToken()));
    const headers = buildAuthHeaders({});
    const response = await fetch(url, {
      credentials: "include",
      headers: headers,
    });
    const contentType = response.headers.get("content-type") || "";
    if (!(response.ok && contentType.includes("application/json"))) return false;
    const result = (await response.json()) as { success: boolean };
    return result.success;
  } catch(err: unknown) {
    toast.info("checkLoginStatus() catch branch" + String(err));
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
