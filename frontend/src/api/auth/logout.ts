import { buildAuthHeaders, jwtPostProcess, TOKEN_STATE } from "../jwt/compatible_token_manager";
import { AUTH_OPTIONS, getApiRoute } from "../utils/api_routes";

export interface LogoutResponse {
  message: string;
}

export async function logoutUser(): Promise<LogoutResponse> {
  try {
    const response = await fetch(getApiRoute(AUTH_OPTIONS.AUTH_LOGOUT), {
      method: "POST",
      headers: buildAuthHeaders({
        "Content-Type": "application/json",
      }),
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
