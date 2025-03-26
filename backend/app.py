from flask import Flask
from config import Config
from flask_cors import CORS

from extensions import db, login_manager  # ✅ 从这里导入
from models.user import User
from routes.auth import auth_bp
from routes.profile import profile_bp

app = Flask(__name__)
app.config.from_object(Config)
app.config['SECRET_KEY'] = 'secret_key_here'
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173"])

db.init_app(app)
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)

@app.route("/")
def home():
    return {"message": "SmartRide Backend Running!"}

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
