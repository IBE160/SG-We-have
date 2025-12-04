import os
from pathlib import Path
from dotenv import load_dotenv
from jose import jwt

def check_secret():
    # Explicitly find .env in the backend directory
    base_dir = Path(__file__).parent
    dotenv_path = base_dir / '.env'
    
    print(f"Loading .env from: {dotenv_path}")
    load_dotenv(dotenv_path=dotenv_path)
    
    secret = os.getenv('SUPABASE_JWT_SECRET', '')
    
    print(f"Secret Length: {len(secret)}")
    
    if len(secret) == 0:
        print("ERROR: Secret is empty.")
        return

    has_start_quote = secret.startswith('"') or secret.startswith("'")
    has_end_quote = secret.endswith('"') or secret.endswith("'")
    
    print(f"Starts with quote: {has_start_quote}")
    print(f"Ends with quote: {has_end_quote}")
    
    if has_start_quote and has_end_quote:
        print("WARNING: The secret seems to include quotes. This is likely the error. Remove them from .env")

    try:
        token = jwt.encode({'test': 'data'}, secret, algorithm='HS256')
        decoded = jwt.decode(token, secret, algorithms=['HS256'])
        print(f"Self-sign/verify test: {'PASSED' if decoded == {'test': 'data'} else 'FAILED'}")
    except Exception as e:
        print(f"Self-sign/verify test FAILED: {e}")

if __name__ == "__main__":
    check_secret()
