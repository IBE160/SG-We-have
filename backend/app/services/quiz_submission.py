from fastapi import HTTPException
from supabase import Client
from app.models.quiz_submission import QuizStartResponse, QuestionDisplay, QuizAttempt
from app.models.quiz import OptionResponse
import logging

logger = logging.getLogger(__name__)

async def start_quiz_attempt(quiz_id: str, user_id: str, supabase: Client) -> QuizStartResponse:
    """
    Initializes a quiz attempt and returns the first question.
    """
    try:
        # 1. Verify Quiz Exists and Fetch Title
        quiz_res = supabase.table("quizzes").select("title, user_id").eq("id", quiz_id).single().execute()
        if not quiz_res.data:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        # Optional: Check ownership (or if public quizzes are allowed)
        if quiz_res.data['user_id'] != user_id:
             # For now, enforce strict ownership as per RLS, but good to check here too
             pass

        quiz_title = quiz_res.data['title']

        # 2. Create Quiz Attempt
        attempt_data = {
            "user_id": user_id,
            "quiz_id": quiz_id,
            "status": "in_progress",
            "current_question_index": 0
        }
        attempt_res = supabase.table("quiz_attempts").insert(attempt_data).execute()
        if not attempt_res.data:
            raise HTTPException(status_code=500, detail="Failed to create quiz attempt")
        
        attempt_id = attempt_res.data[0]['id']

        # 3. Fetch Questions (to get total count and first question)
        # We assume the order is stable (e.g., by ID or insertion time). 
        # Ideally, we should have a 'question_order' or sort by 'created_at'.
        questions_res = supabase.table("quiz_questions").select("*, quiz_options(*)").eq("quiz_id", quiz_id).execute()
        
        if not questions_res.data:
             raise HTTPException(status_code=404, detail="Quiz has no questions")
        
        questions = questions_res.data
        total_questions = len(questions)
        first_question_data = questions[0]

        # Map Options
        options = []
        for opt in first_question_data.get('quiz_options', []):
            options.append(OptionResponse(
                id=opt['id'],
                option_text=opt['option_text'],
                option_index=opt['option_index']
            ))
        
        # Sort options by index to ensure correct display order
        options.sort(key=lambda x: x.option_index)

        # Map Question
        first_question = QuestionDisplay(
            id=first_question_data['id'],
            question_text=first_question_data['question_text'],
            options=options
        )

        return QuizStartResponse(
            attempt_id=attempt_id,
            quiz_id=quiz_id,
            quiz_title=quiz_title,
            total_questions=total_questions,
            current_question_index=0,
            first_question=first_question
        )

    except Exception as e:
        logger.error(f"Error starting quiz attempt: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
