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

    # Patch in the lectures router
    monkeypatch.setattr("app.api.routers.lectures.get_supabase_client", mock_get_client)
    return mock_client

def test_create_lecture_success(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    user_id = "123"
    course_id = "course-1"
    payload = {"sub": user_id, "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")

    # Setup mock for Course Ownership Check
    mock_table_courses = MagicMock()
    mock_select_courses = MagicMock()
    mock_eq_courses = MagicMock()
    mock_execute_courses = MagicMock()
    
    # Chain for courses
    mock_select_courses.eq.return_value = mock_execute_courses
    mock_execute_courses.execute.return_value = MagicMock(data=[{"user_id": user_id}])

    # Setup mock for Lecture Insert
    mock_insert_lectures_method = MagicMock() # This mimics the .insert() method
    mock_execute_lectures = MagicMock()       # This mimics the result of .insert()
    
    # Chain for lectures
    mock_insert_lectures_method.return_value = mock_execute_lectures
    mock_execute_lectures.execute.return_value = MagicMock(
        data=[{"id": "lec-1", "course_id": course_id, "title": "Intro to AI", "created_at": "2023-01-01"}]
    )

    # Side effect to route table() calls
    def side_effect_table(table_name):
        if table_name == "courses":
            # return a mock that has .select().eq().execute()
            m = MagicMock()
            m.select.return_value = mock_select_courses
            return m
        elif table_name == "lectures":
             # return a mock that has .insert().execute()
            m = MagicMock()
            m.insert = mock_insert_lectures_method
            return m
        return MagicMock()

    mock_supabase.table.side_effect = side_effect_table

    response = client.post(
        f"/api/v1/courses/{course_id}/lectures",
        json={"title": "Intro to AI"},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Intro to AI"
    assert data["course_id"] == course_id

    # Verify Course Ownership Check
    mock_select_courses.eq.assert_called_with("id", course_id)
    
    # Verify Lecture Insert
    args, _ = mock_insert_lectures_method.call_args
    assert args[0]["course_id"] == course_id
    assert args[0]["title"] == "Intro to AI"


def test_create_lecture_forbidden(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    user_id = "123"
    other_user_id = "456"
    course_id = "course-1"
    payload = {"sub": user_id, "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")

    # Setup mock for Course Ownership Check (User mismatch)
    mock_select_courses = MagicMock()
    mock_execute_courses = MagicMock()
    mock_select_courses.eq.return_value = mock_execute_courses
    mock_execute_courses.execute.return_value = MagicMock(data=[{"user_id": other_user_id}])

    def side_effect_table(table_name):
        if table_name == "courses":
            m = MagicMock()
            m.select.return_value = mock_select_courses
            return m
        return MagicMock()

    mock_supabase.table.side_effect = side_effect_table

    response = client.post(
        f"/api/v1/courses/{course_id}/lectures",
        json={"title": "Hacking Attempt"},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to access this course"


def test_create_lecture_course_not_found(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    user_id = "123"
    course_id = "course-missing"
    payload = {"sub": user_id, "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")

    # Setup mock for Course Ownership Check (Empty data)
    mock_select_courses = MagicMock()
    mock_execute_courses = MagicMock()
    mock_select_courses.eq.return_value = mock_execute_courses
    mock_execute_courses.execute.return_value = MagicMock(data=[]) # Not found

    def side_effect_table(table_name):
        if table_name == "courses":
            m = MagicMock()
            m.select.return_value = mock_select_courses
            return m
        return MagicMock()

    mock_supabase.table.side_effect = side_effect_table

    response = client.post(
        f"/api/v1/courses/{course_id}/lectures",
        json={"title": "Ghost Lecture"},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Course not found"


def test_get_lectures_success(monkeypatch, mock_supabase):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    user_id = "123"
    course_id = "course-1"
    payload = {"sub": user_id, "aud": "authenticated"}
    token = jwt.encode(payload, secret, algorithm="HS256")

    # Setup mock for Course Ownership Check
    mock_select_courses = MagicMock()
    mock_execute_courses = MagicMock()
    mock_select_courses.eq.return_value = mock_execute_courses
    mock_execute_courses.execute.return_value = MagicMock(data=[{"user_id": user_id}])

    # Setup mock for Lecture Select
    mock_select_lectures = MagicMock()
    mock_eq_lectures = MagicMock()
    mock_order_lectures = MagicMock()
    mock_execute_lectures = MagicMock()

    # Chain: table("lectures").select("*").eq("course_id", c_id).order().execute()
    mock_select_lectures.eq.return_value = mock_eq_lectures
    mock_eq_lectures.order.return_value = mock_order_lectures
    mock_order_lectures.execute.return_value = MagicMock(
        data=[
            {"id": "l2", "course_id": course_id, "title": "Lec 2", "created_at": "2023-01-02"},
            {"id": "l1", "course_id": course_id, "title": "Lec 1", "created_at": "2023-01-01"}
        ]
    )

    # Setup mock for Notes Check
    mock_select_notes = MagicMock()
    mock_in_notes = MagicMock()
    mock_execute_notes = MagicMock()
    
    # Chain: table("notes").select("lecture_id").in_("lecture_id", ids).execute()
    mock_select_notes.in_.return_value = mock_execute_notes
    mock_execute_notes.execute.return_value = MagicMock(
        data=[{"lecture_id": "l2"}] # Only Lec 2 has notes
    )

    def side_effect_table(table_name):
        if table_name == "courses":
            m = MagicMock()
            m.select.return_value = mock_select_courses
            return m
        elif table_name == "lectures":
            m = MagicMock()
            m.select.return_value = mock_select_lectures
            return m
        elif table_name == "notes":
            m = MagicMock()
            m.select.return_value = mock_select_notes
            return m
        return MagicMock()

    mock_supabase.table.side_effect = side_effect_table

    response = client.get(
        f"/api/v1/courses/{course_id}/lectures",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Lec 2"
    assert data[0]["has_notes"] == True
    assert data[1]["title"] == "Lec 1"
    assert data[1]["has_notes"] == False

    # Verify calls
    mock_select_lectures.eq.assert_called_with("course_id", course_id)
    mock_eq_lectures.order.assert_called_with("created_at", desc=True)
    # verify notes query logic if needed, but checking result is sufficient
