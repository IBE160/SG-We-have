import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from app.services.quiz_submission import start_quiz_attempt, submit_answer
from app.models.quiz_submission import QuizSubmissionRequest

@pytest.mark.asyncio
async def test_submit_answer_correct():
    mock_supabase = MagicMock()
    
    # 1. Mock Attempt Validation
    mock_attempt_res = MagicMock()
    mock_attempt_res.data = {"id": "attempt-1", "user_id": "user-1"}
    
    # 2. Mock Question Fetch
    mock_question_res = MagicMock()
    mock_question_res.data = {
        "id": "q1", 
        "correct_answer": "Option A", 
        "explanation": "Because logic."
    }
    
    # 3. Mock Selected Option Fetch
    mock_option_res = MagicMock()
    mock_option_res.data = {
        "id": "opt1",
        "option_text": "Option A",
        "is_correct": True
    }
    
    # 4. Mock Answer Insert (no return data needed usually, just success)
    mock_insert_res = MagicMock()
    
    def table_side_effect(name):
        mock_table = MagicMock()
        if name == "quiz_attempts":
            mock_table.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_attempt_res
        elif name == "quiz_questions":
            mock_table.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_question_res
        elif name == "quiz_options":
            mock_table.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_option_res
        elif name == "quiz_answers":
            mock_table.insert.return_value.execute.return_value = mock_insert_res
        return mock_table
        
    mock_supabase.table.side_effect = table_side_effect

    req = QuizSubmissionRequest(attempt_id="attempt-1", question_id="q1", answer_id="opt1")
    result = await submit_answer("quiz-1", req, "user-1", mock_supabase)
    
    assert result.is_correct == True
    assert result.correct_answer_id == "opt1"
    assert "Correct" in result.feedback_text
    assert "Because logic" in result.feedback_text

@pytest.mark.asyncio
async def test_submit_answer_incorrect():
    mock_supabase = MagicMock()
    
    # 1. Mock Attempt Validation
    mock_attempt_res = MagicMock()
    mock_attempt_res.data = {"id": "attempt-1", "user_id": "user-1"}
    
    # 2. Mock Question Fetch
    mock_question_res = MagicMock()
    mock_question_res.data = {
        "id": "q1", 
        "correct_answer": "Option B", 
        "explanation": "Because logic."
    }
    
    # 3. Mock Selected Option Fetch (Incorrect)
    mock_option_res = MagicMock()
    mock_option_res.data = {
        "id": "opt1",
        "option_text": "Option A",
        "is_correct": False
    }
    
    # 4. Mock Correct Option Fetch (to return ID)
    mock_correct_opt_res = MagicMock()
    mock_correct_opt_res.data = {"id": "opt2"}

    # Helper for multiple calls to quiz_options (one for validation, one for fetching correct)
    def table_side_effect(name):
        mock_table = MagicMock()
        if name == "quiz_attempts":
            mock_table.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_attempt_res
        elif name == "quiz_questions":
            mock_table.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_question_res
        elif name == "quiz_options":
            # We have two calls here: 
            # 1. Get selected option (by ID)
            # 2. Get correct option (by QuestionID + is_correct=True)
            # Simplest mock strategy: check chain calls or just return different values based on calls?
            # MagicMock doesn't easily switch based on args of intermediate calls in chain without complex side_effects.
            # Let's refine the side_effect to return a distinct mock for quiz_options that handles different queries.
            
            mock_opts_query = MagicMock()
            
            # Logic for query chain differentiation
            # Case 1: .eq("id", request.answer_id).single()
            # Case 2: .eq("question_id", qid).eq("is_correct", True).single()
            
            # Using side_effect on the first .eq could work?
            # Or just returning a mock that returns success for everything, but we need specific data.
            
            # Let's make it simple: 
            # If we can't easily distinguish, let's assume the first call (validation) returns the selected option
            # and subsequent calls (fetching correct) return the correct option.
            
            mock_opts_query.select.return_value.eq.side_effect = [
                # First .eq call logic... messy.
                # Let's try a different approach.
                MagicMock(single=MagicMock(execute=MagicMock(return_value=mock_option_res))), # First chain (select option)
                MagicMock(eq=MagicMock(single=MagicMock(execute=MagicMock(return_value=mock_correct_opt_res)))) # Second chain (select correct)
            ]
            
            # Wait, the second chain has TWO .eq calls. 
            # .eq("question_id", ...).eq("is_correct", ...)
            
            # Let's define a more robust mock for the table object.
            class MockQuery:
                def __init__(self):
                    self.chain = []
                def select(self, *args): return self
                def eq(self, key, val):
                    self.chain.append((key, val))
                    return self
                def single(self): return self
                def execute(self):
                    # Logic to decide what to return based on self.chain
                    if ("id", "opt1") in self.chain:
                        return mock_option_res
                    if ("is_correct", True) in self.chain:
                        return mock_correct_opt_res
                    return MagicMock(data=None)
            
            return MockQuery()

        elif name == "quiz_answers":
            mock_table.insert.return_value.execute.return_value = MagicMock()
        return mock_table
        
    mock_supabase.table.side_effect = table_side_effect

    req = QuizSubmissionRequest(attempt_id="attempt-1", question_id="q1", answer_id="opt1")
    result = await submit_answer("quiz-1", req, "user-1", mock_supabase)
    
    assert result.is_correct == False
    assert result.correct_answer_id == "opt2"
    assert "Incorrect" in result.feedback_text
    assert "Option B" in result.feedback_text

