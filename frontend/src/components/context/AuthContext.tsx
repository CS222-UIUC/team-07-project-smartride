import { createContext } from "react";

export interface AuthContextType {
  isLoggedIn: boolean | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: null,
  loading: true,
  refresh: async () => {},
});
