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
    incorrect_answers: List[str]

class DefaultQuestionForPass(BaseModel):
    question: str
    answers: List

class TestInfo(BaseModel):
    title: str
    type: str #10cards, Timeline, Default

class Test(TestInfo):
    event_name: Optional[str] = None # 10 cards
    event_description: Optional[str] = None # 10 cards
    correct_answers_lst: Optional[List[str]] = [] # 10 cards
    incorrect_answers_lst: Optional[List[str]] = [] # 10 cards
    events_list: Optional[List[TimelineEvent]] = [] # Timeline
    question_lst: Optional[List[DefaultQuestion]] = [] # Default

class TestForCreate(Test):
    email: EmailStr

class TestCreate(TestForCreate):
    id: int

class TestForPass(TestInfo):
    event_name: Optional[str] = None # 10 cards
    answers_lst: Optional[List[str]] = [] # 10 cards
    start_event: Optional[TimelineEvent] = None # Timeline
    middle_event: Optional[TimelineEvent] = None # Timeline
    end_event: Optional[TimelineEvent] = None # Timeline
    events_list: Optional[List[TimelineEvent]] = [] # Timeline
    question_lst: Optional[List[DefaultQuestionForPass]] = [] # Default

class TestPassed(Test):
    cnt_wrongs: Optional[int] = None

class TestWithoutResult(TestPassed):
    test_id: int
    email_user: EmailStr

class TestWithResult(TestWithoutResult):
    result: int