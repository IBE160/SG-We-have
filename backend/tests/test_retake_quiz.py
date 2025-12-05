import pytest
from unittest.mock import MagicMock
from app.services.quiz_submission import retake_quiz

@pytest.mark.asyncio
async def test_retake_quiz_success():
    mock_supabase = MagicMock()
    
    # Reuse the start_quiz_attempt mocks as retake calls it
    mock_quiz_res = MagicMock()
    mock_quiz_res.data = {"title": "Test Quiz", "user_id": "user-1"}
    
    mock_attempt_res = MagicMock()
    mock_attempt_res.data = [{"id": "new-attempt-id"}]
    
    mock_questions_res = MagicMock()
    mock_questions_res.data = [{
        "id": "q1",
        "question_text": "Test Q",
        "quiz_options": [
            {"id": "opt1", "option_text": "A", "option_index": 0}
        ]
    }]

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
    
    result = await retake_quiz("quiz-1", "user-1", mock_supabase, previous_attempt_id="old-attempt-1")
    
    assert result.attempt_id == "new-attempt-id"
    assert result.quiz_id == "quiz-1"
    assert result.current_question_index == 0
