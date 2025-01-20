import uuid
from datetime import datetime
from pydantic import BaseModel
from backend.app.models.room import RoomType


class RoomCreate(BaseModel):
    name: str
    description: str | None = None
    type: RoomType = RoomType.public


class RoomUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class RoomOut(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None
    type: RoomType
    created_by: uuid.UUID
    created_at: datetime
    member_count: int = 0

    model_config = {"from_attributes": True}
