from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routers import auth, courses, lessons, users, leaderboard, achievements
from backend.seed import seed_db

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Duolingo Clone API",
    description="Backend API for Duolingo Clone SDE Assignment",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add other origins as needed
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(lessons.router)
app.include_router(users.router)
app.include_router(leaderboard.router)
app.include_router(achievements.router)

@app.on_event("startup")
async def startup_event():
    # Seed DB if empty
    seed_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Duolingo Clone REST API. Go to /docs for Swagger UI API docs."}
