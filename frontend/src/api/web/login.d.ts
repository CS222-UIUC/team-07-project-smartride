export interface LoginResponse {
    message: string;
    user?: string;
}
export declare function loginUser(email: string, password: string): Promise<LoginResponse>;
