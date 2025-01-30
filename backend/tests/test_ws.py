import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def get_token(username="wsuser"):
    client.post("/api/v1/auth/register", json={
        "username": username, "email": f"{username}@test.com", "password": "pw"
    })
    r = client.post("/api/v1/auth/login", data={"username": username, "password": "pw"})
    return r.json()["access_token"]


def test_websocket_connect():
    token = get_token("wsuser1")
    with client.websocket_connect(f"/api/v1/ws/test-room?token={token}") as ws:
        data = ws.receive_json()
        assert data["type"] == "presence.join"
