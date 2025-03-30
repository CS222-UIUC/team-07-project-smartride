import os
from dotenv import load_dotenv
from typing import cast

from flask import Flask, Response
from flask_cors import CORS

from server.config import Config
from server.extensions import db, login_manager
from server.models.user import User
from server.routes.auth import auth_bp
from server.routes.profile import profile_bp
from server.routes.route_service import route_service_bp
from server.utils.errors import APIError, handle_api_error
from server.utils.response import api_response

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
flask_secret_key = os.getenv("FLASK_SECRET_KEY")

if not flask_secret_key:
    raise RuntimeError("FLASK_SECRET_KEY is not set in the environment.")

app.config["SECRET_KEY"] = flask_secret_key
CORS(app, supports_credentials=True, origins=["*"])

db.init_app(app)  # type: ignore[no-untyped-call]
login_manager.init_app(app)


@app.errorhandler(APIError)
def api_error_handler(error: APIError) -> tuple[Response, int]:
    return handle_api_error(error)


@login_manager.unauthorized_handler
def unauthorized() -> tuple[Response, int]:
    return api_response(False, message="Unauthorized", status_code=401)


@login_manager.user_loader
def load_user(user_id: str) -> User | None:
    return cast(User | None, User.query.get(int(user_id)))


app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")
app.register_blueprint(route_service_bp, url_prefix="/api")


@app.route("/")
def home() -> tuple[Response, int]:
    return api_response(True, message="SmartRide Backend Running", status_code=200)


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)
