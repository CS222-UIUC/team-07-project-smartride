import {
  buildAuthHeaders,
  jwtPostProcess,
  TOKEN_STATE,
} from "@/api/core/jwt/compatible_token_manager";
import { AUTH_OPTIONS, getApiRoute } from "@/api/api_routes";
import { LogoutResponse } from "@/types/ApiResponses";

export async function logoutUser(): Promise<LogoutResponse> {
  try {
    const url = getApiRoute(AUTH_OPTIONS.AUTH_LOGOUT);
    const headers = buildAuthHeaders({
      "Content-Type": "application/json",
    });
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      credentials: "include",
    });
    const data = (await response.json()) as LogoutResponse;
    if (!response.ok) {
      throw new Error(data.message);
    }
    jwtPostProcess(TOKEN_STATE.LOGOUT);
    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Logout failed");
  }
}
