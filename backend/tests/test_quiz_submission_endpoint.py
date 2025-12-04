import os
# Set dummy API key to avoid pydantic-ai import error
os.environ["GOOGLE_API_KEY"] = "dummy_key"

from fastapi.testclient import TestClient
from app.main import app
from jose import jwt
import pytest
from unittest.mock import AsyncMock, patch
from app.models.quiz_submission import QuizStartResponse, QuestionDisplay, QuizSubmissionResponse
from app.models.quiz import OptionResponse

client = TestClient(app)

# Mock Data
mock_quiz_start_response = QuizStartResponse(
    attempt_id="attempt-uuid",
    quiz_id="quiz-uuid",
    quiz_title="Test Quiz",
    total_questions=5,
    current_question_index=0,
    first_question=QuestionDisplay(
        id="q1",
        question_text="Question 1?",
        options=[
            OptionResponse(id="o1", option_text="A", option_index=0),
            OptionResponse(id="o2", option_text="B", option_index=1),
            OptionResponse(id="o3", option_text="C", option_index=2),
            OptionResponse(id="o4", option_text="D", option_index=3)
        ]
    )
)

@pytest.fixture
def auth_headers(monkeypatch):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    payload = {"sub": "user-uuid", "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}

@patch("app.api.routers.quiz.submit_answer", new_callable=AsyncMock)
def test_submit_answer_endpoint_success(mock_submit_answer, auth_headers):
    mock_response = QuizSubmissionResponse(
        is_correct=True,
        correct_answer_id="o1",
        feedback_text="Correct!",
        explanation="Exp"
    )
    mock_submit_answer.return_value = mock_response
    
    payload = {
        "attempt_id": "attempt-uuid",
        "question_id": "q1",
        "answer_id": "o1"
    }
    
    response = client.post(
        "/api/v1/quiz/quiz-uuid/answer",
        headers=auth_headers,
        json=payload
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["is_correct"] == True
    assert data["feedback_text"] == "Correct!"
    
    mock_submit_answer.assert_called_once()

@patch("app.api.routers.quiz.start_quiz_attempt", new_callable=AsyncMock)
def test_start_quiz_success(mock_start_quiz, auth_headers):
    mock_start_quiz.return_value = mock_quiz_start_response
    
    response = client.get(
        "/api/v1/quiz/quiz-uuid/start",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["attempt_id"] == "attempt-uuid"
    assert data["first_question"]["id"] == "q1"
    # Verify service was called correctly
    # Note: 'pytest.any(object)' is not valid syntax, relying on checking args[0] and args[1]
    mock_start_quiz.assert_called_once()
    args = mock_start_quiz.call_args[0]
    assert args[0] == "quiz-uuid"
    assert args[1] == "user-uuid"

@patch("app.api.routers.quiz.start_quiz_attempt", new_callable=AsyncMock)
def test_start_quiz_not_found(mock_start_quiz, auth_headers):
    from fastapi import HTTPException
    mock_start_quiz.side_effect = HTTPException(status_code=404, detail="Quiz not found")
    
    response = client.get(
        "/api/v1/quiz/invalid-uuid/start",
        headers=auth_headers
    )
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Quiz not found"
