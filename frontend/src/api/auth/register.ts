// import { AUTH_OPTIONS, getApiRoute } from "../utils/api_routes";

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
    // const url = getApiRoute(AUTH_OPTIONS.AUTH_REGISTER);
    const url = "http://10.0.2.2:5050/api/mob/auth/register";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
