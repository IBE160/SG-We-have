import json
import os
from typing import Optional, Dict, Any

MOCK_FILE = os.path.join(os.path.dirname(__file__), "../../tmp/mock_db.json")

def _load_db() -> Dict[str, Any]:
    if not os.path.exists(MOCK_FILE):
        return {"quizzes": {}, "attempts": {}}
    try:
        with open(MOCK_FILE, "r") as f:
            return json.load(f)
    except:
        return {"quizzes": {}, "attempts": {}}

def _save_db(data: Dict[str, Any]):
    os.makedirs(os.path.dirname(MOCK_FILE), exist_ok=True)
    with open(MOCK_FILE, "w") as f:
        json.dump(data, f, indent=2)

def save_mock_quiz(quiz_data: Dict[str, Any]):
    db = _load_db()
    db["quizzes"][quiz_data["id"]] = quiz_data
    _save_db(db)

def get_mock_quiz(quiz_id: str) -> Optional[Dict[str, Any]]:
    db = _load_db()
    return db["quizzes"].get(quiz_id)

def save_mock_attempt(attempt_data: Dict[str, Any]):
    db = _load_db()
    db["attempts"][attempt_data["id"]] = attempt_data
    _save_db(db)

def get_mock_attempt(attempt_id: str) -> Optional[Dict[str, Any]]:
    db = _load_db()
    return db["attempts"].get(attempt_id)
