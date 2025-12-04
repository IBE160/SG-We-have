import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from app.services.quiz_submission import start_quiz_attempt

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
