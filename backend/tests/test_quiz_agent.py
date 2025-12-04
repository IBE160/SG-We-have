import pytest
import os
from unittest.mock import AsyncMock, MagicMock, patch
from pydantic_ai import RunContext
from app.agents.quiz_agent import generate_quiz_content, search_web
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

@pytest.mark.asyncio
async def test_search_web_success():
    # Mock environment variables
    with patch.dict(os.environ, {
        "GOOGLE_SEARCH_API_KEY": "test_key",
        "GOOGLE_CSE_ID": "test_cx"
    }):
        # Mock httpx response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "items": [
                {"title": "Result 1", "snippet": "Snippet 1"},
                {"title": "Result 2", "snippet": "Snippet 2"}
            ]
        }
        mock_response.raise_for_status = MagicMock()

        # Mock httpx.AsyncClient
        mock_client = AsyncMock()
        mock_client.__aenter__.return_value = mock_client
        mock_client.get.return_value = mock_response

        with patch("httpx.AsyncClient", return_value=mock_client):
            ctx = MagicMock(spec=RunContext)
            result = await search_web(ctx, "test query")
            
            assert "Result 1" in result
            assert "Snippet 1" in result
            assert "Result 2" in result
            
            mock_client.get.assert_called_once()
            # Check arguments
            args, kwargs = mock_client.get.call_args
            assert kwargs["params"]["q"] == "test query"
            assert kwargs["params"]["key"] == "test_key"
            assert kwargs["params"]["cx"] == "test_cx"

@pytest.mark.asyncio
async def test_search_web_no_config():
    # Mock environment variables to be empty
    # We need to clear both potential keys
    with patch.dict(os.environ, {}, clear=True):
        ctx = MagicMock(spec=RunContext)
        result = await search_web(ctx, "test query")
        assert "System Error" in result
        assert "not configured" in result

@pytest.mark.asyncio
async def test_search_web_api_error():
    with patch.dict(os.environ, {
        "GOOGLE_SEARCH_API_KEY": "test_key",
        "GOOGLE_CSE_ID": "test_cx"
    }):
        mock_client = AsyncMock()
        mock_client.__aenter__.return_value = mock_client
        mock_client.get.side_effect = Exception("API Error")
        
        with patch("httpx.AsyncClient", return_value=mock_client):
            ctx = MagicMock(spec=RunContext)
            result = await search_web(ctx, "test query")
            assert "Error performing search" in result
            assert "API Error" in result