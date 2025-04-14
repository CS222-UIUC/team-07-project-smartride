import { use } from "react";
import { AuthContext, AuthContextType } from "./AuthContext.tsx";

export const useAuth = (): AuthContextType => {
  return use(AuthContext);
};
