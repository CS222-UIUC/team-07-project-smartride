# routes/auth.py
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from extensions import db

auth_bp = Blueprint("auth", __name__)

# Helper function to verify register data
def verify_register(data):
    if not data.get("name") or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Please fill all required fields"}), 400
    if len(data["password"]) > 150:
        return jsonify({"message": "Password too long"}), 400
    if len(data["name"]) > 100:
        return jsonify({"message": "Name too long"}), 400
    if len(data["email"]) > 120:
        return jsonify({"message": "Email too long"}), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 400
    return None

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    error = verify_register(data)
    if error:
        return error

    hashed_password = generate_password_hash(data["password"], method="pbkdf2:sha256")
    new_user = User(name=data["name"], email=data["email"], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": f"User {new_user.name} added successfully!"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid email or password"}), 401

    login_user(user)
    return jsonify({"message": f"Logged in successfully as {user.name}"}), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200
