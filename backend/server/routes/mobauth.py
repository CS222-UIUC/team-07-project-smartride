# routes/mobauth.py
from datetime import datetime, timedelta
from typing import Any, TypedDict, cast

import jwt
from flask import Blueprint, Response, request
from werkzeug.security import check_password_hash, generate_password_hash

from server.core.config import Config
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

JWT_EXPIRATION_MINUTES = 60
JWT_SECRET_KEY: str = Config.JWT_SECRET_KEY if Config.JWT_SECRET_KEY else ""

mobauth_bp = Blueprint("mobauth_bp", __name__, url_prefix="/mob/auth")


class JWTPayload(TypedDict):
    sub: int
    name: str
    email: str
    exp: int
    iat: int


def create_jwt_token(user: User) -> str:
    payload: JWTPayload = {
        "sub": user.id,
        "name": user.name,
        "email": user.email,
        "exp": int((datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)).timestamp()),
        "iat": int(datetime.utcnow().timestamp()),
    }
    token = jwt.encode(cast(dict[str, Any], payload), JWT_SECRET_KEY, algorithm="HS256")
    if isinstance(token, bytes):
        return token.decode("utf-8")
    return token


def decode_jwt_token(token: str) -> JWTPayload:
    return jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])  # type: ignore


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


@mobauth_bp.route("/register", methods=["POST"])
def mob_register() -> tuple[Response, int]:
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


@mobauth_bp.route("/login", methods=["POST"])
def mob_login() -> tuple[Response, int]:
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
