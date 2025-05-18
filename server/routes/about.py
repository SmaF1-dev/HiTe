from fastapi import APIRouter, Depends
from typing import List

from models.models import AuthUser, TestCreate, TestWithResult
from security.security import get_authuser_from_token
from database.database import get_tests_by_email, get_passed_tests_by_email

about = APIRouter()

@about.get("/aboutme")
def get_info(token_data: AuthUser = Depends(get_authuser_from_token)) -> dict:
    return {"name": token_data.first_name + ' ' + token_data.last_name + ' ' + token_data.middle_name,
            "education": token_data.education,
            "birth_date": token_data.birth_date}

@about.get("/my_tests")
def get_my_tests(token_data: AuthUser = Depends(get_authuser_from_token)) -> List[TestCreate]:
    tests_lst = get_tests_by_email(token_data.email)
    return tests_lst

@about.get("/passed_tests")
def get_passed_tests(token_data: AuthUser = Depends(get_authuser_from_token)) -> List[TestWithResult]:
    tests_lst = get_passed_tests_by_email(token_data.email)
    return tests_lst