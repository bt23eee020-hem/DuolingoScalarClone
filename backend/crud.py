import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas, auth_utils

# User Operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth_utils.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        streak=0,
        hearts=5,
        xp=0,
        crowns=0
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Initialize daily goal for today
    init_daily_goal(db, db_user.id)
    
    # Initialize leaderboard entry
    leaderboard_entry = models.Leaderboard(
        user_id=db_user.id,
        weekly_xp=0,
        league_name="Bronze"
    )
    db.add(leaderboard_entry)
    db.commit()
    
    return db_user

def init_daily_goal(db: Session, user_id: int, goal_xp: int = 50):
    today = datetime.datetime.utcnow().date()
    # Check if exists
    existing = db.query(models.DailyGoal).filter(
        models.DailyGoal.user_id == user_id,
        func.date(models.DailyGoal.date) == today
    ).first()
    if not existing:
        dg = models.DailyGoal(user_id=user_id, goal_xp=goal_xp, is_met=False, date=datetime.datetime.utcnow())
        db.add(dg)
        db.commit()
        return dg
    return existing

# Course Operations
def get_courses(db: Session):
    return db.query(models.Course).all()

def get_course_detail(db: Session, course_id: int):
    return db.query(models.Course).filter(models.Course.id == course_id).first()

# Progress and Lessons
def get_lesson(db: Session, lesson_id: int):
    return db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()

def update_user_hearts(db: Session, user_id: int, amount: int, change_type: str):
    user = get_user(db, user_id)
    if not user:
        return None
    user.hearts = max(0, min(5, user.hearts + amount))
    
    # Log heart change
    history = models.HeartHistory(
        user_id=user_id,
        amount=amount,
        change_type=change_type,
        created_at=datetime.datetime.utcnow()
    )
    db.add(history)
    db.commit()
    db.refresh(user)
    return user

def update_user_xp(db: Session, user_id: int, amount: int, source: str):
    user = get_user(db, user_id)
    if not user:
        return None
    user.xp += amount
    
    # Log XP change
    history = models.XPHistory(
        user_id=user_id,
        amount=amount,
        source=source,
        created_at=datetime.datetime.utcnow()
    )
    db.add(history)
    
    # Also update weekly leaderboard XP
    leaderboard = db.query(models.Leaderboard).filter(models.Leaderboard.user_id == user_id).first()
    if leaderboard:
        leaderboard.weekly_xp += amount
    else:
        leaderboard = models.Leaderboard(user_id=user_id, weekly_xp=amount, league_name="Bronze")
        db.add(leaderboard)

    # Check daily goals
    today = datetime.datetime.utcnow().date()
    dg = db.query(models.DailyGoal).filter(
        models.DailyGoal.user_id == user_id,
        func.date(models.DailyGoal.date) == today
    ).first()
    if not dg:
        dg = models.DailyGoal(user_id=user_id, goal_xp=50, is_met=False, date=datetime.datetime.utcnow())
        db.add(dg)
        db.commit()
        db.refresh(dg)
    
    # Sum XP earned today
    today_xp = db.query(func.sum(models.XPHistory.amount)).filter(
        models.XPHistory.user_id == user_id,
        func.date(models.XPHistory.created_at) == today
    ).scalar() or 0
    
    if today_xp >= dg.goal_xp:
        dg.is_met = True

    db.commit()
    db.refresh(user)
    return user

