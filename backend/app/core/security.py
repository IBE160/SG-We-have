import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    secret = os.getenv("SUPABASE_JWT_SECRET")
    
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT Secret not configured"
        )

    exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Supabase uses HS256
        # Audience 'authenticated' is standard for logged in users
        payload = jwt.decode(token, secret, algorithms=["HS256"], audience="authenticated")
        return payload
    except JWTError as e:
        # Optional: log the error e for debugging
        raise exception
