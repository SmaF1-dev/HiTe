from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    middle_name = Column(String, nullable=True)
    birth_date = Column(Date)
    education = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    tests = relationship("Test", back_populates="author")
    results = relationship("TestResult", back_populates="user")

class Test(Base):
    __tablename__ = "tests"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    test_type = Column(String)  # 'timeline', '10_cards', 'default'
    author_id = Column(Integer, ForeignKey("users.id"))
    
    author = relationship("User", back_populates="tests")
    events = relationship("TestEvent", back_populates="test")
    results = relationship("TestResult", back_populates="test")

class TestEvent(Base):
    __tablename__ = "test_events"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    date = Column(String, nullable=True)  # Для timeline тестов
    test_id = Column(Integer, ForeignKey("tests.id"))
    
    test = relationship("Test", back_populates="events")

class TestResult(Base):
    __tablename__ = "test_results"
    
    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float)
    user_id = Column(Integer, ForeignKey("users.id"))
    test_id = Column(Integer, ForeignKey("tests.id"))
    
    user = relationship("User", back_populates="results")
    test = relationship("Test", back_populates="results")