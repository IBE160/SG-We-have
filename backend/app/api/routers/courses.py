import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.security import get_current_user
from app.core.database import get_supabase_client

router = APIRouter()
logger = logging.getLogger(__name__)

class CourseCreate(BaseModel):
    name: str

class Course(BaseModel):
    id: str
    name: str
    user_id: str
    created_at: str

@router.post("/courses", status_code=status.HTTP_201_CREATED)
def create_course(course: CourseCreate, user: dict = Depends(get_current_user)):
    if not course.name.strip():
        raise HTTPException(status_code=422, detail="Course name cannot be empty")
    
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")

    supabase = get_supabase_client()
    
    data = {
        "user_id": user_id,
        "name": course.name
    }
    
    try:
        response = supabase.table("courses").insert(data).execute()
        if not response.data:
             raise HTTPException(status_code=500, detail="Failed to create course")
        
        db_course = response.data[0]
        return {
            "id": db_course["id"],
            "name": db_course["name"],
            "user_id": db_course["user_id"],
            "created_at": db_course["created_at"]
        }
    except Exception as e:
        logger.error(f"Error creating course: {e}")
        print(f"FULL ERROR TRACEBACK: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/courses", response_model=list[Course])
def get_courses(user: dict = Depends(get_current_user)):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")

    supabase = get_supabase_client()
    
    try:
        # Order by created_at descending (newest first)
        response = supabase.table("courses").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        
        courses = []
        for db_course in response.data:
            courses.append({
                "id": db_course["id"],
                "name": db_course["name"],
                "user_id": db_course["user_id"],
                "created_at": db_course["created_at"]
            })
        return courses
    except Exception as e:
        logger.error(f"Error fetching courses: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
