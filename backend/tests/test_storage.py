import pytest
from unittest.mock import AsyncMock, patch
from backend.app.services import storage


@pytest.mark.asyncio
async def test_upload_local(tmp_path, monkeypatch):
    monkeypatch.setattr(storage.settings, "STORAGE_BACKEND", "local")
    monkeypatch.setattr(storage.settings, "LOCAL_UPLOAD_DIR", str(tmp_path))
    mock_file = AsyncMock()
    mock_file.filename = "test.txt"
    mock_file.read.side_effect = [b"hello world", b""]
    url = await storage.upload_file(mock_file, "test")
    assert url.startswith("/uploads/test/")
