import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Float, Table
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    streak = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    xp = Column(Integer, default=0)
    crowns = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_active_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    current_course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)

    # Relationships
    current_course = relationship("Course", foreign_keys=[current_course_id])
    skill_progress = relationship("UserSkillProgress", back_populates="user", cascade="all, delete-orphan")
    lesson_attempts = relationship("LessonAttempt", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    leaderboards = relationship("Leaderboard", back_populates="user", cascade="all, delete-orphan")
    daily_goals = relationship("DailyGoal", back_populates="user", cascade="all, delete-orphan")
    heart_history = relationship("HeartHistory", back_populates="user", cascade="all, delete-orphan")
    xp_history = relationship("XPHistory", back_populates="user", cascade="all, delete-orphan")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    language_code = Column(String, nullable=False)  # e.g., 'es', 'fr', 'en'
    flag_icon = Column(String, nullable=True)        # emoji or icon name

    # Relationships
    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    order = Column(Integer, default=0)

    # Relationships
    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    icon = Column(String, default="book")  # Icon indicator
    order = Column(Integer, default=0)

    # Relationships
    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete-orphan")
    user_progress = relationship("UserSkillProgress", back_populates="skill", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    order = Column(Integer, default=0)
    xp_reward = Column(Integer, default=10)

    # Relationships
    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan")
    attempts = relationship("LessonAttempt", back_populates="lesson", cascade="all, delete-orphan")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    type = Column(String, nullable=False)  # MULTIPLE_CHOICE, TRANSLATE_WORD_BANK, FILL_BLANK, TYPE_ANSWER, MATCH_PAIRS
    prompt = Column(String, nullable=False)
    correct_answer = Column(String, nullable=False)  # Solution representation or pair mapping

    # Relationships
    lesson = relationship("Lesson", back_populates="exercises")
    options = relationship("ExerciseOption", back_populates="exercise", cascade="all, delete-orphan")


class ExerciseOption(Base):
    __tablename__ = "exercise_options"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    content = Column(String, nullable=False)
    is_correct = Column(Boolean, default=False)
    order = Column(Integer, default=0)

    # Relationships
    exercise = relationship("Exercise", back_populates="options")


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    crowns = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    last_accessed = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="skill_progress")
    skill = relationship("Skill", back_populates="user_progress")


class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    is_completed = Column(Boolean, default=False)
    xp_earned = Column(Integer, default=0)
    hearts_lost = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="lesson_attempts")
    lesson = relationship("Lesson", back_populates="attempts")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    icon = Column(String, default="award")
    target_type = Column(String, nullable=False)  # 'xp', 'streak', 'lessons_completed', 'crowns'
    target_value = Column(Integer, nullable=False)

    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")


class Leaderboard(Base):
    __tablename__ = "leaderboards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    weekly_xp = Column(Integer, default=0)
    league_name = Column(String, default="Bronze")  # Bronze, Silver, Gold, Sapphire, Ruby
    rank = Column(Integer, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="leaderboards")


class DailyGoal(Base):
    __tablename__ = "daily_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    goal_xp = Column(Integer, default=50)
    is_met = Column(Boolean, default=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="daily_goals")


class HeartHistory(Base):
    __tablename__ = "heart_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)  # e.g., -1, +1, +5
    change_type = Column(String, nullable=False)  # 'LOST', 'GAINED_PRACTICE', 'GAINED_REFILL'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="heart_history")


class XPHistory(Base):
    __tablename__ = "xp_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    source = Column(String, nullable=False)  # 'LESSON', 'PRACTICE', 'ACHIEVEMENT', 'DAILY_GOAL_BONUS'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="xp_history")
