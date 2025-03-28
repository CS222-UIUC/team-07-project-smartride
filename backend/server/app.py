from typing import cast

from flask import Flask, Response, jsonify
from flask_cors import CORS

from server.config import Config
from server.extensions import db, login_manager
from server.models.user import User
from server.routes.auth import auth_bp
from server.routes.profile import profile_bp

app = Flask(__name__)
app.config.from_object(Config)
app.config["SECRET_KEY"] = "secret_key_here"
CORS(app, supports_credentials=True, origins=["*"])

db.init_app(app)
login_manager.init_app(app)


@login_manager.unauthorized_handler
def unauthorized() -> tuple[Response, int]:
    return jsonify({"message": "Unauthorized"}), 401


@login_manager.user_loader
def load_user(user_id: str) -> User | None:
    return cast(User | None, User.query.get(int(user_id)))


app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")


@app.route("/")
def home() -> tuple[Response, int]:
    return jsonify({"message": "SmartRide Backend Running!"}), 200


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)
