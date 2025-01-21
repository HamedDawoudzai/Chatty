import uuid
from sqlalchemy.orm import Session
from backend.app.models.room import Room, RoomType
from backend.app.models.room_member import RoomMember, MemberRole
from backend.app.schemas.room import RoomCreate, RoomUpdate


def create_room(db: Session, data: RoomCreate, creator_id: uuid.UUID) -> Room:
    room = Room(name=data.name, description=data.description,
                type=data.type, created_by=creator_id)
    db.add(room)
    db.flush()
    member = RoomMember(room_id=room.id, user_id=creator_id, role=MemberRole.owner)
    db.add(member)
    db.commit()
    db.refresh(room)
    return room


def get_room(db: Session, room_id: uuid.UUID) -> Room | None:
    return db.query(Room).filter(Room.id == room_id, Room.is_active == True).first()


def list_rooms(db: Session, skip: int = 0, limit: int = 50) -> list[Room]:
    return (db.query(Room)
            .filter(Room.is_active == True, Room.type != RoomType.direct)
            .offset(skip).limit(limit).all())


def get_user_rooms(db: Session, user_id: uuid.UUID) -> list[Room]:
    return (db.query(Room)
            .join(RoomMember, RoomMember.room_id == Room.id)
            .filter(RoomMember.user_id == user_id, Room.is_active == True)
            .all())


def join_room(db: Session, room_id: uuid.UUID, user_id: uuid.UUID) -> RoomMember:
    existing = (db.query(RoomMember)
                .filter(RoomMember.room_id == room_id, RoomMember.user_id == user_id)
                .first())
    if existing:
        return existing
    member = RoomMember(room_id=room_id, user_id=user_id)
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def leave_room(db: Session, room_id: uuid.UUID, user_id: uuid.UUID) -> None:
    db.query(RoomMember).filter(
        RoomMember.room_id == room_id, RoomMember.user_id == user_id
    ).delete()
    db.commit()


def get_member(db: Session, room_id: uuid.UUID, user_id: uuid.UUID) -> RoomMember | None:
    return (db.query(RoomMember)
            .filter(RoomMember.room_id == room_id, RoomMember.user_id == user_id)
            .first())


def update_room(db: Session, room: Room, data: RoomUpdate) -> Room:
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(room, field, value)
    db.commit()
    db.refresh(room)
    return room


def create_dm(db: Session, user1_id: uuid.UUID, user2_id: uuid.UUID) -> Room:
    existing = (
        db.query(Room)
        .join(RoomMember, RoomMember.room_id == Room.id)
        .filter(RoomMember.user_id == user1_id, Room.type == RoomType.direct)
        .all()
    )
    for room in existing:
        ids = {m.user_id for m in db.query(RoomMember).filter(RoomMember.room_id == room.id).all()}
        if ids == {user1_id, user2_id}:
            return room
    room = Room(name="", type=RoomType.direct, created_by=user1_id)
    db.add(room)
    db.flush()
    for uid in [user1_id, user2_id]:
        db.add(RoomMember(room_id=room.id, user_id=uid))
    db.commit()
    db.refresh(room)
    return room


def remove_member(db: Session, room_id: uuid.UUID, user_id: uuid.UUID) -> None:
    db.query(RoomMember).filter(
        RoomMember.room_id == room_id, RoomMember.user_id == user_id
    ).delete()
    db.commit()
