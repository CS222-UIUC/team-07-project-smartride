# Currently, we do not actually store the route but the route_name and id only

from typing import cast

from flask import Blueprint, Response, request
from flask_login import current_user, login_required

from server.core.extensions import db
from server.models.map_route import MapRoute
from server.utils.response import api_response

user_routes_bp = Blueprint("user_routes", __name__)


@user_routes_bp.route("/get_routes", methods=["GET"])
@login_required
def get_routes() -> tuple[Response, int]:
    routes = MapRoute.query.filter_by(user_id=current_user.id).all()
    routes_list = [{"id": route.id, "route_name": route.route_name} for route in routes]
    return api_response(
        success=True,
        message="Routes retrieved successfully",
        data=routes_list,
    )


def update_route(
    user_id: int | None, id: int | None, new_name: str | None
) -> tuple[Response, int] | None:
    if not id:
        return api_response(success=False, message="Route id is required", status_code=400)
    route = MapRoute.query.filter_by(id=id, user_id=user_id).first()
    if not route:
        return api_response(success=False, message="Route not found", status_code=404)
    if not new_name:
        return api_response(success=False, message="New name is required", status_code=400)
    route.route_name = new_name
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


@user_routes_bp.route("/manage_route", methods=["POST"])
@login_required
def manage_route() -> tuple[Response, int]:
    data = request.get_json()
    if not data:
        return api_response(success=False, message="Invalid JSON", status_code=400)
    route_name = data.get("route_name", "Untitled Route")
    route_id = data.get("id")
    user_id = current_user.id
    if route_id == -1:
        # Create a new route
        new_route = cast(MapRoute, add_route(user_id, route_name))
        return api_response(
            success=True, data={"id": new_route.id, "route_name": new_route.route_name}
        )
    else:
        # Update an existing route
        update_route(user_id, route_id, route_name)
        return api_response(success=True, data={"id": route_id, "route_name": route_name})
