from fastapi import APIRouter, Depends

from models.models import Test, AuthUser, TestForCreate
from security.security import get_authuser_from_token
from database.database import create_test

create = APIRouter()

@create.post("/create_test")
def add_test(test: Test, token_data: AuthUser = Depends(get_authuser_from_token)):
    email = token_data.email
    new_test = {
        "email": email,
        **dict(test)
    }
    status = create_test(TestForCreate(**new_test))
    return status