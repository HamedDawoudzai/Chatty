import uuid
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from backend.app.core.security import decode_token
from backend.app.ws.connection_manager import manager
from backend.app.ws.router import handle_event
from backend.app.ws.events import WSEventType

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    token: str = Query(...),
):
    payload = decode_token(token)
    if not payload:
        await websocket.close(code=4001)
        return
    user_id = uuid.UUID(payload["sub"])
    await manager.connect(websocket, room_id, user_id)
    await manager.broadcast(room_id, {
        "type": WSEventType.PRESENCE_JOIN,
        "user_id": str(user_id),
        "online_count": manager.get_room_member_count(room_id),
    })
    try:
        while True:
            data = await websocket.receive_json()
            event_type = data.get("type")
            payload_data = data.get("payload", {})
            await handle_event(event_type, payload_data, room_id, user_id, manager, websocket)
    except WebSocketDisconnect:
        await manager.disconnect(websocket, room_id, user_id)
        await manager.broadcast(room_id, {
            "type": WSEventType.PRESENCE_LEAVE,
            "user_id": str(user_id),
            "online_count": manager.get_room_member_count(room_id),
        })
    except Exception:
        await manager.disconnect(websocket, room_id, user_id)
