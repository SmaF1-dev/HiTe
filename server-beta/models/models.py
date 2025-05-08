from pydantic import BaseModel, EmailStr
from datetime import date
from enum import Enum

class AuthRequest(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    middle_name: str
    birth_date: date
    education: str
    password: str

class AuthUser(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    middle_name: str
    birth_date: date
    education: str