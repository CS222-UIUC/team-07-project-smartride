from typing import Any

from flask import Blueprint, Response, request
from flask_login import login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from server.core.extensions import db
from server.models.user import User
from server.utils.errors import (
    EMAIL_EXISTS,
    EMAIL_TOO_LONG,
    INVALID_CREDENTIALS,
    INVALID_JSON,
    MISSING_FIELDS,
    NAME_TOO_LONG,
    PASSWORD_TOO_LONG,
)
from server.utils.response import api_response

auth_bp = Blueprint("auth", __name__)


# Helper function to raise register errors
def verify_register(data: dict[str, Any] | None) -> None:
    if not data:
        raise INVALID_JSON
    if not data.get("name") or not data.get("email") or not data.get("password"):
        raise MISSING_FIELDS
    if len(data["password"]) > 150:
        raise PASSWORD_TOO_LONG
    if len(data["name"]) > 100:
        raise NAME_TOO_LONG
    if len(data["email"]) > 120:
        raise EMAIL_TOO_LONG
    if User.query.filter_by(email=data["email"]).first():
        raise EMAIL_EXISTS


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
