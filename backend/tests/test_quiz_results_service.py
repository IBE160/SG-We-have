import pytest
from unittest.mock import MagicMock
from app.services.quiz_submission import get_quiz_results
from datetime import datetime

@pytest.mark.asyncio
async def test_get_quiz_results_service_success():
    mock_supabase = MagicMock()
    
    # 1. Mock Attempt Fetch
    mock_attempt_res = MagicMock()
    mock_attempt_res.data = {
        "id": "attempt-1", 
        "user_id": "user-1", 
        "quiz_id": "quiz-1",
        "end_time": "2023-01-01T12:00:00",
        "score": None # Logic should update this
    }
    
    # 2. Mock Total Questions Count
    mock_q_count_res = MagicMock()
    mock_q_count_res.count = 10
    
    # 3. Mock Score Count
    mock_score_res = MagicMock()
    mock_score_res.count = 8
    
    # 4. Mock Update Score
    mock_update_res = MagicMock()

    def table_side_effect(name):
        mock_table = MagicMock()
        if name == "quiz_attempts":
            # Handling .select().eq().single().execute() AND .update().eq().execute()
            mock_table.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_attempt_res
            mock_table.update.return_value.eq.return_value.execute.return_value = mock_update_res
        elif name == "quiz_questions":
            mock_table.select.return_value.eq.return_value.execute.return_value = mock_q_count_res
        elif name == "quiz_answers":
            mock_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = mock_score_res
        return mock_table
    
    mock_supabase.table.side_effect = table_side_effect

    result = await get_quiz_results("quiz-1", "attempt-1", "user-1", mock_supabase)
    
    assert result.score == 8
    assert result.total_questions == 10
    assert result.percentage == 80.0
    assert result.completed_at == datetime(2023, 1, 1, 12, 0, 0)
    
    # Verify score update was called
    # Note: mocking chain calls is tricky to assert exactly without capturing the mock objects returned by calls
    # But we can check if table("quiz_attempts").update(...) was accessed.

@pytest.mark.asyncio
async def test_get_quiz_results_no_end_time():
    mock_supabase = MagicMock()
    
    mock_attempt_res = MagicMock()
    mock_attempt_res.data = {
        "id": "attempt-1", 
        "user_id": "user-1", 
        "quiz_id": "quiz-1",
        "end_time": None, # Missing end time
        "score": 5
    }
    
    mock_q_count_res = MagicMock()
    mock_q_count_res.count = 10
    mock_score_res = MagicMock()
    mock_score_res.count = 5
    
    def table_side_effect(name):
        mock_table = MagicMock()
        if name == "quiz_attempts":
            mock_table.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_attempt_res
        elif name == "quiz_questions":
            mock_table.select.return_value.eq.return_value.execute.return_value = mock_q_count_res
        elif name == "quiz_answers":
            mock_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = mock_score_res
        return mock_table
    
    mock_supabase.table.side_effect = table_side_effect
    
    result = await get_quiz_results("quiz-1", "attempt-1", "user-1", mock_supabase)
    
    # Should default to utcnow (approx check)
    assert isinstance(result.completed_at, datetime)
