from flask import Blueprint, Response, request
from flask_login import current_user, login_required

from server.core.extensions import db
from server.utils.response import api_response

URL_PREFIX_ADDON = "/profile"
profile_bp = Blueprint("web_profile", __name__)


@profile_bp.route("/", methods=["GET"])
@login_required
def profile() -> tuple[Response, int]:
    return api_response(
        success=True,
        data={
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "nickname": current_user.nickname,
            "height": current_user.height,
            "weight": current_user.weight,
            "age": current_user.age,
        },
        message="User profile loaded successfully.",
        status_code=200,
    )


@profile_bp.route("/", methods=["PUT"])
@login_required
def update_profile() -> tuple[Response, int]:
    data = request.get_json()

    current_user.nickname = data.get("nickname", current_user.nickname)
    current_user.height = data.get("height", current_user.height)
    current_user.weight = data.get("weight", current_user.weight)
    current_user.age = data.get("age", current_user.age)

    db.session.commit()

    return api_response(
        success=True,
        data={
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "nickname": current_user.nickname,
            "height": current_user.height,
            "weight": current_user.weight,
            "age": current_user.age,
        },
        message="Profile updated successfully.",
        status_code=200,
    )
