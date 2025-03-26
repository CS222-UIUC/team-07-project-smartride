import { useEffect, useState } from "react";

export function useAuthCheck() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  
    useEffect(() => {
      fetch("/api/profile", { credentials: "include" })
        .then(async res => {
          const contentType = res.headers.get("Content-Type") || "";
          const isJson = contentType.includes("application/json");
          if (res.ok && isJson) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        })
        .catch(() => setIsLoggedIn(false));
    }, []);
  
    return isLoggedIn;
  }
  