from functools import wraps
from flask import request, jsonify, g
from flask_login import current_user
from server.utils.jwt_utils import decode_jwt_token
from server.models.user import User
from flask_login import AnonymousUserMixin

def combined_login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
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
        return jsonify({"success": False, "message": "Authentication required"}), 401

    return wrapper
