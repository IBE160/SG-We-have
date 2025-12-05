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

class QuizSubmissionRequest(BaseModel):
    attempt_id: str
    question_id: str
    answer_id: str

class QuizSubmissionResponse(BaseModel):
    is_correct: bool
    correct_answer_id: str
    feedback_text: str
    explanation: Optional[str] = None

class QuizNextRequest(BaseModel):
    attempt_id: str

class QuizPreviousRequest(BaseModel):
    attempt_id: str

class QuizNextResponse(BaseModel):
    attempt_id: str
    current_question_index: int
    total_questions: int
    is_complete: bool
    next_question: Optional[QuestionDisplay] = None
    existing_answer: Optional[QuizSubmissionResponse] = None
    selected_option_id: Optional[str] = None

class QuizPreviousResponse(BaseModel):
    attempt_id: str
    current_question_index: int
    total_questions: int
    previous_question: Optional[QuestionDisplay] = None
    existing_answer: Optional[QuizSubmissionResponse] = None
    selected_option_id: Optional[str] = None

class QuizRetakeRequest(BaseModel):
    attempt_id: Optional[str] = None

class QuizResultResponse(BaseModel):
    score: int
    total_questions: int
    percentage: float
    completed_at: datetime
