from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from datetime import datetime, timedelta

from security.pwdcrypt import verify_password
from models.models import User, Role, AuthUser
from db.db import get_user
import security.config as config

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def authentificate_user(username: str, password: str) -> User | None:
    db_user = get_user(username)
    if db_user is None or not(verify_password(password, db_user.password)):
        return None
    return db_user

def get_exp() -> datetime:
    return datetime.utcnow() + timedelta(minutes=config.EXPIRATION_TIME)

def create_jwt_token(user: User) -> str:
    data = {
        "sub": user.username,
        "role": user.role.value,
        "exp": get_exp()
    }
    return jwt.encode(data, key=config.SECRET_KEY, algorithm=config.ALGORITHM)

def get_authuser_from_token(token: str = Depends(oauth2_scheme)) -> AuthUser:
    try:
        payload = jwt.decode(token, key=config.SECRET_KEY, algorithms=[config.ALGORITHM])
        return AuthUser(username = payload.get("sub"), role = payload.get("role"))
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"}
        )