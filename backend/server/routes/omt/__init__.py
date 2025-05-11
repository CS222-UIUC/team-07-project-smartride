from flask import Flask

from .get_weather import URL_PREFIX_ADDON as GET_WEATHER_URL_PREFIX
from .get_weather import get_weather_bp


def register_omt_routes(app: Flask, base_prefix: str) -> None:
    url_prefix = base_prefix + "/omt"
    app.register_blueprint(get_weather_bp, url_prefix=url_prefix + GET_WEATHER_URL_PREFIX)
