from typing import Final

from flask import Response

from server.utils.response import api_response


class APIError(Exception):
    message: str
    status_code: int
    detail: str | None

    def __init__(self, message: str, status_code: int = 400, detail: str | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.detail = detail

    def to_response(self) -> tuple[Response, int]:
        return api_response(
            success=False,
            message=self.message,
            data={"detail": self.detail} if self.detail else None,
            status_code=self.status_code,
        )


# Common reusable error instances
INVALID_JSON: Final[APIError] = APIError("Invalid JSON", 400)
MISSING_FIELDS: Final[APIError] = APIError("Please fill all required fields", 400)
EMAIL_EXISTS: Final[APIError] = APIError("Email already exists", 400)
NAME_TOO_LONG: Final[APIError] = APIError("Name too long", 400)
EMAIL_TOO_LONG: Final[APIError] = APIError("Email too long", 400)
PASSWORD_TOO_LONG: Final[APIError] = APIError("Password too long", 400)
INVALID_CREDENTIALS: Final[APIError] = APIError("Invalid email or password", 401)
UNAUTHORIZED: Final[APIError] = APIError("Unauthorized", 401)


# Flask global error handler
def handle_api_error(error: APIError) -> tuple[Response, int]:
    return error.to_response()
