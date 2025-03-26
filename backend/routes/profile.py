# routes/profile.py
from flask import Blueprint, jsonify
from flask_login import login_required, current_user

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/profile", methods=["GET"])
@login_required
def profile():
    return jsonify({
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    })
