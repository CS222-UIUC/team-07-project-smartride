from typing import TypedDict


class JWTPayload(TypedDict):
    sub: str
    name: str
    email: str
    exp: int
    iat: int
