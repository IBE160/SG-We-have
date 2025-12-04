import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.database import get_supabase_client

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    secret = os.getenv("SUPABASE_JWT_SECRET")
    
    exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Strategy 1: Local JWT Verification (Fast)
    # Only attempts if secret is configured.
    if secret:
        try:
            # Supabase uses HS256
            # Audience 'authenticated' is standard for logged in users
            payload = jwt.decode(token, secret, algorithms=["HS256"], audience="authenticated")
            return payload
        except JWTError:
            # If local verification fails (e.g. wrong secret), proceed to fallback
            pass

    # Strategy 2: Remote Supabase Verification (Robust fallback)
    # Uses the Supabase Auth API to validate the token. Slower but works without shared secret.
    try:
        client = get_supabase_client()
        # verify_aud=False might be needed if we just want to check validity, 
        # but get_user sends the token to Supabase which validates it fully.
        user_response = client.auth.get_user(token)
        user = user_response.user
        
        if not user:
            raise exception
            
        # Construct a payload-like dictionary from the User object
        # This ensures compatibility with endpoints expecting the JWT payload
        payload = {
            "sub": user.id,
            "email": user.email,
            "aud": user.aud or "authenticated",
            "user_metadata": user.user_metadata,
            "app_metadata": user.app_metadata,
            "role": user.role,
        }
        return payload
    except Exception as e:
        # Log the error for debugging purposes (optional, but helpful)
        # print(f"Remote auth validation failed: {e}")
        raise exception
