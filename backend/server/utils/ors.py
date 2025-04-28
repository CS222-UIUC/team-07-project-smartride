import math
from typing import Any, cast

import requests

from server.core.config import Config

# Thresholds
MIN_SHORT_DISTANCE = 50  # example meters
MIN_LONG_DISTANCE = 300  # example meters
MIN_GROSS_ANGLE = 0.06  # example slope 6%
MIN_KLEIN_ANGLE = 0.03  # example slope 3%


def format_route_response(ors_json: dict[str, Any]) -> dict[str, Any]:
    try:
        geometry = ors_json["features"][0]["geometry"]["coordinates"]
        summary = ors_json["features"][0]["properties"]["summary"]
    except (KeyError, IndexError, TypeError) as e:
        raise ValueError(f"Invalid ORS response structure: {e}") from e

    route = [{"lat": lat, "lng": lng, "ele": ele} for lng, lat, ele in geometry]

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


def call_ors_api_with_altitude(
    start_lng: float, start_lat: float, dest_lng: float, dest_lat: float
) -> dict[str, Any]:
    body = {
        "coordinates": [[start_lng, start_lat], [dest_lng, dest_lat]],
        "elevation": "true",
        "extra_info": ["steepness"],
    }

    headers = {
        "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        "Authorization": Config.ORS_API_KEY,
        "Content-Type": "application/json; charset=utf-8",
    }
    response = requests.post(
        "https://api.openrouteservice.org/v2/directions/cycling-regular/geojson",
        json=body,
        headers=headers,
    )

    print(response.status_code, response.reason)
    response.raise_for_status()  # raises for non-2xx responses
    return cast(dict[str, Any], response.json())


def calculate_gc_dist(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    """Calculate the great circle distance between two points (meters)."""
    R = 6371000  # Earth radius in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def detect_uphill_segments(route: list[dict[str, float]]) -> list[dict[str, Any]]:
    """Analyze uphill segments separately."""
    n = len(route)
    uphill_segments = []
    i = 0

    while i < n - 1:
        j = i + 1
        total_distance = 0.0
        total_climb = 0.0

        while j < n:
            dist = calculate_gc_dist(
                route[j - 1]["lng"], route[j - 1]["lat"], route[j]["lng"], route[j]["lat"]
            )
            ele_diff = route[j]["ele"] - route[j - 1]["ele"]

            total_distance += dist
            if ele_diff > 0:
                total_climb += ele_diff

            avg_slope = total_climb / total_distance if total_distance > 0 else 0

            if (total_distance >= MIN_SHORT_DISTANCE and avg_slope >= MIN_GROSS_ANGLE) or (
                total_distance >= MIN_LONG_DISTANCE and avg_slope >= MIN_KLEIN_ANGLE
            ):
                j += 1  # keep expanding
            else:
                break  # can't grow further

        if j > i + 1:
            uphill_segments.append(
                {
                    "start_index": i,
                    "end_index": j - 1,
                    "distance": total_distance,
                    "elevation_gain": total_climb,
                    "average_slope": avg_slope,
                }
            )
            i = j  # move to next starting point
        else:
            i += 1  # move to next point

    return uphill_segments
