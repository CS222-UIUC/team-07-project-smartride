from flask import Flask

from .manage_routes import URL_PREFIX_ADDON as MANAGE_ROUTES_URL_PREFIX
from .manage_routes import manage_bp


def register_map_routes(app: Flask, base_prefix: str) -> None:
    url_prefix = base_prefix + "/map"
    app.register_blueprint(manage_bp, url_prefix=url_prefix + MANAGE_ROUTES_URL_PREFIX)
