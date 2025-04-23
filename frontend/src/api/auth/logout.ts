// import { toast } from "sonner";
import {
  buildAuthHeaders,
  jwtPostProcess,
  TOKEN_STATE,
} from "../jwt/compatible_token_manager";
// import { AUTH_OPTIONS, getApiRoute } from "../utils/api_routes";

export interface LogoutResponse {
  message: string;
}

export async function logoutUser(): Promise<LogoutResponse> {
  try {
    // const url = getApiRoute(AUTH_OPTIONS.AUTH_LOGOUT);
    const url = "http://10.0.2.2:5050/api/mob/auth/logout";
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
