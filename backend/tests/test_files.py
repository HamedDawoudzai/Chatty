import pytest
from fastapi.testclient import TestClient
from io import BytesIO
from backend.main import app

client = TestClient(app)


def auth_headers(username="fileuploader"):
    client.post("/api/v1/auth/register", json={
        "username": username, "email": f"{username}@test.com", "password": "pw"
    })
    r = client.post("/api/v1/auth/login", data={"username": username, "password": "pw"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_file_upload(tmp_path, monkeypatch):
    import backend.app.services.storage as st
    monkeypatch.setattr(st.settings, "STORAGE_BACKEND", "local")
    monkeypatch.setattr(st.settings, "LOCAL_UPLOAD_DIR", str(tmp_path))
    headers = auth_headers()
    data = BytesIO(b"test file content")
    r = client.post(
        "/api/v1/files/upload",
        files={"file": ("test.txt", data, "text/plain")},
        headers=headers,
    )
    assert r.status_code == 200
    assert "url" in r.json()