def complete_lesson(db: Session, user_id: int, lesson_id: int, hearts_lost: int, xp_earned: int):
    user = get_user(db, user_id)
    lesson = get_lesson(db, lesson_id)
    if not user or not lesson:
        return None
        
    # Record attempt
    attempt = models.LessonAttempt(
        user_id=user_id,
        lesson_id=lesson_id,
        is_completed=True,
        xp_earned=xp_earned,
        hearts_lost=hearts_lost,
        created_at=datetime.datetime.utcnow()
    )
    db.add(attempt)
    
    # Update hearts & XP
    if hearts_lost > 0:
        user.hearts = max(0, user.hearts - hearts_lost)
        hh = models.HeartHistory(user_id=user_id, amount=-hearts_lost, change_type="LOST", created_at=datetime.datetime.utcnow())
        db.add(hh)
        
    user.xp += xp_earned
    xph = models.XPHistory(user_id=user_id, amount=xp_earned, source="LESSON", created_at=datetime.datetime.utcnow())
    db.add(xph)
    
    # Leaderboard weekly XP update
    leaderboard = db.query(models.Leaderboard).filter(models.Leaderboard.user_id == user_id).first()
    if leaderboard:
        leaderboard.weekly_xp += xp_earned
    else:
        leaderboard = models.Leaderboard(user_id=user_id, weekly_xp=xp_earned, league_name="Bronze")
        db.add(leaderboard)

    # Streak logic
    now = datetime.datetime.utcnow()
    today_date = now.date()
    if user.last_active_at:
        last_active_date = user.last_active_at.date()
        diff = (today_date - last_active_date).days
        if diff == 1:
            user.streak += 1
        elif diff > 1:
            user.streak = 1
        # if diff == 0, streak remains same (already active today)
    else:
        user.streak = 1
        
    user.last_active_at = now
    
    # Skill progress check
    skill = lesson.skill
    progress = db.query(models.UserSkillProgress).filter(
        models.UserSkillProgress.user_id == user_id,
        models.UserSkillProgress.skill_id == skill.id
    ).first()
    
    if not progress:
        progress = models.UserSkillProgress(user_id=user_id, skill_id=skill.id, crowns=0, is_completed=False)
        db.add(progress)
        db.commit()
        db.refresh(progress)
        
    # Check if all lessons in the skill are completed
    total_lessons = db.query(func.count(models.Lesson.id)).filter(models.Lesson.skill_id == skill.id).scalar() or 0
    completed_lessons_count = db.query(func.count(func.distinct(models.LessonAttempt.lesson_id))).filter(
        models.LessonAttempt.user_id == user_id,
        models.LessonAttempt.is_completed == True,
        models.LessonAttempt.lesson_id.in_(
            db.query(models.Lesson.id).filter(models.Lesson.skill_id == skill.id)
        )
    ).scalar() or 0
    
    if completed_lessons_count >= total_lessons and not progress.is_completed:
        progress.is_completed = True
        progress.crowns += 1
        user.crowns += 1
        
    # Daily goal check
    dg = db.query(models.DailyGoal).filter(
        models.DailyGoal.user_id == user_id,
        func.date(models.DailyGoal.date) == today_date
    ).first()
    if not dg:
        dg = models.DailyGoal(user_id=user_id, goal_xp=50, is_met=False, date=datetime.datetime.utcnow())
        db.add(dg)
        db.commit()
        db.refresh(dg)
        
    today_xp = db.query(func.sum(models.XPHistory.amount)).filter(
        models.XPHistory.user_id == user_id,
        func.date(models.XPHistory.created_at) == today_date
    ).scalar() or 0
    
    daily_goal_met = False
    if today_xp >= dg.goal_xp:
        dg.is_met = True
        daily_goal_met = True
        
    # Check Achievements
    unlocked = []
    achievements = db.query(models.Achievement).all()
    user_achievement_ids = [ua.achievement_id for ua in user.achievements]
    
    for ach in achievements:
        if ach.id in user_achievement_ids:
            continue
            
        should_unlock = False
        if ach.target_type == "xp" and user.xp >= ach.target_value:
            should_unlock = True
        elif ach.target_type == "streak" and user.streak >= ach.target_value:
            should_unlock = True
        elif ach.target_type == "crowns" and user.crowns >= ach.target_value:
            should_unlock = True
        elif ach.target_type == "lessons_completed":
            total_completed = db.query(func.count(models.LessonAttempt.id)).filter(
                models.LessonAttempt.user_id == user_id,
                models.LessonAttempt.is_completed == True
            ).scalar() or 0
            if total_completed >= ach.target_value:
                should_unlock = True
                
        if should_unlock:
            ua = models.UserAchievement(user_id=user_id, achievement_id=ach.id, unlocked_at=datetime.datetime.utcnow())
            db.add(ua)
            unlocked.append(ach)
            
    db.commit()
    db.refresh(user)
    
    return {
        "xp_earned": xp_earned,
        "hearts_lost": hearts_lost,
        "streak_updated": user.streak,
        "daily_goal_met": daily_goal_met,
        "achievements_unlocked": unlocked
    }

# Leaderboard Rankings
def get_leaderboards(db: Session, league_name: str = "Bronze"):
    # Query list of weekly xp for all users in league
    entries = db.query(models.Leaderboard).filter(models.Leaderboard.league_name == league_name).order_by(models.Leaderboard.weekly_xp.desc()).all()
    results = []
    for rank, entry in enumerate(entries, 1):
        entry.rank = rank
        db.commit()
        results.append({
            "id": entry.id,
            "user_id": entry.user_id,
            "username": entry.user.username,
            "weekly_xp": entry.weekly_xp,
            "league_name": entry.league_name,
            "rank": rank
        })
    return results

# Achievements
def get_achievements(db: Session, user_id: int):
    # Fetch all achievements, indicating if user unlocked them
    all_ach = db.query(models.Achievement).all()
    user_unlocked = db.query(models.UserAchievement).filter(models.UserAchievement.user_id == user_id).all()
    unlocked_ids = {ua.achievement_id: ua.unlocked_at for ua in user_unlocked}
    
    results = []
    for ach in all_ach:
        results.append({
            "achievement": ach,
            "unlocked": ach.id in unlocked_ids,
            "unlocked_at": unlocked_ids.get(ach.id)
        })
    return results

# Daily Goal Progress
def get_daily_goal_progress(db: Session, user_id: int):
    today_date = datetime.datetime.utcnow().date()
    dg = db.query(models.DailyGoal).filter(
        models.DailyGoal.user_id == user_id,
        func.date(models.DailyGoal.date) == today_date
    ).first()
    if not dg:
        dg = init_daily_goal(db, user_id)
        
    today_xp = db.query(func.sum(models.XPHistory.amount)).filter(
        models.XPHistory.user_id == user_id,
        func.date(models.XPHistory.created_at) == today_date
    ).scalar() or 0
    
    return {
        "goal_xp": dg.goal_xp,
        "current_xp": today_xp,
        "is_met": dg.is_met,
        "date": dg.date
    }
