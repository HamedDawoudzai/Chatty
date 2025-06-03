import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def auth_headers(username="profileuser"):
    client.post("/api/v1/auth/register", json={
        "username": username, "email": f"{username}@test.com", "password": "pw"
    })
    r = client.post("/api/v1/auth/login", data={"username": username, "password": "pw"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_get_me():
    headers = auth_headers()
    r = client.get("/api/v1/users/me", headers=headers)
    assert r.status_code == 200
    assert r.json()["username"] == "profileuser"


def test_update_profile():
    headers = auth_headers("updateme")
    r = client.patch("/api/v1/users/me", json={"display_name": "Updated Name"}, headers=headers)
    assert r.status_code == 200
    assert r.json()["display_name"] == "Updated Name"


def test_search_users():
    headers = auth_headers("searchable")
    r = client.get("/api/v1/users/search?q=search", headers=headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)
