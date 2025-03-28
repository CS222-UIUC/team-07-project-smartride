# routes/auth.py
from typing import Any

from flask import Blueprint, Response, request
from flask_login import login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from server.extensions import db
from server.models.user import User
from server.utils.response import api_response

auth_bp = Blueprint("auth", __name__)


# Helper function to verify register data
def verify_register(data: dict[str, Any] | None) -> tuple[Response, int] | None:
    if not data:
        return api_response(False, message="Invalid JSON", status_code=400)
    if not data.get("name") or not data.get("email") or not data.get("password"):
        return api_response(False, message="Please fill all required fields", status_code=400)
    if len(data["password"]) > 150:
        return api_response(False, message="Password too long", status_code=400)
    if len(data["name"]) > 100:
        return api_response(False, message="Name too long", status_code=400)
    if len(data["email"]) > 120:
        return api_response(False, message="Email too long", status_code=400)
    if User.query.filter_by(email=data["email"]).first():
        return api_response(False, message="Email already exists", status_code=400)
    return None


@auth_bp.route("/register", methods=["POST"])
def register() -> tuple[Response, int]:
    data = request.json
    if not data:
        return api_response(False, message="Invalid JSON", status_code=400)
    error = verify_register(data)
    if error:
        return error

    hashed_password = generate_password_hash(data["password"], method="pbkdf2:sha256")
    new_user = User(name=data["name"], email=data["email"], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return api_response(True, message=f"User {new_user.name} added successfully!", status_code=201)


@auth_bp.route("/login", methods=["POST"])
def login() -> tuple[Response, int]:
    data = request.json
    if not data:
        return api_response(False, message="Invalid JSON", status_code=400)
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return api_response(False, message="Invalid email or password", status_code=401)

    login_user(user)
    return api_response(True, message=f"Logged in successfully as {user.name}", status_code=200)


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout() -> tuple[Response, int]:
    logout_user()
    return api_response(True, message="Logged out successfully", status_code=200)
