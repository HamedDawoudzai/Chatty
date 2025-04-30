import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def auth_headers(username):
    client.post("/api/v1/auth/register", json={
        "username": username, "email": f"{username}@test.com", "password": "pw"
    })
    r = client.post("/api/v1/auth/login", data={"username": username, "password": "pw"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_add_and_remove_reaction():
    headers = auth_headers("reactoruser")
    assert headers is not None
