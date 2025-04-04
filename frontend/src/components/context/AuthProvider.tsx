import { useCallback, useEffect, useState, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { checkLoginStatus } from "@/api/web/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const refresh = useCallback(async () => {
    try {
      const ok = await checkLoginStatus();
      setIsLoggedIn(!!ok); // Ensure the value is a boolean
    } catch (error: unknown) {
      console.error("Failed to check login status:", error);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const contextValue = useMemo(
    () => ({ isLoggedIn, loading: isLoggedIn === null, refresh }),
    [isLoggedIn, refresh],
  );

  return <AuthContext value={contextValue}>{children}</AuthContext>;
};
