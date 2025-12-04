import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timezone
from app.core.security import get_current_user
from app.core.database import get_supabase_client

router = APIRouter()
logger = logging.getLogger(__name__)

class NoteCreate(BaseModel):
    title: str

class NoteUpdate(BaseModel):
    content: str

class Note(BaseModel):
    id: str
    course_id: str
    title: str
    content: str
    created_at: str
    updated_at: str

def verify_course_ownership(course_id: str, user_id: str, supabase):
    """
    Verifies that the course exists and belongs to the user.
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
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

def verify_note_ownership(note_id: str, user_id: str, supabase):
    """
    Verifies that the note exists and belongs to a course owned by the user.
    """
    try:
        # Join with courses to check user_id
        response = supabase.table("notes").select("course_id, courses!inner(user_id)").eq("id", note_id).execute()
        
        if not response.data:
             raise HTTPException(status_code=404, detail="Note not found")
        
        note_data = response.data[0]
        
        if not note_data.get("courses") or note_data["courses"]["user_id"] != user_id:
             raise HTTPException(status_code=403, detail="Not authorized to access this note")
             
        return True
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error checking note ownership: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/courses/{course_id}/notes", status_code=status.HTTP_201_CREATED, response_model=Note)
def create_note(course_id: str, note: NoteCreate, user: dict = Depends(get_current_user)):
    if not note.title.strip():
        raise HTTPException(status_code=422, detail="Note title cannot be empty")
    
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")

    supabase = get_supabase_client()
    
    verify_course_ownership(course_id, user_id, supabase)
    
    data = {
        "course_id": course_id,
        "title": note.title,
        "content": "" # Start empty
    }
    
    try:
        response = supabase.table("notes").insert(data).execute()
        if not response.data:
             raise HTTPException(status_code=500, detail="Failed to create note")
        
        return response.data[0]
    except Exception as e:
        logger.error(f"Error creating note: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/courses/{course_id}/notes", response_model=list[Note])
def get_notes(course_id: str, user: dict = Depends(get_current_user)):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")

    supabase = get_supabase_client()
    
    verify_course_ownership(course_id, user_id, supabase)
    
    try:
        response = supabase.table("notes").select("*").eq("course_id", course_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching notes: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/notes/{note_id}", response_model=Note)
def get_note(note_id: str, user: dict = Depends(get_current_user)):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")

    supabase = get_supabase_client()
    
    verify_note_ownership(note_id, user_id, supabase)
    
    try:
        response = supabase.table("notes").select("*").eq("id", note_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Note not found")
        return response.data[0]
    except Exception as e:
        logger.error(f"Error fetching note: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.put("/notes/{note_id}", response_model=Note)
def update_note(note_id: str, note_update: NoteUpdate, user: dict = Depends(get_current_user)):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")

    supabase = get_supabase_client()
    
    verify_note_ownership(note_id, user_id, supabase)
    
    try:
        current_time = datetime.now(timezone.utc).isoformat()
        data = {
            "content": note_update.content,
            "updated_at": current_time
        }
        
        response = supabase.table("notes").update(data).eq("id", note_id).execute()
        
        if not response.data:
             raise HTTPException(status_code=500, detail="Failed to update note")
             
        return response.data[0]
        
    except Exception as e:
        logger.error(f"Error updating note: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")