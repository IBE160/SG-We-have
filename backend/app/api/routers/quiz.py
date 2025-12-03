import logging
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user
from app.core.database import get_supabase_client
from app.models.quiz import QuizGenerateRequest, QuizResponse
from app.services.quiz_service import generate_quiz

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/quiz/generate", response_model=QuizResponse, status_code=status.HTTP_201_CREATED)
async def generate_quiz_endpoint(
    request: QuizGenerateRequest, 
    user: dict = Depends(get_current_user)
):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")

    supabase = get_supabase_client()
    
    try:
        return await generate_quiz(request, user_id, supabase)
    except Exception as e:
        logger.error(f"Error in quiz generation endpoint: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Internal Server Error")
