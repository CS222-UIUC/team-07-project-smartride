from flask import Flask

from .auth import URL_PREFIX_ADDON as AUTH_URL_PREFIX
from .auth import auth_bp
from .profile import URL_PREFIX_ADDON as PROFILE_URL_PREFIX
from .profile import profile_bp


def register_mob_routes(app: Flask, base_prefix: str) -> None:
    url_prefix = base_prefix + "/mob"
    app.register_blueprint(auth_bp, url_prefix=url_prefix + AUTH_URL_PREFIX)
    app.register_blueprint(profile_bp, url_prefix=url_prefix + PROFILE_URL_PREFIX)
