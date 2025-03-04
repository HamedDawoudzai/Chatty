import uuid
from sqlalchemy.orm import Session
from backend.app.models.reaction import Reaction


def add_reaction(db: Session, message_id: uuid.UUID, user_id: uuid.UUID, emoji: str) -> Reaction:
    existing = db.query(Reaction).filter(
        Reaction.message_id == message_id,
        Reaction.user_id == user_id,
        Reaction.emoji == emoji,
    ).first()
    if existing:
        return existing
    r = Reaction(message_id=message_id, user_id=user_id, emoji=emoji)
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


def remove_reaction(db: Session, message_id: uuid.UUID, user_id: uuid.UUID, emoji: str) -> None:
    db.query(Reaction).filter(
        Reaction.message_id == message_id,
        Reaction.user_id == user_id,
        Reaction.emoji == emoji,
    ).delete()
    db.commit()


def get_message_reactions(db: Session, message_id: uuid.UUID) -> list[Reaction]:
    return db.query(Reaction).filter(Reaction.message_id == message_id).all()
