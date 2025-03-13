from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel
from backend.app.api.deps import get_current_user
from backend.app.models.user import User
from backend.app.services.storage import upload_file
from backend.app.core.config import settings

router = APIRouter(prefix="/files", tags=["files"])


class FileUploadOut(BaseModel):
    url: str
    filename: str


@router.post("/upload", response_model=FileUploadOut)
async def upload(
    file: UploadFile = File(...),
    _: User = Depends(get_current_user),
):
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    contents = await file.read(max_bytes + 1)
    if len(contents) > max_bytes:
        raise HTTPException(status_code=413, detail=f"File exceeds {settings.MAX_FILE_SIZE_MB}MB limit")
    await file.seek(0)
    url = await upload_file(file, folder="attachments")
    return FileUploadOut(url=url, filename=file.filename or "file")
