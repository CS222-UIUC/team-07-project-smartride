from typing import Any, cast

import requests
from server.core.config import Config


def format_route_response(ors_json: dict[str, Any]) -> dict[str, Any]:
    try:
        geometry = ors_json["features"][0]["geometry"]["coordinates"]
        summary = ors_json["features"][0]["properties"]["summary"]
    except (KeyError, IndexError, TypeError) as e:
        raise ValueError(f"Invalid ORS response structure: {e}") from e

    route = [{"lat": lat, "lng": lng} for lng, lat in geometry]

    return {
        "distance": summary.get("distance", 0),
        "duration": summary.get("duration", 0),
        "route": route,
    }


def call_ors_api(
    start_lng: float, start_lat: float, dest_lng: float, dest_lat: float
) -> dict[str, Any]:
    headers = {
        "Accept": (
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8"
        ),
    }
    req_url = (
        "https://api.openrouteservice.org/v2/directions/cycling-regular"
        f"?api_key={Config.ORS_API_KEY}&start={start_lng},{start_lat}&end={dest_lng},{dest_lat}"
    )

    response = requests.get(req_url, headers=headers)
    print(response.status_code, response.reason)
    response.raise_for_status()  # raises for non-2xx responses
    return cast(dict[str, Any], response.json())
