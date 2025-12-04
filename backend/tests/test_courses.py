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
    mock_execute.data = [{"id": "course-123", "name": "Test Course", "user_id": "123", "created_at": "2023-01-01"}]
    
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
    # API returns "name"
    assert data["name"] == "Test Course"
    
    # Verify calls
    mock_supabase.table.assert_called_with("courses")
    args, _ = mock_supabase.table().insert.call_args
    assert args[0]["user_id"] == "123"
    # DB insert used "name"
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

def test_get_courses_success(monkeypatch, mock_supabase):
    # Configure mock for Select chain
    mock_select = MagicMock()
    mock_eq = MagicMock()
    mock_order = MagicMock()
    mock_execute = MagicMock()

    # Connect the chain
    mock_supabase.table.return_value.select.return_value = mock_select
    mock_select.eq.return_value = mock_eq
    mock_eq.order.return_value = mock_order
    mock_order.execute.return_value = mock_execute

    # Set data
    mock_execute.data = [
        {"id": "c1", "name": "Course 1", "user_id": "123", "created_at": "2023-01-01T00:00:00Z"},
        {"id": "c2", "name": "Course 2", "user_id": "123", "created_at": "2023-01-02T00:00:00Z"}
    ]

    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    payload = {"sub": "123", "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")
    
    response = client.get(
        "/api/v1/courses",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["id"] == "c1"
    # API maps title -> name
    assert data[0]["name"] == "Course 1"

    # Verify calls
    mock_supabase.table.assert_called_with("courses")
    mock_supabase.table().select.assert_called_with("*")
    mock_select.eq.assert_called_with("user_id", "123")
    mock_eq.order.assert_called_with("created_at", desc=True)

def test_get_courses_unauth(mock_supabase):
    response = client.get("/api/v1/courses")
    assert response.status_code == 401