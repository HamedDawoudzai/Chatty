import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def auth_headers(username="msgtestuser"):
    client.post("/api/v1/auth/register", json={
        "username": username, "email": f"{username}@test.com", "password": "pw"
    })
    r = client.post("/api/v1/auth/login", data={"username": username, "password": "pw"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_message_history_pagination():
    headers = auth_headers("msgpager")
    room = client.post("/api/v1/rooms", json={"name": "paginate-room"}, headers=headers).json()
    r = client.get(f"/api/v1/messages/rooms/{room['id']}?limit=10", headers=headers)
    assert r.status_code == 200
    data = r.json()
    assert "items" in data
    assert "has_more" in data
