import { API_ROUTES } from "../utils/route_dictionary";

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
    const response = await fetch(API_ROUTES.WEB_REGISTER, {
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
