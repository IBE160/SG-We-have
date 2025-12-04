from fastapi import HTTPException
from supabase import Client
from app.models.quiz_submission import QuizStartResponse, QuestionDisplay, QuizAttempt, QuizSubmissionRequest, QuizSubmissionResponse
from app.models.quiz import OptionResponse
import logging

logger = logging.getLogger(__name__)

import uuid
from app.services.mock_storage import get_mock_quiz, save_mock_attempt, get_mock_attempt

logger = logging.getLogger(__name__)

async def submit_answer(quiz_id: str, request: QuizSubmissionRequest, user_id: str, supabase: Client) -> QuizSubmissionResponse:
    """
    Validates a submitted answer, records it, and returns feedback.
    """
    try:
        is_mock = False
        attempt_data = None
        question_data = None
        selected_option = None

        # 1. Verify Attempt Ownership
        try:
            attempt_res = supabase.table("quiz_attempts").select("id, user_id").eq("id", request.attempt_id).single().execute()
            if attempt_res.data:
                attempt_data = attempt_res.data
        except Exception:
            pass

        if not attempt_data:
            # Fallback to mock
            attempt_data = get_mock_attempt(request.attempt_id)
            if attempt_data:
                is_mock = True
            else:
                 raise HTTPException(status_code=404, detail="Quiz attempt not found")
        
        if attempt_data['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized for this quiz attempt")

        # 2. Fetch Question and Correct Answer
        if not is_mock:
            question_res = supabase.table("quiz_questions").select("id, correct_answer_index, explanation").eq("id", request.question_id).single().execute()
            if not question_res.data:
                raise HTTPException(status_code=404, detail="Question not found")
            
            question_db = question_res.data
            # Fetch options to get the text? No, we have indices.
            # Wait, earlier code used 'correct_answer' text. 
            # But the generator saves 'correct_answer_index'.
            # Let's assume DB stores index or we need to join.
            # Simplified: The previous code assumed `correct_answer` column existed as text? 
            # My create script had `correct_answer_index`.
            # Let's just use the index from the question data.
            correct_index = question_db.get('correct_answer_index')
            explanation = question_db.get('explanation')
            
            # Fetch selected option to verify it exists
            selected_option_res = supabase.table("quiz_options").select("id, option_index, option_text").eq("id", request.answer_id).single().execute()
            if not selected_option_res.data:
                 raise HTTPException(status_code=400, detail="Invalid answer ID")
            
            selected_option = selected_option_res.data
            is_correct = (selected_option['option_index'] == correct_index)
            
            # Record
            answer_data = {
                "attempt_id": request.attempt_id,
                "question_id": request.question_id,
                "selected_option_id": request.answer_id,
                "is_correct": is_correct
            }
            supabase.table("quiz_answers").insert(answer_data).execute()

            # Get correct option ID
            correct_answer_id = ""
            if not is_correct:
                 correct_opt_res = supabase.table("quiz_options").select("id").eq("question_id", request.question_id).eq("option_index", correct_index).single().execute()
                 if correct_opt_res.data:
                     correct_answer_id = correct_opt_res.data['id']
            else:
                correct_answer_id = request.answer_id

            feedback_text = "Correct!" if is_correct else "Incorrect."
            if explanation:
                feedback_text += f" {explanation}"
                
            return QuizSubmissionResponse(
                is_correct=is_correct,
                correct_answer_id=correct_answer_id,
                feedback_text=feedback_text,
                explanation=explanation
            )

        else:
            # Mock Logic
            mock_quiz = get_mock_quiz(attempt_data['quiz_id'])
            if not mock_quiz:
                raise HTTPException(status_code=404, detail="Mock quiz data missing")
            
            # Find question
            mock_q = next((q for q in mock_quiz['questions'] if q['id'] == request.question_id), None)
            if not mock_q:
                raise HTTPException(status_code=404, detail="Question not found")
            
            # Find selected option
            # In mock storage, options are dicts in the question
            mock_opt = next((o for o in mock_q['options'] if o['id'] == request.answer_id), None)
            if not mock_opt:
                 raise HTTPException(status_code=400, detail="Invalid answer ID")
            
            is_correct = mock_opt['is_correct']
            correct_answer_id = next((o['id'] for o in mock_q['options'] if o['is_correct']), "")
            
            feedback_text = "Correct!" if is_correct else "Incorrect."
            if mock_q.get('explanation'):
                feedback_text += f" {mock_q['explanation']}"
                
            return QuizSubmissionResponse(
                is_correct=is_correct,
                correct_answer_id=correct_answer_id,
                feedback_text=feedback_text,
                explanation=mock_q.get('explanation')
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
        quiz_title = ""
        is_mock = False
        mock_quiz_data = None

        # 1. Verify Quiz Exists
        try:
            quiz_res = supabase.table("quizzes").select("title, user_id").eq("id", quiz_id).single().execute()
            if quiz_res.data:
                quiz_title = quiz_res.data['title']
        except Exception:
            pass # Fallback to mock check
            
        if not quiz_title:
            # Check mock storage
            mock_quiz_data = get_mock_quiz(quiz_id)
            if mock_quiz_data:
                quiz_title = mock_quiz_data['title']
                is_mock = True
            else:
                raise HTTPException(status_code=404, detail="Quiz not found")

        # 2. Create Quiz Attempt
        attempt_id = ""
        if not is_mock:
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
        else:
            attempt_id = str(uuid.uuid4())
            save_mock_attempt({
                "id": attempt_id,
                "user_id": user_id,
                "quiz_id": quiz_id,
                "status": "in_progress"
            })

        # 3. Fetch Questions
        if not is_mock:
            questions_res = supabase.table("quiz_questions").select("*, quiz_options(*)").eq("quiz_id", quiz_id).execute()
            if not questions_res.data:
                 raise HTTPException(status_code=404, detail="Quiz has no questions")
            
            questions = questions_res.data
            # Sort questions? DB doesn't guarantee order unless we have a column.
            # Using ID or insertion order if consistent.
            
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
            options.sort(key=lambda x: x.option_index)

            first_question = QuestionDisplay(
                id=first_question_data['id'],
                question_text=first_question_data['question_text'],
                options=options
            )
        else:
            # Mock Data
            questions = mock_quiz_data['questions']
            if not questions:
                raise HTTPException(status_code=404, detail="Quiz has no questions")
            
            total_questions = len(questions)
            first_q = questions[0]
            
            options = []
            for opt in first_q['options']:
                options.append(OptionResponse(
                    id=opt['id'],
                    option_text=opt['option_text'],
                    option_index=opt['option_index']
                ))
            
            first_question = QuestionDisplay(
                id=first_q['id'],
                question_text=first_q['question_text'],
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
