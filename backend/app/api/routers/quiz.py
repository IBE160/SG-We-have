import logging
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user
from app.core.database import get_supabase_client
from app.models.quiz import QuizGenerateRequest, QuizResponse
from app.services.quiz_service import generate_quiz
from app.models.quiz_submission import QuizStartResponse, QuizSubmissionRequest, QuizSubmissionResponse, QuizNextRequest, QuizNextResponse
from app.services.quiz_submission import start_quiz_attempt, submit_answer, get_next_question

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

@router.get("/quiz/{quiz_id}/start", response_model=QuizStartResponse)
async def start_quiz_endpoint(
    quiz_id: str,
    user: dict = Depends(get_current_user)
):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")
        
    supabase = get_supabase_client()
    
    try:
        return await start_quiz_attempt(quiz_id, user_id, supabase)
    except Exception as e:
        logger.error(f"Error starting quiz: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/quiz/{quiz_id}/answer", response_model=QuizSubmissionResponse)
async def submit_answer_endpoint(
    quiz_id: str,
    request: QuizSubmissionRequest,
    user: dict = Depends(get_current_user)
):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")
        
    supabase = get_supabase_client()
    
    try:
        return await submit_answer(quiz_id, request, user_id, supabase)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/quiz/{quiz_id}/next", response_model=QuizNextResponse)
async def next_question_endpoint(
    quiz_id: str,
    request: QuizNextRequest,
    user: dict = Depends(get_current_user)
):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")
        
    supabase = get_supabase_client()
    
    try:
        return await get_next_question(quiz_id, request, user_id, supabase)
    except Exception as e:
        logger.error(f"Error getting next question: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Internal Server Error")