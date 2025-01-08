from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import all models here so Alembic can detect them
from backend.app.models import user, room, room_member, message  # noqa: F401, E402
