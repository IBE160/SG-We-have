import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.security import get_current_user
from app.core.database import get_supabase_client

router = APIRouter()
logger = logging.getLogger(__name__)

class LectureCreate(BaseModel):
    title: str

class Lecture(BaseModel):
    id: str
    course_id: str
    title: str
    created_at: str

def verify_course_ownership(course_id: str, user_id: str, supabase):
    """
    Verifies that the course exists and belongs to the user.
    Raises HTTPException if not found or access denied.
    """
    try:
        response = supabase.table("courses").select("user_id").eq("id", course_id).execute()
        if not response.data:
             raise HTTPException(status_code=404, detail="Course not found")
        
        if response.data[0]["user_id"] != user_id:
             raise HTTPException(status_code=403, detail="Not authorized to access this course")
             
        return True
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error checking course ownership: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/courses/{course_id}/lectures", status_code=status.HTTP_201_CREATED, response_model=Lecture)
def create_lecture(course_id: str, lecture: LectureCreate, user: dict = Depends(get_current_user)):
    if not lecture.title.strip():
        raise HTTPException(status_code=422, detail="Lecture title cannot be empty")
    
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")

    supabase = get_supabase_client()
    
    # Critical Security Check: Verify ownership before insertion
    verify_course_ownership(course_id, user_id, supabase)
    
    data = {
        "course_id": course_id,
        "title": lecture.title
    }
    
    try:
        response = supabase.table("lectures").insert(data).execute()
        if not response.data:
             raise HTTPException(status_code=500, detail="Failed to create lecture")
        return response.data[0]
    except Exception as e:
        logger.error(f"Error creating lecture: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/courses/{course_id}/lectures", response_model=list[Lecture])
def get_lectures(course_id: str, user: dict = Depends(get_current_user)):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")

    supabase = get_supabase_client()
    
    # Critical Security Check: Verify ownership before selection
    verify_course_ownership(course_id, user_id, supabase)
    
    try:
        # Order by created_at descending (newest first)
        response = supabase.table("lectures").select("*").eq("course_id", course_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching lectures: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
