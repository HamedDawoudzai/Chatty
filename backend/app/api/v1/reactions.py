import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.app.db.session import get_db
from backend.app.api.deps import get_current_user
from backend.app.crud import reaction as rx_crud
from backend.app.models.user import User

router = APIRouter(prefix="/reactions", tags=["reactions"])


class ReactionIn(BaseModel):
    emoji: str


@router.post("/messages/{message_id}")
def add_reaction(message_id: uuid.UUID, data: ReactionIn,
                 db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    return rx_crud.add_reaction(db, message_id, current_user.id, data.emoji)


@router.delete("/messages/{message_id}")
def remove_reaction(message_id: uuid.UUID, data: ReactionIn,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    rx_crud.remove_reaction(db, message_id, current_user.id, data.emoji)
    return {"detail": "Removed"}
