import os
import httpx
from pydantic_ai import Agent, RunContext
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
        "Do not use 'All of the above' or 'None of the above' as options.\n\n"
        "FACT CHECKING REQUIRED: You must verify the factual accuracy of all generated questions and answers. "
        "Use the `search_web` tool to verify facts, especially for dates, specific definitions, or scientific constants. "
        "If the notes contain factually incorrect information, frame the question as 'According to the notes...' "
        "or prioritize the correct fact if it's a general knowledge concept. Ensure the final quiz is high-quality and error-free."
    )
)

@quiz_agent.tool
async def search_web(ctx: RunContext[None], query: str) -> str:
    """
    Search the web for information to verify facts.
    Args:
        ctx: The run context.
        query: The search query.
    Returns:
        A summary of the search results.
    """
    # Try specific search key first, then fall back to main API key
    api_key = os.getenv("GOOGLE_SEARCH_API_KEY") or os.getenv("GOOGLE_API_KEY")
    cse_id = os.getenv("GOOGLE_CSE_ID")
    
    if not api_key or not cse_id:
        # Fallback: If no search config, return a message so the agent knows it can't search
        # but doesn't crash.
        return "System Error: Google Search API Key or CSE ID not configured. Proceed with internal knowledge only."
        
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": api_key,
        "cx": cse_id,
        "q": query,
        "num": 3
    }
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            
            results = []
            if "items" in data:
                for item in data["items"]:
                    title = item.get('title', 'No Title')
                    snippet = item.get('snippet', 'No Snippet')
                    results.append(f"Title: {title}\nSnippet: {snippet}\n")
            
            return "\n".join(results) if results else "No results found."
            
        except Exception as e:
            return f"Error performing search: {str(e)}"

async def generate_quiz_content(prompt: str) -> QuizGenerated:
    """
    Generates a quiz using the provided prompt.
    """
    # Run the agent
    result = await quiz_agent.run(prompt, result_type=QuizGenerated)
    return result.data