@pytest.mark.asyncio
async def test_start_quiz_attempt_service_success():
    mock_supabase = MagicMock()
    
    # 1. Mock Quiz Fetch
    mock_quiz_res = MagicMock()
    mock_quiz_res.data = {"title": "Test Quiz", "user_id": "user-1"}
    # Chain: table().select().eq().single().execute()
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_quiz_res
    
    # 2. Mock Attempt Insert
    mock_attempt_res = MagicMock()
    mock_attempt_res.data = [{"id": "attempt-1"}]
    # Chain: table().insert().execute()
    mock_supabase.table.return_value.insert.return_value.execute.return_value = mock_attempt_res

    # 3. Mock Questions Fetch
    mock_questions_res = MagicMock()
    mock_questions_res.data = [{
        "id": "q1",
        "question_text": "Test Q",
        "quiz_options": [
            {"id": "opt1", "option_text": "A", "option_index": 0},
            {"id": "opt2", "option_text": "B", "option_index": 1}
        ]
    }]
    # Chain: table().select().eq().execute()
    # IMPORTANT: Need to ensure the side effects are managed if table() called multiple times
    # Mocking table().select()... isn't distinguishing between "quizzes" table and "quiz_questions" table
    # Standard MagicMock behavior returns same mock object for repeated calls unless side_effect specified
    
    # Strategy: Use side_effect on table(name)
    def table_side_effect(name):
        mock_table = MagicMock()
        if name == "quizzes":
            mock_table.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_quiz_res
        elif name == "quiz_attempts":
            mock_table.insert.return_value.execute.return_value = mock_attempt_res
        elif name == "quiz_questions":
            mock_table.select.return_value.eq.return_value.execute.return_value = mock_questions_res
        return mock_table
    
    mock_supabase.table.side_effect = table_side_effect

    result = await start_quiz_attempt("quiz-1", "user-1", mock_supabase)
    
    assert result.quiz_id == "quiz-1"
    assert result.attempt_id == "attempt-1"
    assert result.first_question.id == "q1"
    assert len(result.first_question.options) == 2
    assert result.first_question.options[0].option_text == "A"

@pytest.mark.asyncio
async def test_start_quiz_attempt_not_found():
    mock_supabase = MagicMock()
    
    # Mock Quiz Fetch returning None
    mock_quiz_res = MagicMock()
    mock_quiz_res.data = None
    
    mock_table = MagicMock()
    mock_table.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_quiz_res
    mock_supabase.table.return_value = mock_table
    
    with pytest.raises(HTTPException) as exc:
        await start_quiz_attempt("quiz-1", "user-1", mock_supabase)
    assert exc.value.status_code == 404

@pytest.mark.asyncio
async def test_start_quiz_attempt_no_questions():
    mock_supabase = MagicMock()
    
    # Mock Quiz Fetch Success
    mock_quiz_res = MagicMock()
    mock_quiz_res.data = {"title": "Test Quiz", "user_id": "user-1"}
    
    # Mock Questions Fetch Empty
    mock_questions_res = MagicMock()
    mock_questions_res.data = [] # Empty list

    def table_side_effect(name):
        mock_table = MagicMock()
        if name == "quizzes":
            mock_table.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_quiz_res
        elif name == "quiz_attempts":
            mock_table.insert.return_value.execute.return_value = MagicMock(data=[{"id": "att-1"}])
        elif name == "quiz_questions":
            mock_table.select.return_value.eq.return_value.execute.return_value = mock_questions_res
        return mock_table
    
    mock_supabase.table.side_effect = table_side_effect
    
    with pytest.raises(HTTPException) as exc:
        await start_quiz_attempt("quiz-1", "user-1", mock_supabase)
    assert exc.value.status_code == 404
    assert "no questions" in str(exc.value.detail)
