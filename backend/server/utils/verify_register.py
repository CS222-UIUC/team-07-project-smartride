from typing import Any
from server.models.user import User
from server.utils.errors import (
    EMAIL_EXISTS,
    EMAIL_TOO_LONG,
    INVALID_JSON,
    MISSING_FIELDS,
    NAME_TOO_LONG,
    PASSWORD_TOO_LONG,
)

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