import os
from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel
from app.models.quiz import QuizGenerated

# Get API key from environment
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    os.environ["GOOGLE_API_KEY"] = api_key

# Using gemini-2.5-flash as requested.
model = GoogleModel('gemini-2.5-flash')

quiz_agent = Agent(
    model,
    system_prompt=(
        "You are an expert educational AI assistant. Create multiple-choice quizzes from the provided lecture notes. "
        "Ensure questions are directly relevant to the content, factually accurate, and pedagogically sound. "
        "Each question must have exactly one correct answer and three plausible but incorrect distractors. "
        "Do not use 'All of the above' or 'None of the above' as options."
    )
)

async def generate_quiz_content(prompt: str) -> QuizGenerated:
    """
    Generates a quiz using the provided prompt.
    """
    # Run the agent
    result = await quiz_agent.run(prompt, result_type=QuizGenerated)
    return result.data
