from supabase import create_client, Client
import os
from . import config

def get_supabase_client() -> Client:
    # Re-instantiating the client for each request to avoid potential socket/threading issues on Windows (WinError 10035)
    # In a production environment with high concurrency, a connection pool or singleton with thread-local storage might be better.
    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise ValueError("Supabase URL and Service Role Key must be set in environment variables.")
    
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def verify_supabase_connection():
    try:
        # Get the client via the function, allowing it to be mocked
        client = get_supabase_client()
        # Query a table that is known to exist to verify connection
        client.table("courses").select("*").limit(1).execute()
        print("Supabase client initialized successfully.")
        return True
    except Exception as e:
        print(f"Failed to connect to Supabase: {e}")
        return False

if __name__ == "__main__":
    if verify_supabase_connection():
        print("Backend Supabase connection verified.")
    else:
        print("Backend Supabase connection failed.")