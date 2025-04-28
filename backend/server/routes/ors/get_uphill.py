from flask import Blueprint, Response, request

from server.core.auth_combo import combined_login_required
from server.utils.ors import detect_uphill_segments
from server.utils.response import api_response

URL_PREFIX_ADDON = "/get_uphill"
get_uphill_bp = Blueprint("get_hphill", __name__)


@get_uphill_bp.route("/", methods=["POST"])
@combined_login_required  # to prevent user from exhausting our ors resources
def get_route() -> tuple[Response, int]:
    data = request.get_json()
    if not data:
        return api_response(False, message="Missing JSON body", status_code=400)

    try:
        route = data["route"]
        if not isinstance(route, list) or not all(isinstance(p, dict) for p in route):
            raise ValueError("Route must be a list of points (dicts).")

    except (KeyError, TypeError, ValueError) as e:
        return api_response(False, message=f"Invalid route format: {e}", status_code=400)

    try:
        uphill_segments = detect_uphill_segments(route)
    except Exception as e:
        return api_response(False, message=f"Uphill segment detection error: {e}", status_code=500)

    return api_response(True, data={"uphills": uphill_segments})
