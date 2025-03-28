# routes/auth.py
from typing import Any

from flask import Blueprint, Response, jsonify, request
from flask_login import login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from backend.extensions import db
from backend.models.user import User

auth_bp = Blueprint("auth", __name__)


# Helper function to verify register data
def verify_register(data: dict[str, Any] | None) -> tuple[Response, int] | None:
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400
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
def register() -> tuple[Response, int]:
    data = request.json
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400
    error = verify_register(data)
    if error:
        return error

    hashed_password = generate_password_hash(data["password"], method="pbkdf2:sha256")
    new_user = User(name=data["name"], email=data["email"], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": f"User {new_user.name} added successfully!"}), 201


@auth_bp.route("/login", methods=["POST"])
def login() -> tuple[Response, int]:
    data = request.json
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid email or password"}), 401

    login_user(user)
    return jsonify({"message": f"Logged in successfully as {user.name}"}), 200


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout() -> tuple[Response, int]:
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200
