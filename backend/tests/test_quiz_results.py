import os
# Set dummy API key to avoid pydantic-ai import error
os.environ["GOOGLE_API_KEY"] = "dummy_key"

from fastapi.testclient import TestClient
from app.main import app
from jose import jwt
import pytest
from unittest.mock import AsyncMock, patch
from app.models.quiz_submission import QuizResultResponse
from datetime import datetime

client = TestClient(app)

@pytest.fixture
def auth_headers(monkeypatch):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    payload = {"sub": "user-uuid", "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}

@patch("app.api.routers.quiz.get_quiz_results", new_callable=AsyncMock)
def test_get_quiz_results_success(mock_get_results, auth_headers):
    mock_response = QuizResultResponse(
        score=8,
        total_questions=10,
        percentage=80.0,
        completed_at=datetime.utcnow()
    )
    mock_get_results.return_value = mock_response
    
    response = client.get(
        "/api/v1/quiz/quiz-uuid/results?attempt_id=attempt-uuid",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 8
    assert data["total_questions"] == 10
    assert data["percentage"] == 80.0
    
    mock_get_results.assert_called_once()
    args = mock_get_results.call_args[0]
    assert args[0] == "quiz-uuid"
    assert args[1] == "attempt-uuid"
    assert args[2] == "user-uuid"

@patch("app.api.routers.quiz.get_quiz_results", new_callable=AsyncMock)
def test_get_quiz_results_not_found(mock_get_results, auth_headers):
    from fastapi import HTTPException
    mock_get_results.side_effect = HTTPException(status_code=404, detail="Quiz attempt not found")
    
    response = client.get(
        "/api/v1/quiz/quiz-uuid/results?attempt_id=invalid-uuid",
        headers=auth_headers
    )
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Quiz attempt not found"

def test_get_quiz_results_missing_param(auth_headers):
    response = client.get(
        "/api/v1/quiz/quiz-uuid/results",
        headers=auth_headers
    )
    assert response.status_code == 422 # Validation Error for missing attempt_id
