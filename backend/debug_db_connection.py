import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

def debug_supabase():
    print("--- Debugging Supabase Connection ---")
    
    # 1. Locate .env
    # Logic from app/core/config.py
    current_file = Path(__file__).resolve()
    # If this script is in backend/, then parent is backend
    backend_dir = current_file.parent
    project_root = backend_dir.parent 
    
    # Try multiple likely locations
    possible_paths = [
        backend_dir / '.env',
        project_root / 'backend' / '.env',
        Path('C:/Users/ankri/Desktop/BACH IT/5_sem-IT H25/IBE160 Programmering med KI/Studenthjelp/SG-We-have/backend/.env') # Absolute hardcoded based on prompt
    ]
    
    env_path = None
    for p in possible_paths:
        if p.exists():
            env_path = p
            break
            
    if env_path:
        print(f"✅ Found .env at: {env_path}")
        load_dotenv(dotenv_path=env_path)
    else:
        print("❌ Could not find .env file in likely locations.")
        print(f"   Checked: {[str(p) for p in possible_paths]}")
        # Don't exit, maybe they are set in system env
        
    # 2. Check Variables
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    
    print(f"SUPABASE_URL: {'[SET]' if url else '[MISSING]'}")
    if url:
        print(f"   Value (first 20 chars): {url[:20]}...")
        
    print(f"SUPABASE_SERVICE_ROLE_KEY: {'[SET]' if key else '[MISSING]'}")
    if key:
        print(f"   Value (first 5 chars): {key[:5]}... (last 5): ...{key[-5:]}")
        if '"' in key or "'" in key:
             print("   ⚠️ WARNING: Key contains quotes. This might be the issue!")

    if not url or not key:
        print("❌ Missing required environment variables. Connection impossible.")
        return

    # 3. Test Connection
    try:
        print("Testing connection to Supabase...")
        supabase = create_client(url, key)
        
        # Try a simple query - 'courses' table might be empty but query should work
        # or try accessing auth users if service key is used
        response = supabase.table("courses").select("*", "*").limit(1).execute()
        
        print("✅ Connection Successful!")
        print(f"   Data received: {response.data}")
        
    except Exception as e:
        print("❌ Connection Failed!")
        print(f"   Error: {type(e).__name__}: {e}")
        print("\nFull Traceback:")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_supabase()
