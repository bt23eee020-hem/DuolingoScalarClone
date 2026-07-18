from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Course Schemas
class CourseBase(BaseModel):
    name: str
    language_code: str
    flag_icon: Optional[str] = None

class CourseResponse(CourseBase):
    id: int
    class Config:
        from_attributes = True

# Exercise Options
class ExerciseOptionResponse(BaseModel):
    id: int
    content: str
    is_correct: bool
    order: int
    class Config:
        from_attributes = True

# Exercises
class ExerciseResponse(BaseModel):
    id: int
    lesson_id: int
    type: str  # MULTIPLE_CHOICE, TRANSLATE_WORD_BANK, FILL_BLANK, TYPE_ANSWER, MATCH_PAIRS
    prompt: str
    correct_answer: str
    options: List[ExerciseOptionResponse] = []
    class Config:
        from_attributes = True

# Lessons
class LessonResponse(BaseModel):
    id: int
    skill_id: int
    title: str
    order: int
    xp_reward: int
    exercises: List[ExerciseResponse] = []
    class Config:
        from_attributes = True

# Skills
class SkillResponse(BaseModel):
    id: int
    unit_id: int
    title: str
    description: Optional[str] = None
    icon: str
    order: int
    lessons: List[LessonResponse] = []
    class Config:
        from_attributes = True

# Units
class UnitResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str] = None
    order: int
    skills: List[SkillResponse] = []
    class Config:
        from_attributes = True

# Detailed Course
class CourseDetailResponse(CourseResponse):
    units: List[UnitResponse] = []

# User Progress
class UserSkillProgressResponse(BaseModel):
    id: int
    skill_id: int
    crowns: int
    is_completed: bool
    last_accessed: datetime
    class Config:
        from_attributes = True

# Achievement Schemas
class AchievementResponse(BaseModel):
    id: int
    title: str
    description: str
    icon: str
    target_type: str
    target_value: int
    class Config:
        from_attributes = True

class UserAchievementResponse(BaseModel):
    id: int
    achievement: AchievementResponse
    unlocked_at: datetime
    class Config:
        from_attributes = True

# Leaderboard Schemas
class LeaderboardResponse(BaseModel):
    id: int
    user_id: int
    username: str
    weekly_xp: int
    league_name: str
    rank: Optional[int]
    class Config:
        from_attributes = True

# Daily Goal Schemas
class DailyGoalResponse(BaseModel):
    id: Optional[int] = None
    goal_xp: int
    current_xp: int = 0
    is_met: bool
    date: datetime
    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    streak: int
    hearts: int
    xp: int
    crowns: int
    created_at: datetime
    last_active_at: datetime
    current_course_id: Optional[int] = None
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Submission & Heart/XP update schemas
class SubmitAnswerRequest(BaseModel):
    exercise_id: int
    submitted_answer: str

class SubmitAnswerResponse(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: Optional[str] = None

class CompleteLessonRequest(BaseModel):
    lesson_id: int
    hearts_lost: int
    xp_earned: int

class CompleteLessonResponse(BaseModel):
    xp_earned: int
    hearts_lost: int
    streak_updated: int
    daily_goal_met: bool
    achievements_unlocked: List[AchievementResponse] = []

class UpdateHeartsRequest(BaseModel):
    amount: int  # e.g., -1 for losing, +5 for refill
    change_type: str  # 'LOST', 'GAINED_PRACTICE', 'GAINED_REFILL'

class UpdateXPRequest(BaseModel):
    amount: int
    source: str  # 'LESSON', 'PRACTICE', 'ACHIEVEMENT', 'DAILY_GOAL_BONUS'
