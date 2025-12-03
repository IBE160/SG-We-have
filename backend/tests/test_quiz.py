from fastapi.testclient import TestClient
from app.main import app
from jose import jwt
import pytest

client = TestClient(app)

def test_generate_quiz_valid_length(monkeypatch):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    payload = {"sub": "123", "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")
    
    response = client.post(
        "/api/v1/quiz/generate",
        json={"lecture_ids": ["lec-1"], "quiz_length": 10},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["quiz_length"] == 10
    assert "Quiz generation initiated" in data["message"]

def test_generate_quiz_invalid_length(monkeypatch):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    payload = {"sub": "123", "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")
    
    # Test length 7 (not in [5, 10, ...])
    response = client.post(
        "/api/v1/quiz/generate",
        json={"lecture_ids": ["lec-1"], "quiz_length": 7},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 422 

def test_generate_quiz_no_lectures(monkeypatch):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    payload = {"sub": "123", "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")
    
    response = client.post(
        "/api/v1/quiz/generate",
        json={"lecture_ids": [], "quiz_length": 10},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 422
