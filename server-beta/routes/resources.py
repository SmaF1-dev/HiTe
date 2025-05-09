from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer

from models.models import AuthUser
from security.security import get_authuser_from_token

# Модель для данных POST-запроса
class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None

# Схема для OAuth2 с токеном в заголовке
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

resource = APIRouter()

# Защищенный роут для авторизованных пользователей, когда токен уже получен
@resource.get("/info/")
def get_info(auth_user: AuthUser = Depends(get_authuser_from_token)) -> dict:
    return {"name": auth_user.first_name + ' ' + auth_user.last_name + ' ' + auth_user.middle_name,
            "education": auth_user.education,
            "birth_date": auth_user.birth_date}

@resource.post("/items")
def create_item(item: Item, token_data: AuthUser = Depends(get_authuser_from_token)):
    email = token_data.email
    return {"item": item, "user": email}