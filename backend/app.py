from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
CORS(app)

# Define User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

# API Routes
@app.route("/")
def home():
    return jsonify({"message": "SmartRide Backend Running!"})

@app.route("/add_user", methods=["POST"])
def add_user():
    data = request.json
    new_user = User(name=data["name"], email=data["email"])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User added successfully!"}), 201

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "name": u.name, "email": u.email} for u in users])

# Initialize Database
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000)