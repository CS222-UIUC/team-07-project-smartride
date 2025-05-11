import { buildAuthHeaders } from "@/api/core/jwt/compatible_token_manager";
import { getApiRoute, PROFILE_OPTIONS } from "@/api/api_routes";
import { BasicInfoType } from "@/types/UserProfile";
import { BasicInfoResponse } from "@/types/ApiResponses";

// Fetch user profile data from backend
export async function fetchUserProfile(): Promise<BasicInfoType> {
  const url = getApiRoute(PROFILE_OPTIONS.PROFILE_BASIC_INFO);
  const headers = buildAuthHeaders({});
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: headers,
  });
  const result = (await res.json()) as BasicInfoResponse;
  if (result.success) {
    return result.data;
  }
  throw new Error("Failed to fetch user profile");
}

// Update user profile data (including map_route)
export async function updateUserProfile(
  profile: BasicInfoType,
): Promise<BasicInfoType> {
  const url = getApiRoute(PROFILE_OPTIONS.PROFILE_BASIC_INFO);
  const headers = buildAuthHeaders({
    "Content-Type": "application/json",
  });
  const res = await fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: headers,
    body: JSON.stringify(profile),
  });
  const result = (await res.json()) as BasicInfoResponse;
  if (result.success) {
    return result.data;
  }
  throw new Error("Failed to update user profile");
}
