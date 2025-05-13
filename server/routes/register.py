from fastapi import APIRouter, HTTPException, status

from models.models import User
from security.security import register_user

register = APIRouter()

@register.post("/register")
async def registration(user: User) -> dict:
    status_register: str = register_user(user)
    return {"status": status_register}