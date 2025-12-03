from supabase import create_client, Client
import os
from . import config

_supabase_client: Client = None # Make it a private module-level variable, initialized lazily

def get_supabase_client() -> Client:
    global _supabase_client
    if _supabase_client is None:
        SUPABASE_URL = os.environ.get("SUPABASE_URL")
        SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise ValueError("Supabase URL and Service Role Key must be set in environment variables.")
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    return _supabase_client

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
