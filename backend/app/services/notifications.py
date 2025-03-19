import json
import uuid
import redis
from backend.app.core.config import settings

_redis = redis.from_url(settings.REDIS_URL)


def publish_notification(user_id: uuid.UUID, type_: str, title: str, body: str = "", data: dict | None = None):
    payload = json.dumps({
        "user_id": str(user_id),
        "type": type_,
        "title": title,
        "body": body,
        "data": data or {},
    })
    _redis.publish(f"notifications:{user_id}", payload)


def notify_mention(mentioned_user_id: uuid.UUID, from_username: str, room_name: str, message_id: str):
    publish_notification(
        mentioned_user_id,
        type_="mention",
        title=f"@{from_username} mentioned you in #{room_name}",
        data={"message_id": message_id},
    )
