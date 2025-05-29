import uuid
from sqlalchemy.orm import Session
from backend.app.crud import room as room_crud
from backend.app.schemas.room import RoomCreate, RoomUpdate
from backend.app.models.room import Room
from backend.app.services.cache import invalidate_room_members


def create_room_service(db: Session, data: RoomCreate, creator_id: uuid.UUID) -> Room:
    room = room_crud.create_room(db, data, creator_id)
    return room


def join_room_service(db: Session, room_id: uuid.UUID, user_id: uuid.UUID):
    invalidate_room_members(room_id)
    return room_crud.join_room(db, room_id, user_id)


def leave_room_service(db: Session, room_id: uuid.UUID, user_id: uuid.UUID):
    invalidate_room_members(room_id)
    room_crud.leave_room(db, room_id, user_id)
