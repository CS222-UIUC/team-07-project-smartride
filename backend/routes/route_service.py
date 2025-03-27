from flask import Blueprint, request, jsonify
import requests
from routes.ors_api import ors_api_key

route_service_bp = Blueprint("route_service", __name__)


@route_service_bp.route("/get_route", methods=["POST"])
def get_route():
    points = request.json
    start = points.get('start')
    dest = points.get('dest')

    if not start or not dest:
        return jsonify({'error': 'One or more point is missing!'}), 400

    start_lon = start.get('lon')
    start_lat = start.get('lat')
    dest_lon = dest.get('lon')
    dest_lat = dest.get('lat')
    route = call_ors_api(start_lon, start_lat, dest_lon, dest_lat)
    return jsonify(route)


def call_ors_api(start_lon, start_lat, dest_lon, dest_lat):
    headers = {    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
    }
    req_URL = f"https://api.openrouteservice.org/v2/directions/cycling-regular?api_key={ors_api_key}&start={start_lon},{start_lat}&end={dest_lon},{dest_lat}"
    call = requests.get(req_URL, headers=headers)

    print(call.status_code, call.reason)

    return call.text


if __name__ == "__main__":
    app.run(debug=True, port=5000)
