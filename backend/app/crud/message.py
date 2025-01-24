import uuid
from sqlalchemy.orm import Session
from backend.app.models.message import Message
from backend.app.schemas.message import MessageCreate, MessageUpdate


def create_message(db: Session, room_id: uuid.UUID, author_id: uuid.UUID, data: MessageCreate) -> Message:
    msg = Message(room_id=room_id, author_id=author_id,
                  content=data.content, thread_id=data.thread_id)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def get_message(db: Session, message_id: uuid.UUID) -> Message | None:
    return db.query(Message).filter(Message.id == message_id).first()


def get_room_messages(db: Session, room_id: uuid.UUID, limit: int = 50, before_id: uuid.UUID | None = None) -> list[Message]:
    q = (db.query(Message)
         .filter(Message.room_id == room_id, Message.is_deleted == False,
                 Message.thread_id == None)
         .order_by(Message.created_at.desc()))
    if before_id:
        ref = db.query(Message).filter(Message.id == before_id).first()
        if ref:
            q = q.filter(Message.created_at < ref.created_at)
    return list(reversed(q.limit(limit).all()))


def update_message(db: Session, message: Message, data: MessageUpdate) -> Message:
    message.content = data.content
    message.is_edited = True
    db.commit()
    db.refresh(message)
    return message


def delete_message(db: Session, message: Message) -> None:
    message.is_deleted = True
    message.content = "[deleted]"
    db.commit()


def pin_message(db: Session, message: Message, pinned: bool) -> Message:
    message.is_pinned = pinned
    db.commit()
    db.refresh(message)
    return message


def search_messages(db: Session, room_id: uuid.UUID, query: str, limit: int = 20) -> list[Message]:
    return (
        db.query(Message)
        .filter(Message.room_id == room_id, Message.is_deleted == False,
                Message.content.ilike(f"%{query}%"))
        .order_by(Message.created_at.desc())
        .limit(limit)
        .all()
    )


def get_thread_replies(db: Session, thread_id: uuid.UUID) -> list[Message]:
    return (
        db.query(Message)
        .filter(Message.thread_id == thread_id, Message.is_deleted == False)
        .order_by(Message.created_at.asc())
        .all()
    )
