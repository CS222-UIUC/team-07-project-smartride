import { API_ROUTES } from "../utils/route_dictionary";

export interface LoginResponse {
  message: string;
  user?: string;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const response = await fetch(API_ROUTES.WEB_LOGIN, {
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
    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Login failed");
  }
}
