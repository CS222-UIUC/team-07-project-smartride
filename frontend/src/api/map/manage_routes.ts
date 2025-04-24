import { toast } from "sonner";
import { buildAuthHeaders } from "../jwt/compatible_token_manager";
import { getApiRoute, MAP_OPTIONS } from "../utils/api_routes";
import type { Point, RouteSegment } from "@/maps/manage/structure";

export interface Route {
  id: number;
  route_name: string;
  route_data?: string | { points: Point[]; segments: RouteSegment[] };
}

export async function getRouteById(id: number): Promise<Route | null> {
  try {
    const url = `${getApiRoute(MAP_OPTIONS.MAP_GET_ROUTE_BY_ID)}?id=${id.toString()}`;
    const headers = buildAuthHeaders({});
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: headers,
    });
    const result = (await response.json()) as {
      success: boolean;
      data?: Route;
      message?: string;
    };
    if (result.success) {
      return result.data ?? null;
    } else {
      toast.info(result.message || "Failed to fetch route");
      return null;
    }
  } catch (error) {
    toast.info("Error fetching route: " + String(error));
    return null;
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
