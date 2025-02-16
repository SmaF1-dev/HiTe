from models.models import User, Role
from security.pwdcrypt import encode_password

USER_DATA = {
    "admin": {"username": "admin", "password": encode_password("admin"), "role": Role.ADMIN},
    "user": {"username": "user", "password": encode_password("password"), "role": Role.USER},
    "guest": {"username": "guest", "password": encode_password("12345"), "role": Role.GUEST}
    }

def get_user(username: str) -> User | None:
    if username in USER_DATA:
        return User(**USER_DATA[username])
    return None