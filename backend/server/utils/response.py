from typing import Any

from flask import Response, jsonify


def api_response(
    success: bool,
    data: Any | None = None,
    message: str = "",
    status_code: int = 200,
) -> tuple[Response, int]:
    return (
        jsonify({"success": success, "data": data, "message": message}),
        status_code,
    )
