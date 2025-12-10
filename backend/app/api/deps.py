from fastapi import Depends, HTTPException, status, Header
from app.core.supabase import get_supabase_client
from supabase import Client

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header"
        )
    
    supabase = get_supabase_client()
    try:
        # Verify token by getting user
        # Authorization header format: "Bearer <token>"
        token = authorization.split(" ")[1]
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
             raise HTTPException(status_code=401, detail="Invalid token")
        return user_response.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authentication"
        )
