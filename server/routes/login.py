from fastapi import APIRouter, HTTPException, status

from models.models import AuthRequest, User
from security.security import authentificate_user, create_jwt_token

auth = APIRouter()

@auth.post("/login")
async def login(user: AuthRequest) -> dict:
    authenticated_user: User = authentificate_user(user.email, user.password)
    if authenticated_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return {"access_token": create_jwt_token(authenticated_user),
            "token_type": "bearer",
            "user": authenticated_user}