import { use } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
  return use(AuthContext);
};
