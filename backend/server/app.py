from typing import cast

from flask import Flask, Response
from flask_cors import CORS

from server.core.config import Config
from server.core.extensions import db, login_manager
from server.models.user import User
from server.routes.auth import auth_bp
from server.routes.profile import profile_bp
from server.routes.route_service import route_service_bp
from server.utils.errors import APIError, handle_api_error
from server.utils.response import api_response

app = Flask(__name__)
app.config.from_object(Config)

app.config["SECRET_KEY"] = Config.FLASK_SECRET_KEY
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
    return cast(User | None, db.session.get(User, int(user_id)))


app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")
app.register_blueprint(route_service_bp, url_prefix="/api")


@app.route("/")
def home() -> tuple[Response, int]:
    return api_response(True, message="SmartRide Backend Running", status_code=200)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=Config.API_PORT)
