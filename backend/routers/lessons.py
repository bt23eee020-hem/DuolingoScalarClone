from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas, models
from .auth import get_current_user

router = APIRouter(prefix="/api/lessons", tags=["lessons"])

@router.get("/{lesson_id}", response_model=schemas.LessonResponse)
def get_lesson_details(lesson_id: int, db: Session = Depends(get_db)):
    lesson = crud.get_lesson(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

@router.post("/submit-answer", response_model=schemas.SubmitAnswerResponse)
def submit_exercise_answer(
    payload: schemas.SubmitAnswerRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exercise = db.query(models.Exercise).filter(models.Exercise.id == payload.exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
        
    submitted = payload.submitted_answer.strip()
    correct = exercise.correct_answer.strip()
    
    is_correct = False
    
    # Grading logic based on exercise type
    if exercise.type == "MULTIPLE_CHOICE":
        is_correct = submitted.lower() == correct.lower()
    elif exercise.type == "TRANSLATE_WORD_BANK":
        # Check standard normalized word sequence
        is_correct = "".join(submitted.lower().split()) == "".join(correct.lower().split())
    elif exercise.type == "FILL_BLANK":
        is_correct = submitted.lower() == correct.lower()
    elif exercise.type == "TYPE_ANSWER":
        is_correct = submitted.lower() == correct.lower()
    elif exercise.type == "MATCH_PAIRS":
        # match pairs expects both items matched correctly.
        # correct_answer is 'a:b,c:d'
        # user answers can be formatted as 'a:b,c:d' or equivalent sorted comparison
        user_pairs = sorted([p.strip().lower() for p in submitted.split(",") if p])
        correct_pairs = sorted([p.strip().lower() for p in correct.split(",") if p])
        is_correct = user_pairs == correct_pairs
    else:
        is_correct = submitted.lower() == correct.lower()
        
    return {
        "is_correct": is_correct,
        "correct_answer": exercise.correct_answer,
        "explanation": f"The correct answer is: {exercise.correct_answer}" if not is_correct else None
    }

@router.post("/complete", response_model=schemas.CompleteLessonResponse)
def complete_user_lesson(
    payload: schemas.CompleteLessonRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = crud.complete_lesson(
        db=db,
        user_id=current_user.id,
        lesson_id=payload.lesson_id,
        hearts_lost=payload.hearts_lost,
        xp_earned=payload.xp_earned
    )
    if not result:
        raise HTTPException(status_code=404, detail="User or Lesson not found")
    return result
