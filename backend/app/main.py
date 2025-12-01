from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core import config
from app.core.database import verify_supabase_connection
from app.core.security import get_current_user
from app.api.routers import courses, lectures

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify Supabase connection on startup
    if verify_supabase_connection():
        print("Backend: Supabase connection verified successfully during startup.")
    else:
        print("Backend: Supabase connection verification FAILED during startup.")
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
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

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/api/protected")
def protected_route(user: dict = Depends(get_current_user)):
    return {"message": "You are authenticated", "user": user}
