from flask import Blueprint, Response, request
from flask_login import login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from server.core.extensions import db
from server.models.user import User
from server.utils.errors import (
    INVALID_CREDENTIALS,
    INVALID_JSON,
)
from server.utils.response import api_response
from server.utils.verify_register import verify_register

URL_PREFIX_ADDON = "/auth"
auth_bp = Blueprint("web_auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register() -> tuple[Response, int]:
    data = request.json
    if not data:
        raise INVALID_JSON
    verify_register(data)

    hashed_password = generate_password_hash(data["password"], method="pbkdf2:sha256")
    new_user = User(name=data["name"], email=data["email"], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return api_response(True, message=f"User {new_user.name} added successfully!", status_code=201)


@auth_bp.route("/login", methods=["POST"])
def login() -> tuple[Response, int]:
    data = request.json
    if not data:
        raise INVALID_JSON
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        raise INVALID_CREDENTIALS

    login_user(user)
    return api_response(True, message=f"Logged in successfully as {user.name}", status_code=200)


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout() -> tuple[Response, int]:
    logout_user()
    return api_response(True, message="Logged out successfully", status_code=200)
