from typing import Any


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
