from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from pydantic import EmailStr
from datetime import datetime, timedelta, date

from security.pwdcrypt import verify_password
from models.models import User, AuthUser
from database.database import get_user, create_user
import security.config as config

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def register_user(user: User) -> str:
    status = create_user(user)
    return status

def authentificate_user(email: EmailStr, password: str) -> User | None:
    db_user = get_user(email)
    if db_user is None or not(verify_password(password, db_user.password)):
        return None
    return db_user

def get_exp() -> datetime:
    return datetime.utcnow() + timedelta(minutes=config.EXPIRATION_TIME)

def create_jwt_token(user: User) -> str:
    data = {
        "sub": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "middle_name": user.middle_name,
        "education": user.education,
        "birth_date": user.birth_date.isoformat(),
        "exp": get_exp()
    }
    return jwt.encode(data, key=config.SECRET_KEY, algorithm=config.ALGORITHM)

def get_authuser_from_token(token: str = Depends(oauth2_scheme)) -> AuthUser:
    try:
        payload = jwt.decode(token, key=config.SECRET_KEY, algorithms=[config.ALGORITHM])
        return AuthUser(email = payload.get("sub"), first_name=payload.get("first_name"), 
                        last_name=payload.get("last_name"), middle_name=payload.get("middle_name"),
                        birth_date=payload.get("birth_date"), education=payload.get("education"))
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