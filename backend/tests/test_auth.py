import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_register_and_login():
    reg = client.post("/api/v1/auth/register", json={
        "username": "testuser", "email": "test@example.com", "password": "secret123"
    })
    assert reg.status_code == 201
    assert reg.json()["username"] == "testuser"

    login = client.post("/api/v1/auth/login", data={
        "username": "testuser", "password": "secret123"
    })
    assert login.status_code == 200
    assert "access_token" in login.json()


def test_register_duplicate_email():
    client.post("/api/v1/auth/register", json={
        "username": "user2", "email": "dup@example.com", "password": "pw"
    })
    res = client.post("/api/v1/auth/register", json={
        "username": "user3", "email": "dup@example.com", "password": "pw"
    })
    assert res.status_code == 400


def test_login_wrong_password():
    res = client.post("/api/v1/auth/login", data={
        "username": "testuser", "password": "wrongpassword"
    })
    assert res.status_code == 401
