import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from jose import jwt, JWTError

def debug_jwt():
    print("--- JWT Debugger ---")
    
    # 1. Load .env
    env_path = Path('.env')
    if not env_path.exists():
        print("ERROR: .env file not found in backend directory!")
        return

    load_dotenv(dotenv_path=env_path)
    secret = os.getenv("SUPABASE_JWT_SECRET")
    
    if not secret:
        print("ERROR: SUPABASE_JWT_SECRET is missing from .env")
        return
    
    print(f"1. Secret Loaded: Yes")
    print(f"   Length: {len(secret)}")
    print(f"   Prefix: {secret[:4]}...")
    
    # Check for common quote issues
    if secret.startswith('"') or secret.startswith("'"):
        print("   WARNING: Secret appears to be quoted. This might be the issue.")
    
    # 2. Get Token
    print("\n2. Paste your JWT token below and press Enter:")
    try:
        token = input().strip()
    except EOFError:
        print("Error reading input.")
        return

    if not token:
        print("Error: Empty token provided.")
        return

    # Remove 'Bearer ' if present
    if token.lower().startswith("bearer "):
        token = token[7:]

    # 3. Analyze Header
    try:
        header = jwt.get_unverified_header(token)
        print(f"\n3. Token Header: {header}")
        alg = header.get('alg')
        if alg != 'HS256':
            print(f"   CRITICAL: Token algorithm is '{alg}'. Backend expects 'HS256'.")
            print("   If this is 'RS256', your Supabase project settings might differ from the default.")
    except JWTError as e:
        print(f"   Error decoding header: {e}")
        return

    # 4. Analyze Payload (Unverified)
    try:
        payload = jwt.get_unverified_claims(token)
        print(f"\n4. Token Payload (Unverified):")
        print(f"   Audience (aud): {payload.get('aud')}")
        print(f"   Issuer (iss): {payload.get('iss')}")
        print(f"   Expiration (exp): {payload.get('exp')}")
    except JWTError as e:
        print(f"   Error decoding claims: {e}")

    # 5. Attempt Verification
    print(f"\n5. Verification Attempt (HS256):")
    try:
        # Try with the loaded secret
        jwt.decode(token, secret, algorithms=["HS256"], audience="authenticated")
        print("   SUCCESS! The token is valid and the secret is correct.")
    except JWTError as e:
        print(f"   FAILED: {e}")
        print("\n   Troubleshooting tips:")
        if "Signature verification failed" in str(e):
            print("   - The secret in .env does not match the secret used to sign the token.")
            print("   - Ensure you copied the 'JWT Secret' from Supabase (Settings -> API -> JWT Settings).")
            print("   - Ensure there are no accidental spaces or quotes in .env.")
        elif "Audience" in str(e):
            print("   - The token audience does not match 'authenticated'.")

if __name__ == "__main__":
    debug_jwt()
