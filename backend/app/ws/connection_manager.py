import asyncio
import uuid
from collections import defaultdict
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self._rooms: dict[str, set[WebSocket]] = defaultdict(set)
        self._user_ws: dict[uuid.UUID, WebSocket] = {}
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket, room_id: str, user_id: uuid.UUID):
        await websocket.accept()
        async with self._lock:
            self._rooms[room_id].add(websocket)
            self._user_ws[user_id] = websocket

    async def disconnect(self, websocket: WebSocket, room_id: str, user_id: uuid.UUID):
        async with self._lock:
            self._rooms[room_id].discard(websocket)
            if not self._rooms[room_id]:
                del self._rooms[room_id]
            self._user_ws.pop(user_id, None)

    async def broadcast(self, room_id: str, message: dict, exclude: WebSocket | None = None):
        dead = []
        for ws in list(self._rooms.get(room_id, [])):
            if ws is exclude:
                continue
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        async with self._lock:
            for ws in dead:
                self._rooms[room_id].discard(ws)

    async def send_to_user(self, user_id: uuid.UUID, message: dict):
        ws = self._user_ws.get(user_id)
        if ws:
            try:
                await ws.send_json(message)
            except Exception:
                self._user_ws.pop(user_id, None)

    def get_room_member_count(self, room_id: str) -> int:
        return len(self._rooms.get(room_id, []))

    def is_user_online(self, user_id: uuid.UUID) -> bool:
        return user_id in self._user_ws


manager = ConnectionManager()
