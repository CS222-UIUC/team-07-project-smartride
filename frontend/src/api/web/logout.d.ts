export interface LogoutResponse {
    message: string;
}
export declare function logoutUser(): Promise<LogoutResponse>;
