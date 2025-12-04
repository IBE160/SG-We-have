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

# --- POST /courses/{id}/notes ---

def test_create_note_success(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    user_id = "123"
    course_id = "c1"
    payload = {"sub": user_id, "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")

    # Mock Course Ownership Check
    mock_courses_select = MagicMock()
    mock_courses_eq = MagicMock()
    mock_courses_execute = MagicMock()
    
    mock_courses_select.eq.return_value = mock_courses_eq
    mock_courses_eq.execute.return_value = MagicMock(data=[{"user_id": user_id}])

    # Mock Notes Insert
    mock_notes_insert = MagicMock()
    mock_notes_execute = MagicMock()
    
    mock_notes_insert.execute.return_value = MagicMock(
        data=[{"id": "n1", "course_id": course_id, "title": "New Note", "content": "", "created_at": "now"}]
    )
    
    mock_notes_table = MagicMock()
    mock_notes_table.insert.return_value = mock_notes_insert

    def side_effect_table(table_name):
        if table_name == "courses":
            m = MagicMock()
            m.select.return_value = mock_courses_select
            return m
        elif table_name == "notes":
            return mock_notes_table
        return MagicMock()

    mock_supabase.table.side_effect = side_effect_table

    response = client.post(
        f"/api/v1/courses/{course_id}/notes",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "New Note"}
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "New Note"
    assert data["id"] == "n1"

# --- GET /courses/{id}/notes ---

def test_get_notes_list_success(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    user_id = "123"
    course_id = "c1"
    payload = {"sub": user_id, "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")

    # Mock Course Ownership Check
    mock_courses_select = MagicMock()
    mock_courses_eq = MagicMock()
    mock_courses_eq.execute.return_value = MagicMock(data=[{"user_id": user_id}])

    # Mock Notes Select
    mock_notes_select = MagicMock()
    mock_notes_eq = MagicMock()
    mock_notes_order = MagicMock()
    
    mock_notes_select.eq.return_value = mock_notes_eq
    mock_notes_eq.order.return_value = mock_notes_order
    mock_notes_order.execute.return_value = MagicMock(
        data=[
            {"id": "n1", "course_id": course_id, "title": "Note 1", "content": ""},
            {"id": "n2", "course_id": course_id, "title": "Note 2", "content": ""}
        ]
    )

    def side_effect_table(table_name):
        if table_name == "courses":
            m = MagicMock()
            m.select.return_value = mock_courses_select
            return m
        elif table_name == "notes":
            m = MagicMock()
            m.select.return_value = mock_notes_select
            return m
        return MagicMock()

    mock_supabase.table.side_effect = side_effect_table

    response = client.get(
        f"/api/v1/courses/{course_id}/notes",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Note 1"

# --- GET /notes/{id} ---

def test_get_note_detail_success(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    user_id = "123"
    note_id = "n1"
    payload = {"sub": user_id, "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")

    # Mock Note Ownership/Existence (via join)
    # The code does: supabase.table("notes").select("course_id, courses!inner(user_id)").eq("id", note_id)
    # Then: supabase.table("notes").select("*").eq("id", note_id)
    
    mock_ownership_select = MagicMock()
    mock_ownership_eq = MagicMock()
    mock_ownership_eq.execute.return_value = MagicMock(
        data=[{"course_id": "c1", "courses": {"user_id": user_id}}]
    )
    
    mock_detail_select = MagicMock()
    mock_detail_eq = MagicMock()
    mock_detail_eq.execute.return_value = MagicMock(
        data=[{"id": note_id, "course_id": "c1", "title": "Note 1", "content": "Content"}]
    )

    def side_effect_table(table_name):
        if table_name == "notes":
            m = MagicMock()
            # We need to distinguish calls. 
            # Since we can't easily inspect chained calls in side_effect without complex logic,
            # we'll just return a mock that handles both chains or use `side_effect` on the mock methods.
            # Simpler: Return a mock that returns successful data for both ownership and detail checks.
            # However, ownership check selects specific columns.
            
            m.select.side_effect = [mock_ownership_select, mock_detail_select]
            return m
        return MagicMock()

    mock_supabase.table.side_effect = side_effect_table

    response = client.get(
        f"/api/v1/notes/{note_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "Content"

# --- PUT /notes/{id} ---

def test_update_note_success(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    user_id = "123"
    note_id = "n1"
    payload = {"sub": user_id, "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")

    # Mock Ownership
    mock_ownership_select = MagicMock()
    mock_ownership_eq = MagicMock()
    mock_ownership_eq.execute.return_value = MagicMock(
        data=[{"course_id": "c1", "courses": {"user_id": user_id}}]
    )
    
    # Mock Update
    mock_update = MagicMock()
    mock_update_eq = MagicMock()
    mock_update.eq.return_value = mock_update_eq
    mock_update_eq.execute.return_value = MagicMock(
        data=[{"id": note_id, "content": "Updated", "updated_at": "now"}]
    )
    
    mock_notes_table = MagicMock()
    mock_notes_table.select.return_value = mock_ownership_select
    mock_notes_table.update.return_value = mock_update

    def side_effect_table(table_name):
        if table_name == "notes":
            return mock_notes_table
        return MagicMock()

    mock_supabase.table.side_effect = side_effect_table

    response = client.put(
        f"/api/v1/notes/{note_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"content": "Updated"}
    )

    assert response.status_code == 200
    assert response.json()["content"] == "Updated"