from flask import Blueprint, Response, jsonify
from flask_login import current_user, login_required

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/profile", methods=["GET"])
@login_required
def profile() -> tuple[Response, int]:
    return (
        jsonify(
            {
                "id": current_user.id,
                "name": current_user.name,
                "email": current_user.email,
            }
        ),
        200,
    )
