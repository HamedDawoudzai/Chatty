import os
import uuid
import aiofiles
from fastapi import UploadFile
from backend.app.core.config import settings


def _sanitize(name: str) -> str:
    import re
    name = os.path.basename(name)
    return re.sub(r"[^\w.\-]", "_", name)[:200]


async def upload_file(file: UploadFile, folder: str = "uploads") -> str:
    if settings.STORAGE_BACKEND == "s3":
        return await _upload_s3(file, folder)
    return await _upload_local(file, folder)


async def _upload_local(file: UploadFile, folder: str) -> str:
    dest_dir = os.path.join(settings.LOCAL_UPLOAD_DIR, folder)
    os.makedirs(dest_dir, exist_ok=True)
    safe_name = _sanitize(file.filename or "upload")
    unique_name = f"{uuid.uuid4().hex}_{safe_name}"
    dest = os.path.join(dest_dir, unique_name)
    async with aiofiles.open(dest, "wb") as out:
        while chunk := await file.read(1024 * 64):
            await out.write(chunk)
    return f"/uploads/{folder}/{unique_name}"


async def _upload_s3(file: UploadFile, folder: str) -> str:
    import boto3
    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )
    safe_name = _sanitize(file.filename or "upload")
    key = f"{folder}/{uuid.uuid4().hex}_{safe_name}"
    contents = await file.read()
    s3.put_object(Bucket=settings.AWS_BUCKET_NAME, Key=key, Body=contents,
                  ContentType=file.content_type or "application/octet-stream")
    return f"https://{settings.AWS_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
