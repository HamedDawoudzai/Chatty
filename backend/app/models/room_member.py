import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, DateTime, Enum, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from backend.app.db.base import Base
import enum


class MemberRole(str, enum.Enum):
    member = "member"
    admin = "admin"
    owner = "owner"


class RoomMember(Base):
    __tablename__ = "room_members"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role: Mapped[MemberRole] = mapped_column(Enum(MemberRole), default=MemberRole.member)
    is_muted: Mapped[bool] = mapped_column(Boolean, default=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    room = relationship("Room", back_populates="members")
    user = relationship("User", back_populates="memberships")
