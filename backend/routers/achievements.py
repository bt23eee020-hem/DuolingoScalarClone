from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from .. import crud, schemas, models
from .auth import get_current_user

router = APIRouter(prefix="/api/achievements", tags=["achievements"])

@router.get("")
def get_user_achievements_status(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = crud.get_achievements(db, current_user.id)
    return [
        {
            "id": item["achievement"].id,
            "title": item["achievement"].title,
            "description": item["achievement"].description,
            "icon": item["achievement"].icon,
            "target_type": item["achievement"].target_type,
            "target_value": item["achievement"].target_value,
            "unlocked": item["unlocked"],
            "unlocked_at": item["unlocked_at"]
        }
        for item in results
    ]
