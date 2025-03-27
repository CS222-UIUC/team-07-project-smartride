// logout.ts
export interface LogoutResponse {
  message: string;
}

export async function logoutUser(): Promise<LogoutResponse> {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data: LogoutResponse = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Logout failed");
  }
}
