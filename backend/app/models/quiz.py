from pydantic import BaseModel, Field, field_validator
from typing import List
from uuid import UUID
from datetime import datetime

# --- AI Output Models ---
class QuestionGenerated(BaseModel):
    question_text: str = Field(..., description="The text of the multiple-choice question.")
    options: List[str] = Field(..., min_length=4, max_length=4, description="Four possible answer options.")
    correct_answer_index: int = Field(..., ge=0, lt=4, description="Index of the correct answer (0-3).")
    explanation: str = Field(..., description="Brief explanation for the correct answer.")

class QuizGenerated(BaseModel):
    title: str = Field(..., description="Title of the quiz.")
    questions: List[QuestionGenerated] = Field(..., description="List of generated questions.")

# --- API Request Models ---
class QuizGenerateRequest(BaseModel):
    note_ids: List[str] # Receiving as strings (UUIDs) from JSON
    quiz_length: int = Field(..., description="Number of questions in the quiz (5, 10, 15, 20, 25, 30)")

    @field_validator('quiz_length')
    @classmethod
    def validate_length(cls, v: int) -> int:
        allowed_lengths = [5, 10, 15, 20, 25, 30]
        if v not in allowed_lengths:
            raise ValueError(f"Quiz length must be one of {allowed_lengths}")
        return v

# --- API Response Models ---
class OptionResponse(BaseModel):
    id: str
    option_text: str
    option_index: int

class QuestionResponse(BaseModel):
    id: str
    question_text: str
    options: List[OptionResponse]
    correct_answer_index: int
    explanation: str

class QuizResponse(BaseModel):
    id: str
    title: str
    questions: List[QuestionResponse]

class QuizHistoryItem(BaseModel):
    id: str
    title: str
    created_at: datetime
    course_id: str | None

QuizHistoryResponse = List[QuizHistoryItem]

class QuizUpdateRequest(BaseModel):
    title: str
