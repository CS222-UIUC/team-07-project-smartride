import { toast } from "sonner";
import { buildAuthHeaders } from "../jwt/compatible_token_manager";
// import { getApiRoute, MAP_OPTIONS } from "../utils/api_routes";
import type { Point, RouteSegment } from "@/maps/manage/structure";

// TODO: Identified Issue, When there is a broken route uploaded to backend, getSavedRoutes() will break entirely.
// TODO: Add a getSavedRoute(route_id) to compensate, and then getSavedRoutes() may remove data? requirements.
export interface Route {
  id: number;
  route_name: string;
  route_data?: string | { points: Point[]; segments: RouteSegment[] };
}

export async function getSavedRoutes(): Promise<Route[]> {
  try {
    // const url = getApiRoute(MAP_OPTIONS.MAP_GET_ROUTES);
    const url = "http://10.0.2.2:5050/api/map/manage/get_routes";
    const headers = buildAuthHeaders({});
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: headers,
    });
    const result = (await response.json()) as {
      success: boolean;
      data?: Route[];
      message?: string;
    };
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
): Promise<Route | null> {
  try {
    const body = { id: routeId, route_name: routeName, route_data: routeData };
    // const url = getApiRoute(MAP_OPTIONS.MAP_SET_ROUTE);
    const url = "http://10.0.2.2:5050/api/map/manage/set_route";
    const headers = buildAuthHeaders({"Content-Type": "application/json",});
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: headers,
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as {
      success: boolean;
      data?: Route;
      error?: string;
    };
    if (result.success) {
      return result.data ?? null;
    } else {
      console.log(result);
      return null;
    }
  } catch (error) {
    console.error("Error saving route", error);
    return null;
  }
}
