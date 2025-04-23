import { getApiRoute, ORS_OPTIONS } from "../utils/api_routes";
import type { Point, RouteSegment } from "@/maps/manage/structure";

interface Coordinates {
  lat: number;
  lng: number;
  ele: number;
}

interface RouteResponse {
  distance: number;
  duration: number;
  route: Coordinates[];
}

export async function calcRoute(
  start: Coordinates,
  dest: Coordinates,
): Promise<RouteResponse> {
  const url = getApiRoute(ORS_OPTIONS.ORS_CALC_ROUTE);
  const payload = { start, dest };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${String(response.status)}`);
  }

  const raw = (await response.json()) as {
    success: boolean;
    message: string;
    data: RouteResponse;
  }; // this is { success, message, data }
  return raw.data;
}

export interface RouteRecord {
  id: number;
  route_name: string;
  route_data?: string | { points: Point[]; segments: RouteSegment[] };
}

export interface GetRoutesResponse {
  success: boolean;
  data?: RouteRecord[];
}
