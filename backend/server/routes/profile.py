from flask import Blueprint, Response
from flask_login import current_user, login_required

from server.utils.response import api_response

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/profile", methods=["GET"])
@login_required
def profile() -> tuple[Response, int]:
    return api_response(
        success=True,
        data={
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
        },
        message="User profile loaded successfully.",
        status_code=200,
    )
