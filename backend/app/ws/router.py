import uuid
from backend.app.ws.events import WSEventType
from backend.app.ws.connection_manager import ConnectionManager
from backend.app.db.session import SessionLocal
from backend.app.crud import message as msg_crud
from backend.app.schemas.message import MessageCreate


async def handle_event(
    event_type: str,
    payload: dict,
    room_id: str,
    user_id: uuid.UUID,
    manager: ConnectionManager,
    websocket,
):
    if event_type == WSEventType.MESSAGE_NEW:
        db = SessionLocal()
        try:
            msg = msg_crud.create_message(
                db, uuid.UUID(room_id), user_id,
                MessageCreate(content=payload.get("content", ""),
                              thread_id=payload.get("thread_id"))
            )
            user = msg.author
            out = {
                "type": WSEventType.MESSAGE_NEW,
                "message": {
                    "id": str(msg.id),
                    "room_id": str(msg.room_id),
                    "author_id": str(msg.author_id),
                    "content": msg.content,
                    "is_edited": msg.is_edited,
                    "created_at": msg.created_at.isoformat(),
                    "author_username": user.username if user else None,
                    "author_avatar_url": user.avatar_url if user else None,
                },
            }
            await manager.broadcast(room_id, out)
        finally:
            db.close()

    elif event_type == WSEventType.TYPING_START:
        await manager.broadcast(room_id, {
            "type": WSEventType.TYPING_START,
            "user_id": str(user_id),
            "username": payload.get("username"),
        }, exclude=websocket)

    elif event_type == WSEventType.TYPING_STOP:
        await manager.broadcast(room_id, {
            "type": WSEventType.TYPING_STOP,
            "user_id": str(user_id),
        }, exclude=websocket)

    elif event_type == WSEventType.READ_RECEIPT:
        await manager.broadcast(room_id, {
            "type": WSEventType.READ_RECEIPT,
            "user_id": str(user_id),
            "message_id": payload.get("message_id"),
        }, exclude=websocket)
