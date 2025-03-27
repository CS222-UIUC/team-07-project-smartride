import { useCallback, useEffect, useState, useMemo } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/profile", { credentials: "include" });
      setIsLoggedIn(res.ok);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const contextValue = useMemo(
    () => ({ isLoggedIn, loading: isLoggedIn === null, refresh }),
    [isLoggedIn, refresh]
  );

  return <AuthContext value={contextValue}>{children}</AuthContext>;
};
