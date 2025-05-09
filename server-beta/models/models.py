from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional
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

class TimelineEvent(BaseModel):
    name: str
    description: str

class DefaultQuestion(BaseModel):
    question: str
    correct_answer: str
    incorrect_answers: List

class Test(BaseModel):
    title: str
    type: str #10cards, Timeline, Default
    event_name: Optional[str] = None
    event_description: Optional[str] = None
    correct_answers_lst: Optional[List] = []
    incorrect_answers_lst: Optional[List] = []
    events_list: Optional[List[TimelineEvent]] = []
    question_lst: Optional[List[DefaultQuestion]] = []

class TestForCreate(Test):
    email: EmailStr

class TestCreate(TestForCreate):
    id: int