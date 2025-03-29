from typing import Any

import requests
from flask import Blueprint, Response, jsonify, request

from server.utils.ors_api import ors_api_key

route_service_bp = Blueprint("route_service", __name__)


@route_service_bp.route("/get_route", methods=["POST"])
def get_route() -> tuple[Response, int] | Response:
    points: dict[str, Any] | None = request.json
    start = points.get("start") if points else None
    dest = points.get("dest") if points else None

    if not start or not dest:
        return jsonify({"error": "One or more point is missing!"}), 400

    start_lon = start.get("lon")
    start_lat = start.get("lat")
    dest_lon = dest.get("lon")
    dest_lat = dest.get("lat")
    route = call_ors_api(start_lon, start_lat, dest_lon, dest_lat)
    return jsonify(route)


def call_ors_api(start_lon: float, start_lat: float, dest_lon: float, dest_lat: float) -> str:
    headers = {
        "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
    }
    req_URL = (
        f"https://api.openrouteservice.org/v2/directions/cycling-regular"
        f"?api_key={ors_api_key}&start={start_lon},{start_lat}&end={dest_lon},{dest_lat}"
    )
    call = requests.get(req_URL, headers=headers)
    print(call.status_code, call.reason)
    return call.text
