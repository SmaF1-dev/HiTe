from fastapi import APIRouter, Depends

from models.models import TestCreate, AuthUser, Test
from security.security import get_authuser_from_token
from database.database import get_test_for_edit_by_id, edit_test

edit = APIRouter()

@edit.get('/edit_test/{id_test}')
def get_test_info(id_test: int, token_data: AuthUser = Depends(get_authuser_from_token)):
    return get_test_for_edit_by_id(id_test, token_data.email)

@edit.post('/edit_test/{id_test}')
def submit_edited_test(id_test: int, test: Test, token_data: AuthUser = Depends(get_authuser_from_token)):
    edited_test = TestCreate(id = id_test, author_name=(token_data.last_name + ' ' + token_data.first_name + ' ' + token_data.middle_name), 
                             email=token_data.email, **dict(test))
    return edit_test(edited_test)