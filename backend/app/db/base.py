from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import all models so Alembic can detect them
from backend.app.models import (  # noqa: F401, E402
    user, room, room_member, message, read_receipt, reaction, notification
)
