import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException
from app.services.quiz_service import generate_quiz
from app.models.quiz import QuizGenerateRequest, QuizGenerated, QuestionGenerated

@pytest.mark.asyncio
async def test_generate_quiz_service_success():
    # Mock Supabase Client
    mock_supabase = MagicMock()
    
    def mock_table(name):
        mock_t = MagicMock()
        if name == "notes":
            mock_notes_resp = MagicMock()
            mock_notes_resp.data = [{'content': "Lecture content"}]
            mock_t.select.return_value.in_.return_value.execute.return_value = mock_notes_resp
        elif name == "system_prompts":
             mock_prompt_resp = MagicMock()
             mock_prompt_resp.data = {'template': "Prompt {{notes}} {{quiz_length}}"}
             mock_t.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_prompt_resp
        elif name == "quizzes":
             mock_insert = MagicMock()
             mock_insert.data = [{'id': 'quiz-123'}]
             mock_t.insert.return_value.execute.return_value = mock_insert
        elif name == "quiz_questions":
             mock_insert = MagicMock()
             mock_insert.data = [{'id': 'q-123'}]
             mock_t.insert.return_value.execute.return_value = mock_insert
        elif name == "quiz_options":
             mock_insert = MagicMock()
             mock_insert.data = [{'id': 'opt-123', 'option_text': 'A', 'option_index': 0}]
             mock_t.insert.return_value.execute.return_value = mock_insert
        return mock_t
    
    mock_supabase.table.side_effect = mock_table
    
    # Mock Agent
    mock_agent_output = QuizGenerated(
        title="Gen Quiz",
        questions=[
            QuestionGenerated(question_text="Q1", options=["A","B","C","D"], correct_answer_index=0, explanation="Exp")
        ]
    )
    
    with patch("app.services.quiz_service.generate_quiz_content", new_callable=AsyncMock) as mock_agent_call:
        mock_agent_call.return_value = mock_agent_output
        
        request = QuizGenerateRequest(lecture_ids=["123"], quiz_length=5)
        user_id = "user-1"
        
        response = await generate_quiz(request, user_id, mock_supabase)
        
        assert response.id == "quiz-123"
        assert response.title == "Gen Quiz"
        assert len(response.questions) == 1
        assert response.questions[0].question_text == "Q1"

@pytest.mark.asyncio
async def test_generate_quiz_service_no_notes():
    mock_supabase = MagicMock()
    
    def mock_table(name):
        mock_t = MagicMock()
        if name == "notes":
             mock_notes_resp = MagicMock()
             mock_notes_resp.data = [] # No notes
             mock_t.select.return_value.in_.return_value.execute.return_value = mock_notes_resp
        return mock_t

    mock_supabase.table.side_effect = mock_table
    
    request = QuizGenerateRequest(lecture_ids=["123"], quiz_length=5)
    
    with pytest.raises(HTTPException) as excinfo:
        await generate_quiz(request, "user-1", mock_supabase)
    
    assert excinfo.value.status_code == 400
    assert "No notes found" in excinfo.value.detail
