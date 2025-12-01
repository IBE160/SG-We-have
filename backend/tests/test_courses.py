from fastapi.testclient import TestClient
from app.main import app
from jose import jwt
import pytest
from unittest.mock import MagicMock

client = TestClient(app)

@pytest.fixture
def mock_supabase(monkeypatch):
    mock_client = MagicMock()
    # Mock the chain: supabase.table().insert().execute()
    mock_table = MagicMock()
    mock_insert = MagicMock()
    mock_execute = MagicMock()
    
    mock_client.table.return_value = mock_table
    mock_table.insert.return_value = mock_insert
    mock_insert.execute.return_value = mock_execute
    
    # Default successful response
    mock_execute.data = [{"id": "course-123", "name": "Test Course", "user_id": "123"}]
    
    def mock_get_client():
        return mock_client

    # Patch the get_supabase_client function in the router module
    # We must patch it where it is USED (imported), not where it is defined,
    # because the module has already imported it.
    monkeypatch.setattr("app.api.routers.courses.get_supabase_client", mock_get_client)
    return mock_client

def test_create_course_success(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    payload = {"sub": "123", "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")
    
    response = client.post(
        "/api/v1/courses",
        json={"name": "Distributed Systems"},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Course"
    
    # Verify calls
    mock_supabase.table.assert_called_with("courses")
    args, _ = mock_supabase.table().insert.call_args
    assert args[0]["user_id"] == "123"
    assert args[0]["name"] == "Distributed Systems"

def test_create_course_empty_name(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    payload = {"sub": "123", "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")
    
    response = client.post(
        "/api/v1/courses",
        json={"name": "   "},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 422
    assert response.json()["detail"] == "Course name cannot be empty"

def test_create_course_no_auth(mock_supabase):
    response = client.post(
        "/api/v1/courses",
        json={"name": "Distributed Systems"}
    )
    # FastAPI HTTPBearer raises 401 or 403 depending on version/config.
    # The actual response was 401.
    assert response.status_code == 401
