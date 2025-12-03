from typing import List
from fastapi import HTTPException
from supabase import Client
from app.agents.quiz_agent import generate_quiz_content
from app.models.quiz import QuizGenerateRequest, QuizResponse, QuestionResponse, OptionResponse

async def generate_quiz(request: QuizGenerateRequest, user_id: str, supabase: Client) -> QuizResponse:
    try:
        # 1. Fetch Notes
        # request.lecture_ids is List[str]
        response = supabase.table("notes").select("content").in_("lecture_id", request.lecture_ids).execute()
        notes_data = response.data
        
        if not notes_data:
            raise HTTPException(status_code=400, detail="No notes found for selected lectures.")
        
        # Concatenate notes
        # filter out empty notes
        valid_notes = [note['content'] for note in notes_data if note.get('content')]
        
        if not valid_notes:
             raise HTTPException(status_code=400, detail="Selected lectures have empty notes.")
             
        full_notes = "\n\n".join(valid_notes)
        
        # 2. Fetch Prompt Template
        prompt_response = supabase.table("system_prompts").select("template").eq("key", "quiz_generator_v1").single().execute()
        
        if not prompt_response.data:
            # Fallback prompt if DB is empty/fail
            template = "Generate a {{quiz_length}} question multiple choice quiz for these notes: {{notes}}"
        else:
            template = prompt_response.data['template']
            
        # 3. Prepare Prompt
        final_prompt = template.replace("{{notes}}", full_notes).replace("{{quiz_length}}", str(request.quiz_length))
        
        # 4. Call AI Agent
        generated_quiz = await generate_quiz_content(final_prompt)
        
        # 5. Persist to DB
        # Create Quiz
        quiz_data = {
            "user_id": user_id,
            "title": generated_quiz.title,
            # course_id left null for now
        }
        
        quiz_insert = supabase.table("quizzes").insert(quiz_data).execute()
        if not quiz_insert.data:
            raise HTTPException(status_code=500, detail="Failed to save quiz.")
        
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

    except HTTPException as he:
        raise he
    except Exception as e:
        # Log error
        print(f"Error generating quiz: {e}")
        raise HTTPException(status_code=500, detail=str(e))