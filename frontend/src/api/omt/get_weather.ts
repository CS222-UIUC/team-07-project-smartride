import { buildAuthHeaders } from "../jwt/compatible_token_manager";
import { getApiRoute, OMT_OPTIONS } from "../utils/api_routes";

export interface WeatherData {
    date: string;
    wind_speed: number;
    wind_dir: number;
    temp: number;
    uv: number;
    rain_prob: number;
}

interface WeatherResponse {
    success: boolean;
    message: string;
    data: WeatherData;
}

export async function getWeather(
  lat: number,
  lng: number,
): Promise<WeatherData> {
  const url = getApiRoute(OMT_OPTIONS.OMT_GET_WEATHER);
  const body = {"lat": lat, "lng": lng,};
  const headers = buildAuthHeaders({
    "Content-Type": "application/json",
  });
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${String(response.status)}`);
  }
  const raw = (await response.json()) as WeatherResponse;
  if (!raw.success) {
    throw new Error(`Error! Message: ${String(raw.message)}`);
  }
  return raw.data;
}
