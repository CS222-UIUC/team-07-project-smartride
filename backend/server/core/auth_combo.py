from collections.abc import Callable
from functools import wraps
from typing import Any

from flask import Response, g, request
from flask_login import AnonymousUserMixin, current_user

from server.models.user import User
from server.utils.errors import INVALID_CREDENTIALS, UNAUTHORIZED
from server.utils.jwt_utils import decode_jwt_token
from server.utils.response import api_response


def combined_login_required(func: Callable[..., Any]) -> Callable[..., Any]:
    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> tuple[Response, int] | Any:
        # Try session login first
        if current_user.is_authenticated:
            g.current_user = current_user
            return func(*args, **kwargs)

        # Try JWT fallback
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.removeprefix("Bearer ").strip()
            payload = decode_jwt_token(token)
            if payload and "sub" in payload:
                user = User.query.get(payload["sub"])
                if user:
                    g.current_user = user
                    return func(*args, **kwargs)

        # Neither session nor JWT available
        g.current_user = AnonymousUserMixin()
        return api_response(False, data={"message": UNAUTHORIZED}, status_code=401)

    return wrapper

def get_combined_current_user() -> User:
    # 1. Try Flask-Login (session-based)
    user: User | None = None
    if current_user.is_authenticated:
        user = current_user
        return user
    # 2. Try JWT (token-based)
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1]
        try:
            payload = decode_jwt_token(token)
            user = User.query.get(payload["sub"])
            if not user:
                raise INVALID_CREDENTIALS
            return user
        except Exception:
            raise INVALID_CREDENTIALS
    # 3. Neither works
    raise INVALID_CREDENTIALS