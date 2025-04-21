# routes/mobprofile.py
from typing import cast

import jwt
from flask import Blueprint, Request, Response, request

from server.models.user import User
from server.schemas.jwt import JWTPayload
from server.utils.errors import INVALID_CREDENTIALS
from server.utils.jwt_utils import decode_jwt_token
from server.utils.response import api_response

URL_PREFIX_ADDON = "/profile"
profile_bp = Blueprint("mob_profile", __name__)


def get_user_from_token(req: Request) -> User:
    auth_header = req.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise INVALID_CREDENTIALS

    token = auth_header.split(" ")[1]
    try:
        payload: JWTPayload = decode_jwt_token(token)
        user = cast(User, User.query.get(payload["sub"]))
        if not user:
            raise INVALID_CREDENTIALS
        return user
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as err:
        raise INVALID_CREDENTIALS from err


@profile_bp.route("/", methods=["GET"])
def profile() -> tuple[Response, int]:
    user = get_user_from_token(request)

    return api_response(
        success=True,
        data={
            "id": user.id,
            "name": user.name,
            "email": user.email,
        },
        message="User profile loaded successfully.",
        status_code=200,
    )
