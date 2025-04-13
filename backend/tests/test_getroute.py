# def test_placeholder():
#     assert True  # This test always passes, replace with real tests later

import pytest
from unittest.mock import patch, Mock
from flask import Flask
from server.routes.route_service import route_service_bp, call_ors_api


@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(route_service_bp)
    app.config["TESTING"] = True
    return app.test_client()


def test_missing_start_or_dest_returns_400(client):
    response = client.post("/get_route", json={})
    data = response.get_json()

    assert response.status_code == 400
    assert data["success"] is False
    assert "missing" in data["message"]


def test_invalid_coordinates_return_400(client):
    payload = {
        "start": {"lat": "not_a_number", "lng": 8.4},
        "dest": {"lat": 49.01, "lng": 8.41}
    }
    response = client.post("/get_route", json=payload)
    data = response.get_json()

    assert response.status_code == 400
    assert data["success"] is False
    assert "Invalid coordinates" in data["message"]



@patch("server.routes.route_service.requests.get")
def test_call_ors_api_raises_on_failure(mock_get):
    mock_response = Mock()
    mock_response.raise_for_status.side_effect = Exception("Bad Request")
    mock_get.return_value = mock_response

    with pytest.raises(Exception):
        call_ors_api(8.4, 49.0, 8.41, 49.01)

def test_valid_coordinates_return_200(client):
    payload = {
        "start": {"lat": 49.0, "lng": 8.4},
        "dest": {"lat": 49.01, "lng": 8.41}
    }
    response = client.post("/get_route", json=payload)
    data = response.get_json()

    assert response.status_code == 200
    assert data["success"] is True
    # assert "route" in data


def test_missing_start_returns_400(client):
    payload = {
        "dest": {"lat": 49.01, "lng": 8.41}
    }
    response = client.post("/get_route", json=payload)
    data = response.get_json()

    assert response.status_code == 400
    assert data["success"] is False
    assert "missing" in data["message"]


def test_missing_dest_returns_400(client):
    payload = {
        "start": {"lat": 49.0, "lng": 8.4}
    }
    response = client.post("/get_route", json=payload)
    data = response.get_json()

    assert response.status_code == 400
    assert data["success"] is False
    assert "missing" in data["message"]


def test_empty_payload_returns_400(client):
    response = client.post("/get_route", json={})
    data = response.get_json()

    assert response.status_code == 400
    assert data["success"] is False
    assert "missing" in data["message"]


@patch("server.routes.route_service.requests.get")
def test_call_ors_api_returns_valid_response(mock_get):
    mock_response = Mock()
    mock_response.raise_for_status.return_value = None
    mock_response.json.return_value = {"routes": [{"summary": "test route"}]}
    mock_get.return_value = mock_response

    result = call_ors_api(8.4, 49.0, 8.41, 49.01)

    assert "routes" in result
    assert result["routes"][0]["summary"] == "test route"
