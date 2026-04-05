"""RBAC Middleware — Role-Based Access Control using JWT."""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import os

security = HTTPBearer(auto_error=False)

JWT_SECRET = os.getenv("JWT_SECRET", "jeewan-super-secret-key-change-in-production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

ROLE_HIERARCHY = {
    "admin": 5,
    "counsellor": 4,
    "volunteer": 3,
    "institution": 3,
    "user": 2,
    "guest": 1,
}


def decode_jwt(token: str) -> dict:
    """Decode and verify a JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


def require_role(*roles: str):
    """Dependency factory — ensures the caller has one of the required roles."""
    async def checker(credentials: HTTPAuthorizationCredentials = Depends(security)):
        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
            )
        payload = decode_jwt(credentials.credentials)
        user_role = payload.get("role", "guest")
        if user_role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user_role}' not authorized. Required: {roles}",
            )
        return payload
    return checker


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract current user from JWT — returns None for unauthenticated guests."""
    if not credentials:
        return {"id": "anonymous", "role": "guest", "email": None}
    return decode_jwt(credentials.credentials)
