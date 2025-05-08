from fastapi import APIRouter, Depends, HTTPException, status

from models.models import AuthUser
from security.security import get_authuser_from_token

resource = APIRouter()

# Защищенный роут для авторизованных пользователей, когда токен уже получен
@resource.get("/info/")
def get_info(auth_user: AuthUser = Depends(get_authuser_from_token)) -> dict:
    return {"name": auth_user.first_name + ' ' + auth_user.last_name + ' ' + auth_user.middle_name,
            "education": auth_user.education,
            "birth_date": auth_user.birth_date}