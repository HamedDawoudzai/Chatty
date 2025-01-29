import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.api.deps import get_current_user
from backend.app.schemas.message import MessageOut, MessagePage, MessageUpdate
from backend.app.crud import message as msg_crud
from backend.app.crud import room as room_crud
from backend.app.models.user import User

router = APIRouter(prefix="/messages", tags=["messages"])


def _enrich(msg, db) -> MessageOut:
    out = MessageOut.model_validate(msg)
    if msg.author:
        out.author_username = msg.author.username
        out.author_display_name = msg.author.display_name
        out.author_avatar_url = msg.author.avatar_url
    out.reply_count = msg.replies.count() if hasattr(msg, 'replies') else 0
    return out


@router.get("/rooms/{room_id}", response_model=MessagePage)
def get_messages(room_id: uuid.UUID,
                 limit: int = Query(50, le=100),
                 before: uuid.UUID | None = None,
                 db: Session = Depends(get_db),
                 _: User = Depends(get_current_user)):
    msgs = msg_crud.get_room_messages(db, room_id, limit=limit + 1, before_id=before)
    has_more = len(msgs) > limit
    return MessagePage(items=[_enrich(m, db) for m in msgs[:limit]],
                       total=len(msgs[:limit]), has_more=has_more)


@router.get("/rooms/{room_id}/search", response_model=list[MessageOut])
def search_messages(room_id: uuid.UUID, q: str,
                    db: Session = Depends(get_db),
                    _: User = Depends(get_current_user)):
    msgs = msg_crud.search_messages(db, room_id, q)
    return [_enrich(m, db) for m in msgs]


@router.patch("/{message_id}", response_model=MessageOut)
def edit_message(message_id: uuid.UUID, data: MessageUpdate,
                 db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    msg = msg_crud.get_message(db, message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    if msg.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your message")
    return _enrich(msg_crud.update_message(db, msg, data), db)


@router.delete("/{message_id}")
def delete_message(message_id: uuid.UUID,
                   db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    msg = msg_crud.get_message(db, message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    if msg.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your message")
    msg_crud.delete_message(db, msg)
    return {"detail": "Deleted"}


@router.post("/{message_id}/pin")
def pin_message(message_id: uuid.UUID, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    msg = msg_crud.get_message(db, message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    return _enrich(msg_crud.pin_message(db, msg, True), db)


@router.get("/{message_id}/replies", response_model=list[MessageOut])
def get_replies(message_id: uuid.UUID, db: Session = Depends(get_db),
                _: User = Depends(get_current_user)):
    return [_enrich(m, db) for m in msg_crud.get_thread_replies(db, message_id)]
