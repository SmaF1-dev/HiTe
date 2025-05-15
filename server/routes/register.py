from fastapi import APIRouter, HTTPException, status

from models.models import User
from security.security import register_user

register = APIRouter()

@register.post("/register")
async def registration(user: User) -> dict:
    status_register: str = register_user(user)
    if status_register == 'Error':
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким email уже существует"
        )
    return {"status": status_register}