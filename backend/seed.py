from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend import models, auth_utils
import datetime

def seed_db():
    # Create all tables first
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if database is already seeded
        if db.query(models.Course).first():
            print("Database already seeded.")
            return

        print("Seeding database...")
        
        # 1. Create Achievements
        achievements = [
            models.Achievement(
                title="First Steps",
                description="Earn 20 XP in your learning journey",
                icon="zap",
                target_type="xp",
                target_value=20
            ),
            models.Achievement(
                title="Streak Starter",
                description="Keep a 3-day learning streak",
                icon="flame",
                target_type="streak",
                target_value=3
            ),
            models.Achievement(
                title="Crown Collector",
                description="Earn 3 crowns across your skills",
                icon="crown",
                target_type="crowns",
                target_value=3
            ),
            models.Achievement(
                title="Dedicated Student",
                description="Complete 10 lessons",
                icon="book-open",
                target_type="lessons_completed",
                target_value=10
            )
        ]
        db.add_all(achievements)
        db.commit()

        # 2. Create English Course
        course = models.Course(
            name="English",
            language_code="en",
            flag_icon="🇬🇧"
        )
        db.add(course)
        db.commit()
        db.refresh(course)

        # 3. Create Users
        default_user = models.User(
            username="hemant",
            email="hemant@duolingo.com",
            hashed_password=auth_utils.get_password_hash("password123"),
            streak=2,
            hearts=5,
            xp=15,
            crowns=0,
            current_course_id=course.id,
            last_active_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        )
        db.add(default_user)
        db.commit()
        db.refresh(default_user)

        # Create daily goal for learner
        dg = models.DailyGoal(
            user_id=default_user.id,
            goal_xp=50,
            is_met=False,
            date=datetime.datetime.utcnow()
        )
        db.add(dg)
        
        # Create other users for leaderboard
        leaderboard_users = [
            ("duo_mascot", "duo@duo.com", 1450, 420, 25),
            ("polyglot_alice", "alice@duo.com", 920, 310, 15),
            ("language_master", "master@duo.com", 780, 240, 10),
            ("streak_king", "king@duo.com", 560, 180, 8),
            ("newbie_bob", "bob@duo.com", 110, 45, 1)
        ]
        for username, email, xp, weekly_xp, streak in leaderboard_users:
            u = models.User(
                username=username,
                email=email,
                hashed_password=auth_utils.get_password_hash("password123"),
                streak=streak,
                hearts=5,
                xp=xp,
                crowns=xp // 200,
                current_course_id=course.id
            )
            db.add(u)
            db.commit()
            db.refresh(u)
            
            l = models.Leaderboard(
                user_id=u.id,
                weekly_xp=weekly_xp,
                league_name="Bronze"
            )
            db.add(l)
        
        # Add default learner to leaderboard
        learner_lb = models.Leaderboard(
            user_id=default_user.id,
            weekly_xp=15,
            league_name="Bronze"
        )
        db.add(learner_lb)
        db.commit()

        # Define units
        units_data = [
            ("Unit 1", "Greetings & Introductions", 1),
            ("Unit 2", "Travel & Hotels", 2),
            ("Unit 3", "Daily Work & Shopping", 3)
        ]

        for unit_title, unit_desc, unit_order in units_data:
            unit = models.Unit(
                course_id=course.id,
                title=unit_title,
                description=unit_desc,
                order=unit_order
            )
            db.add(unit)
            db.commit()
            db.refresh(unit)

            # 3 skills per unit
            if unit_order == 1:
                skills_data = [
                    ("Hello", "Basic introductions and common greetings", "message-square", 1),
                    ("Food & Drink", "Order meals and request drinks", "coffee", 2),
                    ("My Family", "Talk about family members and relatives", "users", 3)
                ]
            elif unit_order == 2:
                skills_data = [
                    ("Booking Hotel", "Reserve rooms and check in", "home", 1),
                    ("At the Airport", "Navigate custom lines and ticketing", "plane", 2),
                    ("Directions", "Ask for ways to get around city", "map-pin", 3)
                ]
            else:
                skills_data = [
                    ("Shopping", "Buy items and ask for prices", "shopping-bag", 1),
                    ("Office Talk", "Communicate with colleagues at work", "briefcase", 2),
                    ("Hobbies", "Talk about leisure and sports activities", "activity", 3)
                ]

            for skill_title, skill_desc, skill_icon, skill_order in skills_data:
                skill = models.Skill(
                    unit_id=unit.id,
                    title=skill_title,
                    description=skill_desc,
                    icon=skill_icon,
                    order=skill_order
                )
                db.add(skill)
                db.commit()
                db.refresh(skill)

                # 2 lessons per skill to keep database manageable but rich
                for lesson_order in range(1, 3):
                    lesson = models.Lesson(
                        skill_id=skill.id,
                        title=f"Lesson {lesson_order}: {skill_title} practice",
                        order=lesson_order,
                        xp_reward=15
                    )
                    db.add(lesson)
                    db.commit()
                    db.refresh(lesson)

                    # 6 exercises per lesson
                    # We will add 5 standard exercises:
                    # 1. Multiple Choice
                    # 2. Word Bank Translate
                    # 3. Fill in the blank
                    # 4. Type answer
                    # 5. Match pairs
                    # 6. Another Multiple choice or Fill in blank
                    
                    if skill_title == "Hello":
                        exs = [
                            models.Exercise(
                                type="MULTIPLE_CHOICE",
                                prompt="Select the correct translation for 'Good morning'",
                                correct_answer="Buenos días"
                            ),
                            models.Exercise(
                                type="TRANSLATE_WORD_BANK",
                                prompt="Translate: 'I am a boy'",
                                correct_answer="Yo soy un niño"
                            ),
                            models.Exercise(
                                type="FILL_BLANK",
                                prompt="Completa la frase: Hello, my name ______ Duo.",
                                correct_answer="is"
                            ),
                            models.Exercise(
                                type="TYPE_ANSWER",
                                prompt="Translate to English: 'Gracias'",
                                correct_answer="Thank you"
                            ),
                            models.Exercise(
                                type="MATCH_PAIRS",
                                prompt="Match the greeting pairs",
                                correct_answer="hello:hola,goodbye:adiós,please:por favor,thanks:gracias,morning:mañana"
                            ),
                            models.Exercise(
                                type="MULTIPLE_CHOICE",
                                prompt="Select the correct response: 'How are you?'",
                                correct_answer="I am doing well, thank you"
                            )
                        ]
                    elif skill_title == "Food & Drink":
                        exs = [
                            models.Exercise(
                                type="MULTIPLE_CHOICE",
                                prompt="Choose the word for 'Water'",
                                correct_answer="Agua"
                            ),
                            models.Exercise(
                                type="TRANSLATE_WORD_BANK",
                                prompt="Translate: 'I want a cup of coffee'",
                                correct_answer="Yo quiero una taza de café"
                            ),
                            models.Exercise(
                                type="FILL_BLANK",
                                prompt="Completa la frase: Can I have the ______, please?",
                                correct_answer="menu"
                            ),
                            models.Exercise(
                                type="TYPE_ANSWER",
                                prompt="Translate to English: 'La cuenta, por favor'",
                                correct_answer="The bill, please"
                            ),
                            models.Exercise(
                                type="MATCH_PAIRS",
                                prompt="Match food items",
                                correct_answer="apple:manzana,milk:leche,bread:pan,cheese:queso,water:agua"
                            ),
                            models.Exercise(
                                type="MULTIPLE_CHOICE",
                                prompt="What is 'Desayuno'?",
                                correct_answer="Breakfast"
                            )
                        ]
                    else:
                        # generic exercises for others
                        exs = [
                            models.Exercise(
                                type="MULTIPLE_CHOICE",
                                prompt=f"Translate the key term for {skill_title}",
                                correct_answer="Correct Option A"
                            ),
                            models.Exercise(
                                type="TRANSLATE_WORD_BANK",
                                prompt="Translate: 'This is very important'",
                                correct_answer="Esto es muy importante"
                            ),
                            models.Exercise(
                                type="FILL_BLANK",
                                prompt="Complete the blank: She _______ at the office.",
                                correct_answer="works"
                            ),
                            models.Exercise(
                                type="TYPE_ANSWER",
                                prompt="Translate to English: 'Hola amigo'",
                                correct_answer="Hello friend"
                            ),
                            models.Exercise(
                                type="MATCH_PAIRS",
                                prompt="Match vocabulary",
                                correct_answer="friend:amigo,house:casa,car:carro,city:ciudad,school:escuela"
                            ),
                            models.Exercise(
                                type="MULTIPLE_CHOICE",
                                prompt="Select the synonym for 'Happy'",
                                correct_answer="Glad"
                            )
                        ]

                    for ex in exs:
                        ex.lesson_id = lesson.id
                        db.add(ex)
                        db.commit()
                        db.refresh(ex)

                        # Create Options for exercises
                        if ex.type == "MULTIPLE_CHOICE":
                            if "morning" in ex.prompt:
                                opts = [
                                    models.ExerciseOption(exercise_id=ex.id, content="Buenos días", is_correct=True, order=1),
                                    models.ExerciseOption(exercise_id=ex.id, content="Buenas noches", is_correct=False, order=2),
                                    models.ExerciseOption(exercise_id=ex.id, content="Hola", is_correct=False, order=3)
                                ]
                            elif "How are you" in ex.prompt:
                                opts = [
                                    models.ExerciseOption(exercise_id=ex.id, content="I am doing well, thank you", is_correct=True, order=1),
                                    models.ExerciseOption(exercise_id=ex.id, content="Yes, please", is_correct=False, order=2),
                                    models.ExerciseOption(exercise_id=ex.id, content="See you tomorrow", is_correct=False, order=3)
                                ]
                            elif "Water" in ex.prompt:
                                opts = [
                                    models.ExerciseOption(exercise_id=ex.id, content="Agua", is_correct=True, order=1),
                                    models.ExerciseOption(exercise_id=ex.id, content="Vino", is_correct=False, order=2),
                                    models.ExerciseOption(exercise_id=ex.id, content="Leche", is_correct=False, order=3)
                                ]
                            elif "Desayuno" in ex.prompt:
                                opts = [
                                    models.ExerciseOption(exercise_id=ex.id, content="Breakfast", is_correct=True, order=1),
                                    models.ExerciseOption(exercise_id=ex.id, content="Dinner", is_correct=False, order=2),
                                    models.ExerciseOption(exercise_id=ex.id, content="Lunch", is_correct=False, order=3)
                                ]
                            else:
                                opts = [
                                    models.ExerciseOption(exercise_id=ex.id, content="Correct Option A", is_correct=True, order=1),
                                    models.ExerciseOption(exercise_id=ex.id, content="Wrong Option B", is_correct=False, order=2),
                                    models.ExerciseOption(exercise_id=ex.id, content="Wrong Option C", is_correct=False, order=3)
                                ]
                            db.add_all(opts)
                        
                        elif ex.type == "TRANSLATE_WORD_BANK":
                            # Options are the word bank chips
                            if "boy" in ex.prompt:
                                chips = ["Yo", "soy", "un", "niño", "ella", "manzana", "agua", "café"]
                            elif "coffee" in ex.prompt:
                                chips = ["Yo", "quiero", "una", "taza", "de", "café", "leche", "por", "favor"]
                            else:
                                chips = ["Esto", "es", "muy", "importante", "amigo", "casa", "comida"]
                            for o_idx, chip in enumerate(chips, 1):
                                opt = models.ExerciseOption(exercise_id=ex.id, content=chip, is_correct=False, order=o_idx)
                                db.add(opt)
                        
                        elif ex.type == "MATCH_PAIRS":
                            # Options contain pairs to match
                            pairs = ex.correct_answer.split(",")
                            o_idx = 1
                            for pair in pairs:
                                left, right = pair.split(":")
                                opt_left = models.ExerciseOption(exercise_id=ex.id, content=left, is_correct=False, order=o_idx)
                                opt_right = models.ExerciseOption(exercise_id=ex.id, content=right, is_correct=False, order=o_idx + 1)
                                db.add(opt_left)
                                db.add(opt_right)
                                o_idx += 2
                        
                        elif ex.type == "FILL_BLANK":
                            # Options can be suggestions
                            if "Duo" in ex.prompt:
                                suggs = ["is", "am", "are"]
                            elif "menu" in ex.prompt:
                                suggs = ["menu", "water", "bill"]
                            else:
                                suggs = ["works", "work", "working"]
                            for o_idx, sg in enumerate(suggs, 1):
                                opt = models.ExerciseOption(exercise_id=ex.id, content=sg, is_correct=(sg == ex.correct_answer), order=o_idx)
                                db.add(opt)
                        
                        # Commit options
                        db.commit()

        print("Database seeded successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
