from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional
from enum import Enum

class AuthRequest(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    middle_name: str = ''
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
    incorrect_answers: list[str]

class DefaultQuestionForPass(BaseModel):
    question: str
    answers: list

class TestInfo(BaseModel):
    title: str
    type: str #10cards, Timeline, Default

class Test(TestInfo):
    event_name: Optional[str] = None # 10 cards
    event_description: Optional[str] = None # 10 cards
    correct_answers_lst: Optional[list[str]] = [] # 10 cards
    incorrect_answers_lst: Optional[list[str]] = [] # 10 cards
    events_list: Optional[list[TimelineEvent]] = [] # Timeline
    question_lst: Optional[list[DefaultQuestion]] = [] # Default

class TestForCreate(Test):
    email: EmailStr

class TestCreate(TestForCreate):
    id: int
    author_name: str

class TestForPass(TestInfo):
    event_name: Optional[str] = None # 10 cards
    answers_lst: Optional[list[str]] = [] # 10 cards
    start_event: Optional[TimelineEvent] = None # Timeline
    middle_event: Optional[TimelineEvent] = None # Timeline
    end_event: Optional[TimelineEvent] = None # Timeline
    events_list: Optional[list[TimelineEvent]] = [] # Timeline
    correct_events_list: Optional[list[TimelineEvent]] = [] # Timeline
    question_lst: Optional[list[DefaultQuestionForPass]] = [] # Default
    author_name: str

class TestPassed(Test):
    cnt_wrongs: Optional[int] = None
    author_name: str

class TestWithoutResult(TestPassed):
    test_id: int
    email_user: EmailStr

class TestWithResult(TestWithoutResult):
    result: int
    author_name: str