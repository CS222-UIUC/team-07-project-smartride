import { jwtPostProcess, TOKEN_STATE } from "../jwt/compatible_token_manager";
import { AUTH_OPTIONS, getApiRoute } from "../utils/api_routes";

export interface LoginResponse {
  message: string;
  // user?: string;
  data?: {
    token?: string;
  };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const url = getApiRoute(AUTH_OPTIONS.AUTH_LOGIN);
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = (await response.json()) as LoginResponse;
    if (!response.ok) {
      throw new Error(data.message);
    }
    jwtPostProcess(TOKEN_STATE.LOGIN, data.data?.token);
    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Login failed");
  }
}
