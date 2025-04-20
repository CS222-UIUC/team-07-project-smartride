import jwt
from server.core.config import Config
from server.models.user import User
from server.schemas.jwt import JWTPayload
from datetime import datetime, timedelta
from typing import Any, cast

JWT_EXPIRATION_MINUTES = 60
JWT_SECRET_KEY: str = Config.JWT_SECRET_KEY if Config.JWT_SECRET_KEY else ""

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