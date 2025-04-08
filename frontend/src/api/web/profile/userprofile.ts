// TODO (Richard): Make Post Request to backend, /api/profile
// userprofile.ts

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
  const res = await fetch("/api/profile", {
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
  const res = await fetch("/api/profile", {
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
