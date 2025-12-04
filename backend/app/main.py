from contextlib import asynccontextmanager
import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core import config
from app.core.database import verify_supabase_connection
from app.core.security import get_current_user
from app.api.routers import courses, lectures, notes, quiz

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Check for JWT Secret
    if not os.getenv("SUPABASE_JWT_SECRET"):
        print("WARNING: SUPABASE_JWT_SECRET is not set. Authentication will fail.")
    
    # Verify Supabase connection on startup
    if verify_supabase_connection():
        print("Backend: Supabase connection verified successfully during startup.")
    else:
        print("Backend: Supabase connection verification FAILED during startup.")
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(courses.router, prefix="/api/v1", tags=["courses"])
app.include_router(lectures.router, prefix="/api/v1", tags=["lectures"])
app.include_router(notes.router, prefix="/api/v1", tags=["notes"])
app.include_router(quiz.router, prefix="/api/v1", tags=["quiz"])

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/api/protected")
def protected_route(user: dict = Depends(get_current_user)):
    return {"message": "You are authenticated", "user": user}
