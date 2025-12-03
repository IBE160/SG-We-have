from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, field_validator
from typing import List
from app.core.security import get_current_user

router = APIRouter()

class QuizGenerationRequest(BaseModel):
    lecture_ids: List[str] = Field(..., min_length=1, description="List of lecture IDs to generate quiz from")
    quiz_length: int = Field(..., description="Number of questions in the quiz (5, 10, 15, 20, 25, 30)")

    @field_validator('quiz_length')
    @classmethod
    def validate_length(cls, v: int) -> int:
        allowed_lengths = [5, 10, 15, 20, 25, 30]
        if v not in allowed_lengths:
            raise ValueError(f"Quiz length must be one of {allowed_lengths}")
        return v

class QuizGenerationResponse(BaseModel):
    quiz_id: str
    message: str
    quiz_length: int

@router.post("/quiz/generate", response_model=QuizGenerationResponse)
async def generate_quiz(request: QuizGenerationRequest, current_user: dict = Depends(get_current_user)):
    # Logic to generate quiz would go here (Story 3.4)
    # For now, we just acknowledge the request as per this story's scope
    
    return {
        "quiz_id": "temp-quiz-id-placeholder",
        "message": f"Quiz generation initiated for {len(request.lecture_ids)} lectures with {request.quiz_length} questions.",
        "quiz_length": request.quiz_length
    }
