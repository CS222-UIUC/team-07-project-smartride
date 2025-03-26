import { useEffect, useState } from "react";

export function useAuthCheck() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  
    useEffect(() => {
      fetch("/api/profile", { credentials: "include" })
        .then(async res => {
          const contentType = res.headers.get("content-type") || "unknown";
          console.log("📡 /api/profile res.status =", res.status, "contentType =", contentType);
          if (res.ok && contentType.includes("application/json")) {
            await res.json();
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
        });
    }, []);
  
    return isLoggedIn;
  }
  