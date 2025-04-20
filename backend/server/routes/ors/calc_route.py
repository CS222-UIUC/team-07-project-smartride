from typing import Any

import requests
from flask import Blueprint, Response, request

from server.core.auth_combo import combined_login_required
from server.utils.ors import call_ors_api, format_route_response
from server.utils.response import api_response

URL_PREFIX_ADDON = "/calc_route"
calc_route_bp = Blueprint("calc_route", __name__)


@calc_route_bp.route("/", methods=["POST"])
@combined_login_required  # to prevent user from exhausting our ors resources
def get_route() -> tuple[Response, int]:
    points: dict[str, Any] | None = request.json
    start = points.get("start") if points else None
    dest = points.get("dest") if points else None

    if not start or not dest:
        return api_response(
            success=False,
            message="One or more point is missing!",
            status_code=400,
        )

    try:
        start_lng = float(start.get("lng"))
        start_lat = float(start.get("lat"))
        dest_lng = float(dest.get("lng"))
        dest_lat = float(dest.get("lat"))
    except (TypeError, ValueError):
        return api_response(
            success=False,
            message="Invalid coordinates in request data.",
            status_code=400,
        )

    try:
        route = call_ors_api_with_altitude(start_lng, start_lat, dest_lng, dest_lat)
        formatted = format_route_response(route)
        return api_response(success=True, data=formatted)
    except requests.RequestException as e:
        return api_response(
            success=False,
            message=f"OpenRouteService API error: {e}",
            status_code=502,
        )


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
