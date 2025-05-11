import json

from flask import Blueprint, Response, request

from server.core.auth_combo import combined_login_required, get_combined_current_user
from server.core.extensions import db
from server.models.map_route import MapRoute
from server.utils.response import api_response

URL_PREFIX_ADDON = "/manage"
manage_bp = Blueprint("manage_map", __name__)


@manage_bp.route("/get_metas", methods=["GET"])
@combined_login_required
def get_metas() -> tuple[Response, int]:
    routes = MapRoute.query.filter_by(user_id=get_combined_current_user().id).all()
    meta_list = []
    for route in routes:
        try:
            info_dict = json.loads(route.info) if route.info else {}
        except json.JSONDecodeError:
            info_dict = {}
        meta_list.append({"id": route.id, **info_dict})
    return api_response(success=True, data=meta_list)


@manage_bp.route("/get_info_by_id", methods=["GET"])
@combined_login_required
def get_info_by_id() -> tuple[Response, int]:
    route_id = request.args.get("id")
    if not route_id:
        return api_response(success=False, message="Route id is required", status_code=400)

    route = MapRoute.query.filter_by(id=route_id, user_id=get_combined_current_user().id).first()
    if not route:
        return api_response(success=False, message="Route not found", status_code=404)

    try:
        route_info = json.loads(route.info) if route.info else {}
    except json.JSONDecodeError:
        route_info = {}

    return api_response(success=True, data=route_info)


@manage_bp.route("/get_data_by_id", methods=["GET"])
@combined_login_required
def get_data_by_id() -> tuple[Response, int]:
    route_id = request.args.get("id")
    if not route_id:
        return api_response(success=False, message="Route id is required", status_code=400)

    route = MapRoute.query.filter_by(id=route_id, user_id=get_combined_current_user().id).first()
    if not route:
        return api_response(success=False, message="Route not found", status_code=404)

    try:
        route_data = json.loads(route.data) if route.data else None
    except json.JSONDecodeError:
        route_data = None

    return api_response(success=True, data=route_data)


@manage_bp.route("/create_by_info", methods=["POST"])
@combined_login_required
def create_by_info() -> tuple[Response, int]:
    data = request.get_json()
    if not data:
        return api_response(success=False, message="Invalid JSON", status_code=400)

    route_info = data.get("info")
    if not isinstance(route_info, dict):
        return api_response(success=False, message="`info` must be a JSON object", status_code=400)

    new_route = MapRoute(
        info=json.dumps(route_info),
        user_id=get_combined_current_user().id,
    )
    db.session.add(new_route)
    db.session.commit()
    return api_response(success=True, data=new_route.id)


@manage_bp.route("/update_data_by_id", methods=["POST"])
@combined_login_required
def update_data_by_id() -> tuple[Response, int]:
    data = request.get_json()
    if not data:
        return api_response(success=False, message="Invalid JSON", status_code=400)

    route_id = data.get("id")
    route_data = data.get("data")
    if not route_id:
        return api_response(success=False, message="Missing id", status_code=400)

    route = MapRoute.query.filter_by(id=route_id, user_id=get_combined_current_user().id).first()
    if not route:
        return api_response(success=False, message="Route not found", status_code=404)

    route.data = json.dumps(route_data) if route_data else None
    db.session.commit()
    return api_response(success=True)


@manage_bp.route("/update_info_by_id", methods=["POST"])
@combined_login_required
def update_info_by_id() -> tuple[Response, int]:
    data = request.get_json()
    if not data:
        return api_response(success=False, message="Invalid JSON", status_code=400)

    route_id = data.get("id")
    route_info = data.get("info")
    if not route_id or not isinstance(route_info, dict):
        return api_response(success=False, message="Missing id or invalid info", status_code=400)

    route = MapRoute.query.filter_by(id=route_id, user_id=get_combined_current_user().id).first()
    if not route:
        return api_response(success=False, message="Route not found", status_code=404)

    route.info = json.dumps(route_info)
    db.session.commit()
    return api_response(success=True)
