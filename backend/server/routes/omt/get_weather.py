import json

from flask import Blueprint, Response, request

from server.core.auth_combo import combined_login_required
from server.utils.omt import get_weather_from_omp
from server.utils.response import api_response

URL_PREFIX_ADDON = "/get_weather"
get_weather_bp = Blueprint("get_weather", __name__)


@get_weather_bp.route("/", methods=["POST"])
@combined_login_required  # to prevent user from exhausting our omt resources
def get_weather() -> tuple[Response, int]:
    try:
        data = request.get_json()
        lng = float(data.get("lng"))
        lat = float(data.get("lat"))
    except (TypeError, ValueError, AttributeError):
        return api_response(
            False, message="Missing or invalid 'lng' and 'lat' in JSON body", status_code=400
        )

    try:
        weather_data = get_weather_from_omp(lng, lat)
        return api_response(True, data=json.loads(weather_data), status_code=200)
    except Exception as e:
        return api_response(False, message=f"Weather API error: {str(e)}", status_code=500)
