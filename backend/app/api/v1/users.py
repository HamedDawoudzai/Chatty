import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.api.deps import get_current_user
from backend.app.schemas.user import UserOut, UserUpdate
from backend.app.crud.user import get_user, update_user, search_users
from backend.app.models.user import User
from backend.app.services.storage import upload_file

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserOut)
def update_me(data: UserUpdate, db: Session = Depends(get_db),
              current_user: User = Depends(get_current_user)):
    return update_user(db, current_user, data)


@router.post("/me/avatar", response_model=UserOut)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    url = await upload_file(file, folder="avatars")
    return update_user(db, current_user, UserUpdate(avatar_url=url))


@router.get("/search", response_model=list[UserOut])
def search(q: str, db: Session = Depends(get_db),
           _: User = Depends(get_current_user)):
    return search_users(db, q)


@router.get("/{user_id}", response_model=UserOut)
def get_user_profile(user_id: uuid.UUID, db: Session = Depends(get_db),
                     _: User = Depends(get_current_user)):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
