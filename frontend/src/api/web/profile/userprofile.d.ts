export interface UserProfile {
    name: string;
    email: string;
    nickname?: string;
    height?: number;
    weight?: number;
    age?: number;
    map_route?: string;
}
export declare function fetchUserProfile(): Promise<UserProfile>;
export declare function updateUserProfile(profile: UserProfile): Promise<UserProfile>;
