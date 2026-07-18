from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import crud, schemas, models
from .auth import get_current_user

router = APIRouter(prefix="/api/courses", tags=["courses"])

@router.get("", response_model=List[schemas.CourseResponse])
def get_all_courses(db: Session = Depends(get_db)):
    return crud.get_courses(db)

@router.get("/{course_id}", response_model=schemas.CourseDetailResponse)
def get_course_by_id(course_id: int, db: Session = Depends(get_db)):
    course = crud.get_course_detail(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("/select/{course_id}", response_model=schemas.UserResponse)
def select_course(course_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    course = crud.get_course_detail(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    current_user.current_course_id = course_id
    db.commit()
    db.refresh(current_user)
    return current_user
