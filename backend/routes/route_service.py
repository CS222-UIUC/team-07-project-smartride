from flask import Blueprint, request, jsonify

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

    return jsonify({"message":"points received!"})



if __name__ == "__main__":
    app.run(debug=True, port=5000)
