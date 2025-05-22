from sqlalchemy import Column, Integer, String, Date, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import ARRAY

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    email = Column(String, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    middle_name = Column(String, default="")
    birth_date = Column(Date, nullable=False)
    education = Column(String, nullable=False)
    password = Column(String, nullable=False)

class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, ForeignKey("users.email"), nullable=False)
    author_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)  # '10cards', 'Timeline', 'Default'
    
    # Для типа 10cards
    event_name = Column(String, nullable=True)
    event_description = Column(String, nullable=True)
    correct_answers_lst = Column(ARRAY(String), default=[])
    incorrect_answers_lst = Column(ARRAY(String), default=[])
    
    # Для типа Timeline
    events_list = Column(JSON, default=[])
    
    # Для типа Default
    question_lst = Column(JSON, default=[])

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    email_user = Column(String, ForeignKey("users.email"), nullable=False)
    author_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)
    
    # Данные теста на момент прохождения
    event_name = Column(String, nullable=True)
    event_description = Column(String, nullable=True)
    correct_answers_lst = Column(ARRAY(String), nullable=True)
    incorrect_answers_lst = Column(ARRAY(String), nullable=True)
    events_list = Column(JSON, nullable=True)
    question_lst = Column(JSON, nullable=True)
    
    cnt_wrongs = Column(Integer, nullable=True)
    result = Column(Integer, nullable=False)