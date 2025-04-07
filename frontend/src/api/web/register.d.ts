export interface RegisterResponse {
    message: string;
    user?: string;
}
export declare function registerUser(name: string, email: string, password: string): Promise<RegisterResponse>;
