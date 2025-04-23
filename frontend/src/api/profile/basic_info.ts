import { buildAuthHeaders } from "../jwt/compatible_token_manager";
import { getApiRoute, PROFILE_OPTIONS } from "../utils/api_routes";
import { BasicInfoType } from "@/types/UserProfile";

// Fetch user profile data from backend
export async function fetchUserProfile(): Promise<BasicInfoType> {
  const res = await fetch(getApiRoute(PROFILE_OPTIONS.PROFILE_BASIC_INFO), {
    method: "GET",
    credentials: "include",
    headers: buildAuthHeaders({}),
  });
  const result = (await res.json()) as {
    success: boolean;
    data: BasicInfoType;
  };
  if (result.success) {
    return result.data;
  }
  throw new Error("Failed to fetch user profile");
}

// Update user profile data (including map_route)
export async function updateUserProfile(
  profile: BasicInfoType,
): Promise<BasicInfoType> {
  const res = await fetch(getApiRoute(PROFILE_OPTIONS.PROFILE_BASIC_INFO), {
    method: "PUT",
    credentials: "include",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(profile),
  });
  const result = (await res.json()) as {
    success: boolean;
    data: BasicInfoType;
  };
  if (result.success) {
    return result.data;
  }
  throw new Error("Failed to update user profile");
}
