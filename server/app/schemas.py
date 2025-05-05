from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import List, Optional

# ----- User Schemas -----
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

class UserCreate(UserBase):
    middle_name: Optional[str] = None
    birth_date: date
    education: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True

# ----- Auth Schemas -----
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# ----- Test Schemas -----
class TestEventBase(BaseModel):
    name: str
    description: str
    date: Optional[str] = None

class TestEventCreate(TestEventBase):
    pass

class TestEvent(TestEventBase):
    id: int
    test_id: int
    
    class Config:
        from_attributes = True

class TestBase(BaseModel):
    title: str
    test_type: str

class TestCreate(TestBase):
    description: Optional[str] = None
    events: Optional[List[TestEventCreate]] = None

class Test(TestBase):
    id: int
    author_id: int
    events: List[TestEvent] = []
    
    class Config:
        from_attributes = True

# ----- Results Schemas -----
class TestResultBase(BaseModel):
    score: float

class TestResultCreate(TestResultBase):
    user_id: int
    test_id: int

class TestResult(TestResultBase):
    id: int
    user: User
    test: Test
    
    class Config:
        from_attributes = True