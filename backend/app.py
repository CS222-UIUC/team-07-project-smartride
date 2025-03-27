from flask import Flask, jsonify
from config import Config
from flask_cors import CORS

from extensions import db, login_manager
from models.user import User
from routes.auth import auth_bp
from routes.profile import profile_bp

app = Flask(__name__)
app.config.from_object(Config)
app.config['SECRET_KEY'] = 'secret_key_here'
CORS(app, supports_credentials=True, origins=["*"])

db.init_app(app)
login_manager.init_app(app)

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"message": "Unauthorized"}), 401

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")

@app.route("/")
def home():
    return {"message": "SmartRide Backend Running!"}

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)
