// src/api/routeService.ts
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
  const url = "http://127.0.0.1:5000/api/get_route";
  const payload = { start, dest };

  const response: Response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status.toString()}`);
  }

  const data: RouteResponse = (await response.json()) as RouteResponse;
  return data;
}
