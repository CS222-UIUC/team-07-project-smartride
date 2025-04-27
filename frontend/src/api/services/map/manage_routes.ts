import { toast } from "sonner";
import { buildAuthHeaders } from "@/api/core/jwt/compatible_token_manager";
import { getApiRoute, MAP_OPTIONS } from "@/api/api_routes";
import { MapGetRouteResponse, MapGetRoutesInfoResponse } from "@/types/ApiResponses";
import { Route } from "@/types/MapRoute";

// TODO: We need to combine the interfaces, probably moving everything to src/types/MapStructure.ts?

export async function getRouteById(id: number): Promise<Route> {
  try {
    const url = `${getApiRoute(MAP_OPTIONS.MAP_GET_ROUTE_BY_ID)}?id=${id.toString()}`;
    const headers = buildAuthHeaders({});
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: headers,
    });
    const result = (await response.json()) as MapGetRouteResponse;
    if (result.success && result.data) {
      return result.data;
    } else {
      const errorMessage = result.message || "Failed to fetch route";
      toast.info(errorMessage);
      throw new Error(errorMessage);
    }
    } catch (error) {
    const errorMessage = "Error fetching route: " + String(error);
    toast.info(errorMessage);
    throw new Error(errorMessage);
  }
}

export async function getRoutesInfo(): Promise<Route[]> {
  try {
    const url = getApiRoute(MAP_OPTIONS.MAP_GET_ROUTES_INFO);
    const headers = buildAuthHeaders({});
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: headers,
    });
    const result = (await response.json()) as MapGetRoutesInfoResponse;
    if (result.success) {
      return result.data ?? [];
    } else {
      return [];
    }
  } catch (error) {
    toast.info("Error fetching routes: " + String(error));
    return [];
  }
}

export async function createOrUpdateRoute(
  routeId: number,
  routeName: string,
  routeData: object,
): Promise<Route> {
  try {
    const body = { id: routeId, route_name: routeName, route_data: routeData };
    const url = getApiRoute(MAP_OPTIONS.MAP_SET_ROUTE);
    const headers = buildAuthHeaders({
      "Content-Type": "application/json",
    });
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: headers,
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as MapGetRouteResponse;
    if (result.success && result.data) {
      return result.data;
    } else {
      const errorMessage = result.message || "Failed to upload or update route";
      toast.info(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage = "Error uploading route: " + String(error);
    toast.info(errorMessage);
    throw new Error(errorMessage);
  }
}
