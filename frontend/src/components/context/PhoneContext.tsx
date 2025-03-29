import { createContext, use } from "react";

export const PhoneContext = createContext<boolean>(true); // Flag to determine if the user is on a phone
export const useIsPhone = () => use(PhoneContext); // Hook to access the phone flag
