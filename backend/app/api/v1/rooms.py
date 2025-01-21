import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.api.deps import get_current_user
from backend.app.schemas.room import RoomCreate, RoomOut, RoomUpdate
from backend.app.crud import room as room_crud
from backend.app.models.user import User
from backend.app.models.room_member import MemberRole

router = APIRouter(prefix="/rooms", tags=["rooms"])


def _room_out(room, db) -> RoomOut:
    count = room_crud.get_room(db, room.id)
    from backend.app.models.room_member import RoomMember
    cnt = db.query(RoomMember).filter(RoomMember.room_id == room.id).count()
    out = RoomOut.model_validate(room)
    out.member_count = cnt
    return out


@router.post("", response_model=RoomOut, status_code=status.HTTP_201_CREATED,
             summary="Create a new room")
def create_room(data: RoomCreate, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    room = room_crud.create_room(db, data, current_user.id)
    return _room_out(room, db)


@router.get("", response_model=list[RoomOut])
def list_rooms(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    rooms = room_crud.list_rooms(db)
    return [_room_out(r, db) for r in rooms]


@router.get("/mine", response_model=list[RoomOut])
def my_rooms(db: Session = Depends(get_db),
             current_user: User = Depends(get_current_user)):
    rooms = room_crud.get_user_rooms(db, current_user.id)
    return [_room_out(r, db) for r in rooms]


@router.get("/{room_id}", response_model=RoomOut)
def get_room(room_id: uuid.UUID, db: Session = Depends(get_db),
             _: User = Depends(get_current_user)):
    room = room_crud.get_room(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return _room_out(room, db)


@router.post("/{room_id}/join", response_model=RoomOut)
def join_room(room_id: uuid.UUID, db: Session = Depends(get_db),
              current_user: User = Depends(get_current_user)):
    room = room_crud.get_room(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    room_crud.join_room(db, room_id, current_user.id)
    return _room_out(room, db)


@router.post("/{room_id}/leave")
def leave_room(room_id: uuid.UUID, db: Session = Depends(get_db),
               current_user: User = Depends(get_current_user)):
    room_crud.leave_room(db, room_id, current_user.id)
    return {"detail": "Left room"}


@router.patch("/{room_id}", response_model=RoomOut)
def update_room(room_id: uuid.UUID, data: RoomUpdate,
                db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    room = room_crud.get_room(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    member = room_crud.get_member(db, room_id, current_user.id)
    if not member or member.role == MemberRole.member:
        raise HTTPException(status_code=403, detail="Admin only")
    return _room_out(room_crud.update_room(db, room, data), db)


@router.delete("/{room_id}/members/{user_id}")
def remove_member(room_id: uuid.UUID, user_id: uuid.UUID,
                  db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_user)):
    member = room_crud.get_member(db, room_id, current_user.id)
    if not member or member.role == MemberRole.member:
        raise HTTPException(status_code=403, detail="Admin only")
    room_crud.remove_member(db, room_id, user_id)
    return {"detail": "Member removed"}


@router.post("/dm", response_model=RoomOut)
def create_dm(target_id: uuid.UUID, db: Session = Depends(get_db),
              current_user: User = Depends(get_current_user)):
    room = room_crud.create_dm(db, current_user.id, target_id)
    return _room_out(room, db)
