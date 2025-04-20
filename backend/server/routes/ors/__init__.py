from flask import Flask

from .calc_route import URL_PREFIX_ADDON as CALC_ROUTE_URL_PREFIX
from .calc_route import calc_route_bp


def register_ors_routes(app: Flask, base_prefix: str) -> None:
    url_prefix = base_prefix + "/ors"
    app.register_blueprint(calc_route_bp, url_prefix=url_prefix + CALC_ROUTE_URL_PREFIX)
