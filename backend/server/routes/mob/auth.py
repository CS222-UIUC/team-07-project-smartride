from flask import Blueprint, Response, request
from werkzeug.security import check_password_hash, generate_password_hash

from server.core.extensions import db
from server.models.user import User
from server.utils.errors import (
    INVALID_CREDENTIALS,
    INVALID_JSON,
    MISSING_FIELDS,
)
from server.utils.jwt_utils import create_jwt_token
from server.utils.response import api_response
from server.utils.verify_register import verify_register

URL_PREFIX_ADDON = "/auth"
auth_bp = Blueprint("mob_auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register() -> tuple[Response, int]:
    data = request.json
    if not data:
        raise INVALID_JSON

    verify_register(data)

    name = data["name"]
    email = data["email"]
    password = data["password"]

    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    token = create_jwt_token(new_user)
    return api_response(
        True, data={"token": token}, message="User registered successfully.", status_code=201
    )


@auth_bp.route("/login", methods=["POST"])
def login() -> tuple[Response, int]:
    data = request.json
    if not data:
        raise INVALID_JSON

    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        raise MISSING_FIELDS

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        raise INVALID_CREDENTIALS

    token = create_jwt_token(user)
    return api_response(True, data={"token": token}, message="Login successful.", status_code=200)


@auth_bp.route("/logout", methods=["POST"])
def logout() -> tuple[Response, int]:
    return api_response(True, message="Logout successful.", status_code=200)
