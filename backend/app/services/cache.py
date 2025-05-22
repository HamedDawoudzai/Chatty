import json
import uuid
import redis
from backend.app.core.config import settings

_redis = redis.from_url(settings.REDIS_URL)
ROOM_MEMBERS_TTL = 300


def get_room_members_cached(room_id: uuid.UUID, fetcher) -> list:
    key = f"room_members:{room_id}"
    cached = _redis.get(key)
    if cached:
        return json.loads(cached)
    members = fetcher()
    _redis.setex(key, ROOM_MEMBERS_TTL, json.dumps(members))
    return members


def invalidate_room_members(room_id: uuid.UUID):
    _redis.delete(f"room_members:{room_id}")
