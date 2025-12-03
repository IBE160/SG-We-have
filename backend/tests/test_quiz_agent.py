import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.agents.quiz_agent import generate_quiz_content
from app.models.quiz import QuizGenerated, QuestionGenerated

@pytest.mark.asyncio
async def test_generate_quiz_content_success():
    # Mock data
    mock_quiz_data = QuizGenerated(
        title="Test Quiz",
        questions=[
            QuestionGenerated(
                question_text="What is 2+2?",
                options=["1", "2", "3", "4"],
                correct_answer_index=3,
                explanation="2+2 equals 4"
            )
        ]
    )
    
    # Mock the result object returned by agent.run
    mock_result = MagicMock()
    mock_result.data = mock_quiz_data
    
    # Patch the quiz_agent instance in the module
    with patch("app.agents.quiz_agent.quiz_agent.run", new_callable=AsyncMock) as mock_run:
        mock_run.return_value = mock_result
        
        result = await generate_quiz_content("Test prompt")
        
        assert result.title == "Test Quiz"
        assert len(result.questions) == 1
        assert result.questions[0].question_text == "What is 2+2?"
        mock_run.assert_called_once()

@pytest.mark.asyncio
async def test_generate_quiz_content_structure():
    mock_quiz_data = QuizGenerated(
        title="Structure Test",
        questions=[
             QuestionGenerated(
                question_text="Q1",
                options=["A", "B", "C", "D"],
                correct_answer_index=0,
                explanation="Exp"
            )
        ]
    )
    
    mock_result = MagicMock()
    mock_result.data = mock_quiz_data
    
    with patch("app.agents.quiz_agent.quiz_agent.run", new_callable=AsyncMock) as mock_run:
        mock_run.return_value = mock_result
        result = await generate_quiz_content("Prompt")
        assert isinstance(result, QuizGenerated)
        assert isinstance(result.questions[0], QuestionGenerated)
