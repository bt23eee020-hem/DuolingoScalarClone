from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas, models
from .auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/update-hearts", response_model=schemas.UserResponse)
def update_hearts(
    payload: schemas.UpdateHeartsRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = crud.update_user_hearts(db, current_user.id, payload.amount, payload.change_type)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/update-xp", response_model=schemas.UserResponse)
def update_xp(
    payload: schemas.UpdateXPRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = crud.update_user_xp(db, current_user.id, payload.amount, payload.source)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/daily-goal", response_model=schemas.DailyGoalResponse)
def get_daily_goal(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progress = crud.get_daily_goal_progress(db, current_user.id)
    return progress

@router.post("/daily-goal/set/{goal_xp}", response_model=schemas.DailyGoalResponse)
def set_daily_goal(
    goal_xp: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    dg = crud.init_daily_goal(db, current_user.id, goal_xp)
    dg.goal_xp = goal_xp
    db.commit()
    db.refresh(dg)
    return dg

from pydantic import BaseModel

class ProfileUpdateRequest(BaseModel):
    username: str
    email: str

@router.put("/profile", response_model=schemas.UserResponse)
def update_profile(
    payload: ProfileUpdateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.username != current_user.username:
        conflict = db.query(models.User).filter(models.User.username == payload.username).first()
        if conflict:
            raise HTTPException(status_code=400, detail="Username already taken")
    current_user.username = payload.username
    current_user.email = payload.email
    db.commit()
    db.refresh(current_user)
    return current_user
