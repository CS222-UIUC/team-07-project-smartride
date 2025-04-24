import { AUTH_OPTIONS, getApiRoute } from "../utils/api_routes";

export interface RegisterResponse {
  message: string;
  user?: string;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  try {
    const url = getApiRoute(AUTH_OPTIONS.AUTH_REGISTER);
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ name, email, password }),
    });
    const data = (await response.json()) as RegisterResponse;
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Register failed");
  }
}
