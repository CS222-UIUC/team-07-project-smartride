// login.ts
export interface LoginResponse {
    message: string;
    user?: string;
  }
  
  export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data: LoginResponse = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data;
    } catch (error) {
      throw new Error((error as Error).message || "Login failed");
    }
  }
  