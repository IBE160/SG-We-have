import logging
import uuid
from typing import List
from fastapi import HTTPException
from supabase import Client
from app.agents.quiz_agent import generate_quiz_content
from app.models.quiz import QuizGenerateRequest, QuizResponse, QuestionResponse, OptionResponse, QuizHistoryItem

logger = logging.getLogger(__name__)

from app.services.mock_storage import save_mock_quiz

async def generate_quiz(request: QuizGenerateRequest, user_id: str, supabase: Client) -> QuizResponse:
    try:
        # 1. Fetch Notes
        # request.note_ids is List[str]
        response = supabase.table("notes").select("content").in_("id", request.note_ids).execute()
        notes_data = response.data
        
        if not notes_data:
            raise HTTPException(status_code=400, detail="No notes found for selected items.")
        
        # Concatenate notes
        # filter out empty notes
        valid_notes = [note['content'] for note in notes_data if note.get('content')]
        
        if not valid_notes:
             raise HTTPException(status_code=400, detail="Selected notes have empty content.")
             
        full_notes = "\n\n".join(valid_notes)
        
        # 2. Fetch Prompt Template
        template = None
        try:
            prompt_response = supabase.table("system_prompts").select("template").eq("key", "quiz_generator_v1").single().execute()
            if prompt_response.data:
                template = prompt_response.data['template']
        except Exception as e:
            logger.warning(f"Could not fetch system prompt (using fallback): {e}")

        if not template:
            # Fallback prompt if DB is empty/fail
            template = (
                "You are an expert educator. Generate a multiple-choice quiz based on the following notes.\n\n"
                "Notes:\n{{notes}}\n\n"
                "Instructions:\n"
                "1. Generate {{quiz_length}} questions.\n"
                "2. Focus on definitions, application, and comparison.\n"
                "3. Each question must have 4 options.\n"
                "4. Provide the correct answer index (0-3) and a brief explanation.\n"
                "5. Ensure questions are relevant, accurate, and pedagogical.\n"
                "6. FACT CHECKING: Use your search tool to verify facts. Ensure questions are correct according to both the notes and general knowledge.\n"
                "\n"
                "Output Format: JSON matching the specified schema."
            )
            
        # 3. Prepare Prompt
        final_prompt = template.replace("{{notes}}", full_notes).replace("{{quiz_length}}", str(request.quiz_length))
        
        # 4. Call AI Agent
        generated_quiz = await generate_quiz_content(final_prompt)
        
        # 5. Persist to DB (with fallback)
        try:
            # Create Quiz
            quiz_data = {
                "user_id": user_id,
                "title": generated_quiz.title,
                # course_id left null for now
            }
            
            quiz_insert = supabase.table("quizzes").insert(quiz_data).execute()
            if not quiz_insert.data:
                raise Exception("Failed to insert quiz record")
            
            quiz_id = quiz_insert.data[0]['id']
            
            questions_response_list = []
            
            # Create Questions and Options
            for q in generated_quiz.questions:
                question_data = {
                    "quiz_id": quiz_id,
                    "question_text": q.question_text,
                    "correct_answer_index": q.correct_answer_index,
                    "explanation": q.explanation
                }
                q_insert = supabase.table("quiz_questions").insert(question_data).execute()
                question_id = q_insert.data[0]['id']
                
                options_list = []
                for o_idx, option_text in enumerate(q.options):
                    option_data = {
                        "question_id": question_id,
                        "option_text": option_text,
                        "option_index": o_idx
                    }
                    o_insert = supabase.table("quiz_options").insert(option_data).execute()
                    o_data = o_insert.data[0]
                    options_list.append(OptionResponse(
                        id=o_data['id'],
                        option_text=o_data['option_text'],
                        option_index=o_data['option_index']
                    ))
                
                questions_response_list.append(QuestionResponse(
                    id=question_id,
                    question_text=q.question_text,
                    options=options_list,
                    correct_answer_index=q.correct_answer_index,
                    explanation=q.explanation
                ))
                
            return QuizResponse(
                id=quiz_id,
                title=generated_quiz.title,
                questions=questions_response_list
            )

        except Exception as e:
            logger.error(f"Database persistence failed (using mock storage): {e}")
            
            # Generate persistent IDs for mock storage
            temp_quiz_id = str(uuid.uuid4())
            questions_response_list = []
            
            # Build the full quiz object structure for mock storage
            mock_quiz = {
                "id": temp_quiz_id,
                "user_id": user_id,
                "title": generated_quiz.title,
                "questions": []
            }
            
            for q in generated_quiz.questions:
                temp_q_id = str(uuid.uuid4())
                options_list = []
                
                mock_question = {
                    "id": temp_q_id,
                    "question_text": q.question_text,
                    "correct_answer_index": q.correct_answer_index,
                    "explanation": q.explanation,
                    "options": []
                }
                
                for o_idx, option_text in enumerate(q.options):
                    temp_o_id = str(uuid.uuid4())
                    opt_resp = OptionResponse(
                        id=temp_o_id,
                        option_text=option_text,
                        option_index=o_idx
                    )
                    options_list.append(opt_resp)
                    mock_question["options"].append({
                        "id": temp_o_id,
                        "option_text": option_text,
                        "option_index": o_idx,
                        "is_correct": o_idx == q.correct_answer_index # Store correctness locally
                    })
                
                questions_response_list.append(QuestionResponse(
                    id=temp_q_id,
                    question_text=q.question_text,
                    options=options_list,
                    correct_answer_index=q.correct_answer_index,
                    explanation=q.explanation
                ))
                mock_quiz["questions"].append(mock_question)
            
            # Save to mock storage
            save_mock_quiz(mock_quiz)
            
            return QuizResponse(
                id=temp_quiz_id,
                title=generated_quiz.title,
                questions=questions_response_list
            )

    except HTTPException as he:
        raise he
    except Exception as e:
        # Log error
        logger.error(f"Error generating quiz: {e}", exc_info=True)
        error_str = str(e)
        if "503" in error_str or "overloaded" in error_str.lower():
            raise HTTPException(status_code=503, detail="The AI model is currently overloaded. Please try again in a few moments.")
        
        # Sanitize error for client
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while generating the quiz: {str(e)}")

