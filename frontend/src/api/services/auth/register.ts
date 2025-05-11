import { AUTH_OPTIONS, getApiRoute } from "@/api/api_routes";
import { RegisterResponse } from "@/types/ApiResponses";

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
