import uuid
from datetime import datetime
from pydantic import BaseModel


class MessageCreate(BaseModel):
    content: str
    thread_id: uuid.UUID | None = None


class MessageUpdate(BaseModel):
    content: str


class MessageOut(BaseModel):
    id: uuid.UUID
    room_id: uuid.UUID
    author_id: uuid.UUID | None
    content: str
    thread_id: uuid.UUID | None = None
    attachment_url: str | None = None
    attachment_name: str | None = None
    is_pinned: bool = False
    is_edited: bool = False
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime
    author_username: str | None = None
    author_display_name: str | None = None
    author_avatar_url: str | None = None
    reply_count: int = 0

    model_config = {"from_attributes": True}


class MessagePage(BaseModel):
    items: list[MessageOut]
    total: int
    cursor: str | None = None
    has_more: bool = False
