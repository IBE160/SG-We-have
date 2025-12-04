from fastapi import HTTPException
from supabase import Client
from app.models.quiz_submission import QuizStartResponse, QuestionDisplay, QuizAttempt, QuizSubmissionRequest, QuizSubmissionResponse
from app.models.quiz import OptionResponse
import logging

logger = logging.getLogger(__name__)

async def submit_answer(quiz_id: str, request: QuizSubmissionRequest, user_id: str, supabase: Client) -> QuizSubmissionResponse:
    """
    Validates a submitted answer, records it, and returns feedback.
    """
    try:
        # 1. Verify Attempt Ownership
        attempt_res = supabase.table("quiz_attempts").select("id, user_id").eq("id", request.attempt_id).single().execute()
        if not attempt_res.data:
            raise HTTPException(status_code=404, detail="Quiz attempt not found")
        
        if attempt_res.data['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized for this quiz attempt")

        # 2. Fetch Question and Correct Answer
        question_res = supabase.table("quiz_questions").select("id, correct_answer, explanation").eq("id", request.question_id).single().execute()
        if not question_res.data:
            raise HTTPException(status_code=404, detail="Question not found")
        
        question_data = question_res.data
        correct_answer_text = question_data['correct_answer']
        
        # 3. Fetch Selected Option to verify ID (and potentially text match if needed)
        # Ideally we store option IDs. If 'correct_answer' in DB is text, we need to match.
        # Let's assume 'correct_answer' in DB stores the Option ID or the text. 
        # Standard pattern: DB stores 'correct_answer' as text or option_id? 
        # Looking at previous stories, options are in `quiz_options`.
        # Let's fetch the selected option to see if it matches.
        
        selected_option_res = supabase.table("quiz_options").select("id, option_text, is_correct").eq("id", request.answer_id).single().execute()
        if not selected_option_res.data:
             raise HTTPException(status_code=400, detail="Invalid answer ID")
        
        selected_option = selected_option_res.data
        is_correct = selected_option['is_correct'] # Trusting the DB 'is_correct' flag on the option table is safer/cleaner

        # 4. Record the Answer
        answer_data = {
            "attempt_id": request.attempt_id,
            "question_id": request.question_id,
            "selected_option_id": request.answer_id,
            "is_correct": is_correct
        }
        supabase.table("quiz_answers").insert(answer_data).execute()

        # 5. Prepare Response
        # We need to find the ID of the correct option to return it if the user was wrong
        correct_answer_id = request.answer_id if is_correct else None
        if not is_correct:
            # Find the correct option ID for this question
            correct_opt_res = supabase.table("quiz_options").select("id").eq("question_id", request.question_id).eq("is_correct", True).single().execute()
            if correct_opt_res.data:
                correct_answer_id = correct_opt_res.data['id']

        feedback_text = "Correct!" if is_correct else f"Incorrect. The correct answer was {correct_answer_text}." # Fallback to text if ID logic fails or for display
        
        # If we have an explanation, append it
        if question_data.get('explanation'):
             feedback_text += f" {question_data['explanation']}"

        return QuizSubmissionResponse(
            is_correct=is_correct,
            correct_answer_id=correct_answer_id or "", # Ensure string
            feedback_text=feedback_text,
            explanation=question_data.get('explanation')
        )

    except Exception as e:
        logger.error(f"Error submitting answer: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

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
