from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from app.models.quiz import OptionResponse

# --- Display Models (Safe for Frontend) ---
class QuestionDisplay(BaseModel):
    id: str
    question_text: str
    options: List[OptionResponse]
    
    # Exclude correct_answer and explanation to prevent cheating

class QuizStartResponse(BaseModel):
    attempt_id: str
    quiz_id: str
    quiz_title: str
    total_questions: int
    current_question_index: int
    first_question: QuestionDisplay

# --- Database/Internal Models ---
class QuizAttempt(BaseModel):
    id: str
    user_id: str
    quiz_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    score: Optional[int] = None
    status: str = "in_progress" # in_progress, completed
    current_question_index: int = 0
