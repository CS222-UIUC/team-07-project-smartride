export interface AuthContextType {
    isLoggedIn: boolean | null;
    loading: boolean;
    refresh: () => Promise<void>;
}
export declare const AuthContext: import("react").Context<AuthContextType>;