async def get_quiz_history(user_id: str, supabase: Client) -> List[QuizHistoryItem]:
    try:
        response = supabase.table("quizzes").select("id, title, created_at, course_id").eq("user_id", user_id).order("created_at", desc=True).execute()
        
        if not response.data:
            return []
            
        quiz_history = [
            QuizHistoryItem(
                id=item['id'],
                title=item['title'],
                created_at=item['created_at'],
                course_id=item.get('course_id')
            ) 
            for item in response.data
        ]
        
        return quiz_history
        
    except Exception as e:
        logger.error(f"Error fetching quiz history for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch quiz history.")

async def delete_quiz(quiz_id: str, user_id: str, supabase: Client):
    try:
        # First, verify the quiz belongs to the user
        response = supabase.table("quizzes").select("id").eq("id", quiz_id).eq("user_id", user_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Quiz not found or you don't have permission to delete it.")

        # Manual Cascade Delete (safest fallback if RPC/Cascade missing)
        # 1. Get Attempts to delete answers
        attempts_res = supabase.table("quiz_attempts").select("id").eq("quiz_id", quiz_id).execute()
        if attempts_res.data:
            attempt_ids = [a['id'] for a in attempts_res.data]
            # 2. Delete Answers
            supabase.table("quiz_answers").delete().in_("attempt_id", attempt_ids).execute()
            # 3. Delete Attempts
            supabase.table("quiz_attempts").delete().eq("quiz_id", quiz_id).execute()

        # 4. Get Questions to delete options
        questions_res = supabase.table("quiz_questions").select("id").eq("quiz_id", quiz_id).execute()
        if questions_res.data:
            question_ids = [q['id'] for q in questions_res.data]
            # 5. Delete Options
            supabase.table("quiz_options").delete().in_("question_id", question_ids).execute()
            # 6. Delete Questions
            supabase.table("quiz_questions").delete().eq("quiz_id", quiz_id).execute()

        # 7. Delete Quiz
        del_res = supabase.table("quizzes").delete().eq("id", quiz_id).execute()
        
        if not del_res.data:
             # Check if it was actually deleted (Supabase sometimes returns data on delete, sometimes not depending on headers)
             # Verify deletion
             check = supabase.table("quizzes").select("id").eq("id", quiz_id).execute()
             if check.data:
                 raise Exception("Failed to delete quiz record")

    except Exception as e:
        logger.error(f"Error deleting quiz {quiz_id} for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete quiz.")
