import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add backend directory to sys.path so we can import from app
# This file is in backend/, so current_dir is backend/
current_dir = Path(__file__).resolve().parent
sys.path.append(str(current_dir))

# Load env explicitly from backend/.env
dotenv_path = current_dir / '.env'
load_dotenv(dotenv_path=dotenv_path)

# Import the agent function
# We need to handle potential PydanticAI import errors gracefully if env vars aren't picked up by the module init
try:
    from app.agents.quiz_agent import generate_quiz_content
except ImportError as e:
    print(f"Import Error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"Initialization Error: {e}")
    sys.exit(1)

async def main():
    print("--- Testing Gemini API Connection ---")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: GEMINI_API_KEY not found in environment.")
        print("Please ensure 'backend/.env' exists and has GEMINI_API_KEY set.")
        return

    # Mask key for display
    masked_key = f"{api_key[:4]}...{api_key[-4:]}" if len(api_key) > 8 else "INVALID"
    print(f"✅ Found GEMINI_API_KEY: {masked_key}")
    
    print("\nSending test request to Gemini (via Quiz Agent)...")

    test_prompt = """
    Notes: The Earth revolves around the Sun. It takes 365.25 days to complete one orbit. This orbit causes seasons.
    
    Instructions:
    1. Generate 1 question.
    2. Focus on definitions.
    3. Each question must have 4 options.
    4. Provide the correct answer index (0-3) and a brief explanation.
    5. Ensure questions are relevant.
    """
    
    try:
        result = await generate_quiz_content(test_prompt)
        
        print("\n✅ API Call Successful!")
        print(f"Quiz Title: {result.title}")
        if result.questions:
            q = result.questions[0]
            print(f"Question: {q.question_text}")
            print(f"Options: {q.options}")
            print(f"Correct Answer Index: {q.correct_answer_index}")
            print(f"Explanation: {q.explanation}")
        else:
            print("⚠️ No questions generated.")
            
    except Exception as e:
        print(f"\n❌ API Call Failed: {e}")
        # Provide more info if it's a pydantic-ai UserError (likely auth related)
        if "UserError" in str(type(e)):
            print("Hint: This often means the API Key is invalid or the model 'gemini-1.5-flash' is not accessible.")

if __name__ == "__main__":
    asyncio.run(main())
