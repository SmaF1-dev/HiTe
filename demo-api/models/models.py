from pydantic import BaseModel
from enum import Enum

class Role(Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

class AuthRequest(BaseModel):
    username: str
    password: str

class User(BaseModel):
    username: str
    password: str
    role: Role

class AuthUser(BaseModel):
    username: str
    role: Role