from fastapi import APIRouter, Depends, HTTPException, status

from models.models import AuthUser, Role
from security.security import get_authuser_from_token

resource = APIRouter()

# Защищенный роут для админов, когда токен уже получен
@resource.get("/admin/")
def get_admin_info(auth_user: AuthUser = Depends(get_authuser_from_token)) -> dict:
    if auth_user.role != Role.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return {"message": f"Hi, admin {auth_user.username}!"}

# Защищенный роут для обычных пользователей, когда токен уже получен
@resource.get("/user/")
def get_user_info(auth_user: AuthUser = Depends(get_authuser_from_token)) -> dict:
    if auth_user.role != Role.USER:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return {"message": f"Hi, user {auth_user.username}!"}

# Защищенный роут для фвторизованных пользователей (кроме гостей), когда токен уже получен
@resource.get("/protected_resourse/")
def get_admin_info(auth_user: AuthUser = Depends(get_authuser_from_token)) -> dict:
    if auth_user.role not in [Role.ADMIN, Role.USER]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return {"message": f"Hi, admin {auth_user.username}!", "data": "sensitive_data"}

# Защищенный роут для авторизованных пользователей, когда токен уже получен
@resource.get("/info/")
def get_info(auth_user: AuthUser = Depends(get_authuser_from_token)) -> dict:
    return {"message": f"Hi, {auth_user.username}!"}