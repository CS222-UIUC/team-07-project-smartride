import { jwtPostProcess, TOKEN_STATE } from "../jwt/compatible_token_manager";
import { getApiRoute } from "../utils/api_routes";
import { AUTH_OPTIONS } from "../utils/api_routes";

export interface LoginResponse {
  message: string;
  user?: string;
  token?: string;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const response = await fetch(getApiRoute(AUTH_OPTIONS.AUTH_LOGIN), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = (await response.json()) as LoginResponse;
    if (!response.ok) {
      throw new Error(data.message);
    }
    jwtPostProcess(TOKEN_STATE.LOGIN, data.token);
    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Login failed");
  }
}
