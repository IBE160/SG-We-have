import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.security import get_current_user
from app.core.database import get_supabase_client

router = APIRouter()
logger = logging.getLogger(__name__)

class Note(BaseModel):
    id: str
    lecture_id: str
    content: str
    updated_at: str

def verify_lecture_ownership(lecture_id: str, user_id: str, supabase):
    """
    Verifies that the lecture exists and belongs to a course owned by the user.
    """
    try:
        # Join with courses to check user_id
        # Supabase-py syntax for joins: select("*, courses(*)")
        # We select course_id from lectures and user_id from the related course
        response = supabase.table("lectures").select("course_id, courses!inner(user_id)").eq("id", lecture_id).execute()
        
        if not response.data:
             raise HTTPException(status_code=404, detail="Lecture not found")
        
        lecture_data = response.data[0]
        
        # Check if courses data is present and user_id matches
        # structure returned by Supabase join: { "course_id": "...", "courses": { "user_id": "..." } }
        if not lecture_data.get("courses") or lecture_data["courses"]["user_id"] != user_id:
             raise HTTPException(status_code=403, detail="Not authorized to access this lecture")
             
        return True
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error checking lecture ownership: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/lectures/{lecture_id}/notes", response_model=Note)
def get_lecture_notes(lecture_id: str, user: dict = Depends(get_current_user)):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")

    supabase = get_supabase_client()
    
    verify_lecture_ownership(lecture_id, user_id, supabase)
    
    try:
        response = supabase.table("notes").select("*").eq("lecture_id", lecture_id).execute()
        
        if not response.data:
            # AC 2.1.3: If no notes exist, return 404. Frontend handles it.
            raise HTTPException(status_code=404, detail="Notes not found")
            
        return response.data[0]
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error fetching notes: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
