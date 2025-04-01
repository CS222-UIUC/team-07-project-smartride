import { useEffect, useState } from "react";

export async function checkLoginStatus(): Promise<boolean> {
  try {
    const res = await fetch("/api/profile", { credentials: "include" });
    const contentType = res.headers.get("content-type") || "";
    return res.ok && contentType.includes("application/json");
  } catch {
    return false;
  }
}

export function useAuthCheck() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkLoginStatus()
      .then(setIsLoggedIn)
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  return isLoggedIn;
}
