import { toast } from "sonner";
import { buildAuthHeaders } from "@/api/core/jwt/compatible_token_manager";
import { getApiRoute, MAP_OPTIONS } from "@/api/api_routes";
import { MapGetResponse } from "@/types/ApiResponses";
import { RouteData, RouteInfo, RouteMeta } from "@/types/MapRoute";

export async function getRouteDataById(id: number): Promise<RouteData> {
  try {
    const url = `${getApiRoute(MAP_OPTIONS.MAP_GET_DATA_BY_ID)}?id=${id.toString()}`;
    const headers = buildAuthHeaders({});
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: headers,
    });
    const result = (await response.json()) as MapGetResponse<RouteData>;
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

export async function getRouteInfoById(id: number): Promise<RouteInfo> {
  try {
    const url = `${getApiRoute(MAP_OPTIONS.MAP_GET_INFO_BY_ID)}?id=${id.toString()}`;
    const headers = buildAuthHeaders({});
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: headers,
    });
    const result = (await response.json()) as MapGetResponse<RouteInfo>;
    if (result.success && result.data) {
      return result.data;
    } else {
      const errorMessage = result.message || "Failed to fetch route";
      toast.info(errorMessage);
      throw new Error(errorMessage);
    }
  }
  catch (error) {
    const errorMessage = "Error fetching route: " + String(error);
    toast.info(errorMessage);
    throw new Error(errorMessage);
  }
}

export async function getRoutesMeta(): Promise<RouteMeta[]> {
  try {
    const url = getApiRoute(MAP_OPTIONS.MAP_GET_METAS);
    const headers = buildAuthHeaders({});
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: headers,
    });
    const result = (await response.json()) as MapGetResponse<RouteMeta[]>;
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

/**
 * 
 * @param routeInfo 
 * @returns id of the created route
 */
export async function createRouteByInfo(routeInfo: RouteInfo): Promise<number> {
  try {
    const url = getApiRoute(MAP_OPTIONS.MAP_CREATE_BY_INFO);
    const headers = buildAuthHeaders({
      "Content-Type": "application/json",
    });
    const body = {
      info: routeInfo,
    }
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: headers,
      body: JSON.stringify(body),
    });
    // result.data is the id of the created route
    const result = (await response.json()) as MapGetResponse<number>;
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

export async function updateRouteDataById(id: number, routeData: RouteData): Promise<void> {
  try {
    const url = getApiRoute(MAP_OPTIONS.MAP_UPDATE_DATA_BY_ID);
    const headers = buildAuthHeaders({
      "Content-Type": "application/json",
    });
    const body = {
      id: id,
      data: routeData,
    };
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: headers,
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as MapGetResponse<void>;
    if (result.success) {
      return;
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

export async function updateRouteInfoById(id: number, routeInfo: RouteInfo): Promise<void> {
  try {
    const url = getApiRoute(MAP_OPTIONS.MAP_UPDATE_INFO_BY_ID);
    const headers = buildAuthHeaders({
      "Content-Type": "application/json",
    });
    const body = {
      id: id,
      info: routeInfo,
    };
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: headers,
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as MapGetResponse<void>;
    if (result.success) {
      return;
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