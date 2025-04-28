import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def auth_headers(username="roomtestuser"):
    client.post("/api/v1/auth/register", json={
        "username": username, "email": f"{username}@test.com", "password": "pw"
    })
    r = client.post("/api/v1/auth/login", data={"username": username, "password": "pw"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_create_and_list_room():
    headers = auth_headers()
    r = client.post("/api/v1/rooms", json={"name": "general"}, headers=headers)
    assert r.status_code == 201
    room_id = r.json()["id"]
    rooms = client.get("/api/v1/rooms", headers=headers).json()
    assert any(rm["id"] == room_id for rm in rooms)


def test_join_room():
    h1 = auth_headers("joiner1")
    h2 = auth_headers("joiner2")
    room = client.post("/api/v1/rooms", json={"name": "joinable"}, headers=h1).json()
    r = client.post(f"/api/v1/rooms/{room['id']}/join", headers=h2)
    assert r.status_code == 200
