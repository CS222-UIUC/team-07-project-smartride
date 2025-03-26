import { createContext, useContext } from "react";
import { useAuthCheck } from "./../../authentication/auth";

interface AuthContextType {
  isLoggedIn: boolean | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: null,
  loading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAuthCheck();

  const loading = isLoggedIn === null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
