import pytest
from flask import json
from werkzeug.security import generate_password_hash
from server.models.user import User
from server.core.extensions import db

@pytest.fixture
def test_user():
    user = User(
        name="Test User",
        email="test@example.com",
        password=generate_password_hash("password123", method="pbkdf2:sha256"),
    )
    db.session.add(user)
    db.session.commit()
    yield user
    db.session.delete(user)
    db.session.commit()


def test_register_success(client):
    response = client.post(
        "/register",
        json={
            "name": "New User",
            "email": "newuser@example.com",
            "password": "newpassword123",
        },
    )
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["success"] is True
    assert "User New User added successfully!" in data["message"]


def test_register_missing_fields(client):
    response = client.post("/register", json={"name": "Incomplete User"})
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data["success"] is False
    assert "Missing required fields" in data["message"]


def test_register_email_exists(client, test_user):
    response = client.post(
        "/register",
        json={
            "name": "Duplicate User",
            "email": test_user.email,
            "password": "password123",
        },
    )
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data["success"] is False
    assert "Email already exists" in data["message"]


def test_login_success(client, test_user):
    response = client.post(
        "/login",
        json={"email": test_user.email, "password": "password123"},
    )
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["success"] is True
    assert "Logged in successfully" in data["message"]


def test_login_invalid_credentials(client):
    response = client.post(
        "/login",
        json={"email": "nonexistent@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    data = json.loads(response.data)
    assert data["success"] is False
    assert "Invalid credentials" in data["message"]


def test_logout_success(client, test_user, login_user):
    response = client.post("/logout")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["success"] is True
    assert "Logged out successfully" in data["message"]