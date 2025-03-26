// components/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface AuthContextType {
  isLoggedIn: boolean | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: null,
  loading: true,
  refresh: async () => {},
});

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
      refresh();
    }, [refresh]);
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, loading: isLoggedIn === null, refresh }}>
        {children}
      </AuthContext.Provider>
    );
  };
  

export const useAuth = () => useContext(AuthContext);
