from fastapi import APIRouter, Depends

from database.database import get_test_for_pass_by_id, passing_test
from models.models import AuthUser, TestPassed, TestWithoutResult
from security.security import get_authuser_from_token

passing = APIRouter()

@passing.get("/test/{id}")
def get_test_info(id:int, token_data: AuthUser = Depends(get_authuser_from_token)):
    return get_test_for_pass_by_id(id)

@passing.post("/test/{id}")
def complete_test(id: int, passed_test: TestPassed, token_data: AuthUser = Depends(get_authuser_from_token)):
    test = TestWithoutResult(test_id=id, email_user=token_data.email, **dict(passed_test))
    return passing_test(test)
