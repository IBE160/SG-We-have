from fastapi.testclient import TestClient
from app.main import app
from jose import jwt
import pytest
from unittest.mock import MagicMock

client = TestClient(app)

@pytest.fixture
def mock_supabase(monkeypatch):
    mock_client = MagicMock()
    
    def mock_get_client():
        return mock_client

    # Patch in the notes router
    monkeypatch.setattr("app.api.routers.notes.get_supabase_client", mock_get_client)
    return mock_client

def test_get_notes_success(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    user_id = "123"
    lecture_id = "lec-1"
    payload = {"sub": user_id, "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")

    # Mock Ownership Check
    mock_lectures_select = MagicMock()
    mock_lectures_eq = MagicMock()
    mock_lectures_execute = MagicMock()
    
    mock_lectures_select.eq.return_value = mock_lectures_eq
    mock_lectures_eq.execute.return_value = MagicMock(
        data=[{"course_id": "c1", "courses": {"user_id": user_id}}]
    )

    # Mock Notes Select
    mock_notes_select = MagicMock()
    mock_notes_eq = MagicMock()
    mock_notes_execute = MagicMock()

    mock_notes_select.eq.return_value = mock_notes_eq
    mock_notes_eq.execute.return_value = MagicMock(
        data=[{"id": "n1", "lecture_id": lecture_id, "content": "<p>Notes</p>", "updated_at": "2023-01-01"}]
    )

    def side_effect_table(table_name):
        if table_name == "lectures":
            m = MagicMock()
            m.select.return_value = mock_lectures_select
            return m
        elif table_name == "notes":
            m = MagicMock()
            m.select.return_value = mock_notes_select
            return m
        return MagicMock()

    mock_supabase.table.side_effect = side_effect_table

    response = client.get(
        f"/api/v1/lectures/{lecture_id}/notes",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "<p>Notes</p>"
    
    mock_lectures_select.eq.assert_called_with("id", lecture_id)
    mock_notes_select.eq.assert_called_with("lecture_id", lecture_id)

def test_get_notes_not_found(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    user_id = "123"
    lecture_id = "lec-1"
    payload = {"sub": user_id, "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")

    # Mock Ownership Check (Success)
    mock_lectures_select = MagicMock()
    mock_lectures_eq = MagicMock()
    
    mock_lectures_select.eq.return_value = mock_lectures_eq
    mock_lectures_eq.execute.return_value = MagicMock(
        data=[{"course_id": "c1", "courses": {"user_id": user_id}}]
    )

    # Mock Notes Select (Empty)
    mock_notes_select = MagicMock()
    mock_notes_eq = MagicMock()

    mock_notes_select.eq.return_value = mock_notes_eq
    mock_notes_eq.execute.return_value = MagicMock(data=[])

    def side_effect_table(table_name):
        if table_name == "lectures":
            m = MagicMock()
            m.select.return_value = mock_lectures_select
            return m
        elif table_name == "notes":
            m = MagicMock()
            m.select.return_value = mock_notes_select
            return m
        return MagicMock()

    mock_supabase.table.side_effect = side_effect_table

    response = client.get(
        f"/api/v1/lectures/{lecture_id}/notes",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Notes not found"

def test_get_notes_forbidden(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    user_id = "123"
    other_user = "456"
    lecture_id = "lec-1"
    payload = {"sub": user_id, "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")

    # Mock Ownership Check (Fail)
    mock_lectures_select = MagicMock()
    mock_lectures_eq = MagicMock()
    
    mock_lectures_select.eq.return_value = mock_lectures_eq
    mock_lectures_eq.execute.return_value = MagicMock(
        data=[{"course_id": "c1", "courses": {"user_id": other_user}}]
    )

    def side_effect_table(table_name):
        if table_name == "lectures":
            m = MagicMock()
            m.select.return_value = mock_lectures_select
            return m
        return MagicMock()

    mock_supabase.table.side_effect = side_effect_table

    response = client.get(
        f"/api/v1/lectures/{lecture_id}/notes",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to access this lecture"
