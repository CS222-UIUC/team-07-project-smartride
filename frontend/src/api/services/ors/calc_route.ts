import { buildAuthHeaders } from "@/api/core/jwt/compatible_token_manager";
import { getApiRoute, ORS_OPTIONS } from "@/api/api_routes";
import type { Coordinates, ORSRouteData } from "@/types/MapRoute"; 
import { OrsCalcRouteResponse } from "@/types/ApiResponses";

export async function calcRoute(
  start: Coordinates,
  dest: Coordinates,
): Promise<ORSRouteData> {
  const url = getApiRoute(ORS_OPTIONS.ORS_CALC_ROUTE);
  const payload = { start, dest };
  const headers = buildAuthHeaders({
    "Content-Type": "application/json",
  });
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${String(response.status)}`);
  }
  const raw = (await response.json()) as OrsCalcRouteResponse;
  return raw.data;
}