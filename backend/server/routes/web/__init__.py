from flask import Flask
from .auth import auth_bp
from .profile import profile_bp

def register_web_routes(app: Flask, base_prefix: str) -> None:
    url_prefix = base_prefix + "/web"
    app.register_blueprint(auth_bp, url_prefix=url_prefix)
    app.register_blueprint(profile_bp, url_prefix=url_prefix)