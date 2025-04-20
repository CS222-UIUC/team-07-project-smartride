import { API_ROUTES } from "../utils/route_dictionary";

interface Coordinates {
  lat: number;
  lng: number;
}

interface RouteResponse {
  distance: number;
  duration: number;
  route: Coordinates[];
}

export async function getRoute(
  start: Coordinates,
  dest: Coordinates,
): Promise<RouteResponse> {
  const url = API_ROUTES.ORS_CALC_ROUTE;
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
