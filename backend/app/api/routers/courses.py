import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.security import get_current_user
from app.core.database import get_supabase_client

router = APIRouter()
logger = logging.getLogger(__name__)

class CourseCreate(BaseModel):
    name: str

class CourseUpdate(BaseModel):
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

@router.put("/courses/{course_id}", response_model=Course)
def update_course(course_id: str, course: CourseUpdate, user: dict = Depends(get_current_user)):
    if not course.name.strip():
        raise HTTPException(status_code=422, detail="Course name cannot be empty")
    
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")

    supabase = get_supabase_client()
    
    # Verify ownership
    try:
        response = supabase.table("courses").select("user_id").eq("id", course_id).execute()
        if not response.data:
             raise HTTPException(status_code=404, detail="Course not found")
        
        if response.data[0]["user_id"] != user_id:
             raise HTTPException(status_code=403, detail="Not authorized to access this course")

        # Update
        response = supabase.table("courses").update({"name": course.name}).eq("id", course_id).execute()
        if not response.data:
             raise HTTPException(status_code=500, detail="Failed to update course")
        
        db_course = response.data[0]
        return {
            "id": db_course["id"],
            "name": db_course["name"],
            "user_id": db_course["user_id"],
            "created_at": db_course["created_at"]
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error updating course: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: str, user: dict = Depends(get_current_user)):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")

    supabase = get_supabase_client()
    
    # Verify ownership
    try:
        response = supabase.table("courses").select("user_id").eq("id", course_id).execute()
        if not response.data:
             # If not found, 204 is technically fine (idempotent), but we can raise 404 if strict
             raise HTTPException(status_code=404, detail="Course not found")
        
        if response.data[0]["user_id"] != user_id:
             raise HTTPException(status_code=403, detail="Not authorized to access this course")

        # Delete (Cascade should handle notes if configured, otherwise this might fail)
        supabase.table("courses").delete().eq("id", course_id).execute()

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error deleting course: {e}")
        # Check for FK constraint violation
        if "foreign key constraint" in str(e).lower():
             raise HTTPException(status_code=409, detail="Cannot delete course because it has related notes. Please delete notes first or configure cascade delete.")
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
