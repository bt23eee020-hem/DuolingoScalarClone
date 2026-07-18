from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import crud, schemas, models
from .auth import get_current_user

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

@router.get("", response_model=List[schemas.LeaderboardResponse])
def get_leaderboard(
    league: str = "Bronze",
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_leaderboards(db, league)
