// TODO (Richard): Use your userprofile in ProfilePage

import { API_ROUTES } from "../../utils/route_dictionary";

export interface UserProfile {
  name: string;
  email: string;
  nickname?: string;
  height?: number;
  weight?: number;
  age?: number;
  map_route?: string;
}

// Fetch user profile data from backend
export async function fetchUserProfile(): Promise<UserProfile> {
  const res = await fetch(API_ROUTES.WEB_PROFILE, {
    method: "GET",
    credentials: "include",
  });
  const result = (await res.json()) as { success: boolean; data: UserProfile };
  if (result.success) {
    return result.data;
  }
  throw new Error("Failed to fetch user profile");
}

// Update user profile data (including map_route)
export async function updateUserProfile(
  profile: UserProfile,
): Promise<UserProfile> {
  const res = await fetch(API_ROUTES.WEB_PROFILE, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });
  const result = (await res.json()) as { success: boolean; data: UserProfile };
  if (result.success) {
    return result.data;
  }
  throw new Error("Failed to update user profile");
}
