from pydantic import EmailStr

from models.models import User
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
    return "Error create user"