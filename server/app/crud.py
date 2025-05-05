from sqlalchemy.orm import Session
from .models import User, Test, TestEvent, TestResult
from .schemas import UserCreate, TestCreate, TestResultCreate
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ----- User CRUD -----
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        middle_name=user.middle_name,
        birth_date=user.birth_date,
        education=user.education,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ----- Test CRUD -----
def get_test(db: Session, test_id: int):
    return db.query(Test).filter(Test.id == test_id).first()

def get_tests(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Test).offset(skip).limit(limit).all()

def create_test(db: Session, test: TestCreate, user_id: int):
    db_test = Test(
        title=test.title,
        description=test.description,
        test_type=test.test_type,
        author_id=user_id
    )
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    
    if test.events:
        for event in test.events:
            db_event = TestEvent(
                name=event.name,
                description=event.description,
                date=event.date,
                test_id=db_test.id
            )
            db.add(db_event)
        db.commit()
    
    return db_test

# ----- Results CRUD -----
def create_test_result(db: Session, result: TestResultCreate):
    db_result = TestResult(**result.dict())
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result