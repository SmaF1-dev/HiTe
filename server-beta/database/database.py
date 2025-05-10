from pydantic import EmailStr
from typing import Optional

from models.models import User, Test, TestForCreate, TestCreate
from security.pwdcrypt import encode_password

USER_DATA = {
    "example@mail.ru": {
        "email": "example@mail.ru",
        "first_name": "John",
        "last_name": "Doe",
        "middle_name": "Ivanovich",
        "birth_date": "2001-12-31",
        "education": "ITMO",
        "password": encode_password("password")
        },
    }

TESTS_DATA = {
    1: {
        "id": 1,
        "email": "example@mail.ru",
        "title": "Первый тест",
        "type": "Timeline",
        "event_name": None,
        "event_description": None,
        "correct_answers_lst": [],
        "incorrect_answers_lst": [],
        "events_list": [
            {
                "name": "Name1",
                "description": "Description1"
            },
            {
                "name": "Name2",
                "description": "Description2"
            },
            {
                "name": "Name3",
                "description": "Description3"
            },
            {
                "name": "Name4",
                "description": "Description4"
            },
            {
                "name": "Name5",
                "description": "Description5"
            },
        ],
        "question_lst": []
    }
}



def get_user(email: EmailStr) -> User | None:
    if email in USER_DATA:
        return User(**USER_DATA[email])
    return None

def create_user(user: User) -> str:
    email = user.email
    if email not in USER_DATA:
        new_user = dict(user)
        password = new_user["password"]
        new_user["password"] = encode_password(password)
        USER_DATA[email] = new_user
        return "Success"
    else:
        return "User created already"

def create_test(test: TestForCreate) -> str:
    index_lst = list(TESTS_DATA.keys())
    index = index_lst[-1] + 1
    new_test = dict(test)
    new_test["id"] = index
    TESTS_DATA[index] = new_test
    return [TESTS_DATA, USER_DATA]

def get_test_by_id(id: int, email: EmailStr):
    if id in list(TESTS_DATA.keys()):
        test = TestCreate(**TESTS_DATA[id])
        if test.email != email:
            return "Incorrect user"
        else:
            return test
    else:
        return "Test is not exist"
    

def edit_test(test: TestCreate):
    index = test.id
    edited_test = dict(test)
    TESTS_DATA[index] = edited_test
    return TESTS_DATA