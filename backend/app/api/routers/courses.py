import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.security import get_current_user
from app.core.database import get_supabase_client

router = APIRouter()
logger = logging.getLogger(__name__)

class CourseCreate(BaseModel):
    name: str

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
        return response.data[0]
    except Exception as e:
        logger.error(f"Error creating course: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
