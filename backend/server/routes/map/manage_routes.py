import json
from typing import Any

from flask import Blueprint, Response, request
from flask_login import current_user

from server.core.auth_combo import combined_login_required
from server.core.extensions import db
from server.models.map_route import MapRoute
from server.utils.response import api_response

URL_PREFIX_ADDON = "/manage"
manage_bp = Blueprint("manage_map", __name__)

# TODO (Brian): Use RestAPI Methods, GET PUT POST DELETE ...


@manage_bp.route("/get_routes", methods=["GET"])
@combined_login_required
def get_routes() -> tuple[Response, int]:
    routes = MapRoute.query.filter_by(user_id=current_user.id).all()
    routes_list = [
        {
            "id": route.id,
            "route_name": route.route_name,
            "route_data": json.loads(route.route_data) if route.route_data else None,
        }
        for route in routes
    ]
    return api_response(
        success=True,
        message="Routes retrieved successfully",
        data=routes_list,
    )



def update_route(
    user_id: int | None,
    id: int | None,
    new_name: str | None,
    route_data: dict[str, Any] | None = None,
) -> tuple[Response, int] | None:
    if not id:
        return api_response(success=False, message="Route id is required", status_code=400)
    route = MapRoute.query.filter_by(id=id, user_id=user_id).first()
    if not route:
        return api_response(success=False, message="Route not found", status_code=404)
    if new_name:
        route.route_name = new_name
    if route_data is not None:
        route.route_data = json.dumps(route_data)
    db.session.commit()
    return None


def add_route(user_id: int | None, route_name: str | None) -> tuple[Response, int] | MapRoute:
    if not user_id:
        return api_response(success=False, message="User id is required", status_code=400)
    if not route_name:
        return api_response(success=False, message="Route name is required", status_code=400)
    new_route = MapRoute(route_name=route_name, user_id=user_id)
    db.session.add(new_route)
    db.session.commit()
    return new_route


@manage_bp.route("/set_route", methods=["POST"])
@combined_login_required
def set_route() -> tuple[Response, int]:
    data = request.get_json()
    if not data:
        return api_response(success=False, message="Invalid JSON", status_code=400)

    route_name = data.get("route_name", "Untitled Route")
    route_id = data.get("id")
    route_data = data.get("route_data")
    user_id = current_user.id

    if route_id == -1:
        new_route = MapRoute(
            route_name=route_name,
            user_id=user_id,
            route_data=json.dumps(route_data) if route_data else None,
        )
        db.session.add(new_route)
        db.session.commit()
        return api_response(
            success=True, data={"id": new_route.id, "route_name": new_route.route_name}
        )
    else:
        route = MapRoute.query.filter_by(id=route_id, user_id=user_id).first()
        if not route:
            return api_response(success=False, message="Route not found", status_code=404)
        route.route_name = route_name
        if route_data is not None:
            route.route_data = json.dumps(route_data)
        db.session.commit()
        return api_response(success=True, data={"id": route.id, "route_name": route.route_name})
