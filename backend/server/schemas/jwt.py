from typing import TypedDict


class JWTPayload(TypedDict):
    sub: int
    name: str
    email: str
    exp: int
    iat: int
