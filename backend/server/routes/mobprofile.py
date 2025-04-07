# routes/mobprofile.py
from typing import TypedDict, cast

import jwt
from flask import Blueprint, Request, Response, request

from server.models.user import User
from server.utils.errors import INVALID_CREDENTIALS
from server.utils.response import api_response

JWT_SECRET = "your_secret_key"  # Use same as in mobauth

mobprofile_bp = Blueprint("mobprofile_bp", __name__, url_prefix="/mob")


class JWTPayload(TypedDict):
    sub: int
    name: str
    email: str
    exp: int
    iat: int


def get_user_from_token(req: Request) -> User:
    auth_header = req.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise INVALID_CREDENTIALS

    token = auth_header.split(" ")[1]
    try:
        payload: JWTPayload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])  # type: ignore
        user = cast(User, User.query.get(payload["sub"]))
        if not user:
            raise INVALID_CREDENTIALS
        return user
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as err:
        raise INVALID_CREDENTIALS from err


@mobprofile_bp.route("/profile", methods=["GET"])
def mob_profile() -> tuple[Response, int]:
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
