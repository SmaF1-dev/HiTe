from typing import Optional, List
from sqlalchemy import create_engine, select, update, delete
from sqlalchemy.orm import sessionmaker
from pydantic import EmailStr
from models.models import (
    User, TestWithoutResult, TestWithResult, TestForCreate, 
    TestCreate, TestForPass, DefaultQuestionForPass, TimelineEvent
)
from security.pwdcrypt import encode_password
from config import settings
from database.models_sql import User as UserDB, Test as TestDB, TestResult as TestResultDB

# Настройка подключения к PostgreSQL
DATABASE_URL = f"postgresql+psycopg2://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Функции для работы с пользователями
def get_user(email: EmailStr) -> Optional[User]:
    db = SessionLocal()
    try:
        user = db.query(UserDB).filter(UserDB.email == email).first()
        if user:
            return User(
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                middle_name=user.middle_name,
                birth_date=user.birth_date,
                education=user.education,
                password=user.password
            )
        return None
    finally:
        db.close()

def create_user(user: User) -> str:
    db = SessionLocal()
    try:
        existing_user = db.query(UserDB).filter(UserDB.email == user.email).first()
        if existing_user:
            return "Error"
        
        db_user = UserDB(
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            middle_name=user.middle_name,
            birth_date=user.birth_date,
            education=user.education,
            password=encode_password(user.password)
        )
        db.add(db_user)
        db.commit()
        return "Success"
    except Exception as e:
        db.rollback()
        return f"Error: {str(e)}"
    finally:
        db.close()

# Функции для работы с тестами
def create_test(test: TestForCreate) -> dict:
    db = SessionLocal()
    try:
        user = db.query(UserDB).filter(UserDB.email == test.email).first()
        if not user:
            return {"error": "User not found"}
        
        author_name = f"{user.last_name} {user.first_name} {user.middle_name}"
        
        db_test = TestDB(
            email=test.email,
            author_name=author_name,
            title=test.title,
            type=test.type,
            event_name=test.event_name,
            event_description=test.event_description,
            correct_answers_lst=test.correct_answers_lst,
            incorrect_answers_lst=test.incorrect_answers_lst,
            events_list=[event.dict() for event in test.events_list] if test.events_list else [],
            question_lst=[question.dict() for question in test.question_lst] if test.question_lst else []
        )
        
        db.add(db_test)
        db.commit()
        db.refresh(db_test)
        
        return {"tests": db_test, "user": user}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()

def get_passed_tests_by_email(email: EmailStr) -> List[TestWithResult]:
    db = SessionLocal()
    try:
        results = db.query(TestResultDB).filter(TestResultDB.email_user == email).all()
        return [
            TestWithResult(
                test_id=result.test_id,
                email_user=result.email_user,
                author_name=result.author_name,
                title=result.title,
                type=result.type,
                event_name=result.event_name,
                event_description=result.event_description,
                correct_answers_lst=result.correct_answers_lst or [],
                incorrect_answers_lst=result.incorrect_answers_lst or [],
                events_list=[TimelineEvent(**event) for event in (result.events_list or [])],
                question_lst=result.question_lst or [],
                cnt_wrongs=result.cnt_wrongs or 0,
                result=result.result
            )
            for result in results
        ]
    finally:
        db.close()

def get_test_for_edit_by_id(id: int, email: EmailStr):
    db = SessionLocal()
    try:
        test = db.query(TestDB).filter(TestDB.id == id).first()
        if not test:
            return "Test is not exist"
        if test.email != email:
            return "Incorrect user"
        
        return TestCreate(
            id=test.id,
            email=test.email,
            author_name=test.author_name,
            title=test.title,
            type=test.type,
            event_name=test.event_name,
            event_description=test.event_description,
            correct_answers_lst=test.correct_answers_lst,
            incorrect_answers_lst=test.incorrect_answers_lst,
            events_list=[TimelineEvent(**event) for event in test.events_list],
            question_lst=test.question_lst
        )
    finally:
        db.close()

def get_test_for_pass_by_id(id: int):
    from random import shuffle
    
    db = SessionLocal()
    try:
        test = db.query(TestDB).filter(TestDB.id == id).first()
        if not test:
            return "Test is not exist"
        
        test_data = TestCreate(
            id=test.id,
            email=test.email,
            author_name=test.author_name,
            title=test.title,
            type=test.type,
            event_name=test.event_name,
            event_description=test.event_description,
            correct_answers_lst=test.correct_answers_lst,
            incorrect_answers_lst=test.incorrect_answers_lst,
            events_list=[TimelineEvent(**event) for event in test.events_list],
            question_lst=test.question_lst
        )
        
        if test_data.type == "Timeline":
            cnt_events = len(test_data.events_list)
            if cnt_events < 3:
                return "Not enough events for Timeline test"

            start_event = test_data.events_list[0]
            middle_event = test_data.events_list[cnt_events//2]
            end_event = test_data.events_list[-1]

            lst_events = test_data.events_list.copy()
            lst_events.pop(cnt_events//2)
            lst_events.pop(0)
            lst_events.pop()

            shuffle(lst_events)

            return TestForPass(
                title=test_data.title,
                type=test_data.type,
                start_event=start_event,
                middle_event=middle_event,
                end_event=end_event,
                events_list=lst_events,
                author_name=test_data.author_name,
                correct_events_list=test_data.events_list
            )
        
        elif test_data.type == "10cards":
            lst_answers = test_data.correct_answers_lst.copy()
            lst_answers.extend(test_data.incorrect_answers_lst)
            shuffle(lst_answers)
            
            return TestForPass(
                title=test_data.title,
                type=test_data.type,
                event_name=test_data.event_name,
                answers_lst=lst_answers,
                author_name=test_data.author_name
            )
        
        else:  # Default type
            question_lst = []
            for question_block in test_data.question_lst:
                answers = question_block.incorrect_answers.copy()
                answers.append(question_block.correct_answer)
                shuffle(answers)
                
                question_lst.append(DefaultQuestionForPass(
                    question=question_block.question,
                    answers=answers
                ))
            
            shuffle(question_lst)
            return TestForPass(
                title=test_data.title,
                type=test_data.type,
                question_lst=question_lst,
                author_name=test_data.author_name
            )
    finally:
        db.close()

def passing_test(passed_test: TestWithoutResult):
    db = SessionLocal()
    try:
        original_test = db.query(TestDB).filter(TestDB.id == passed_test.test_id).first()
        if not original_test:
            return {"error": "Test not found"}
        if passed_test.type == "10cards":
            cnt_wrongs = 0
            original_correct = set(original_test.correct_answers_lst)
            original_incorrect = set(original_test.incorrect_answers_lst)
            
            for elem in passed_test.correct_answers_lst:
                if elem not in original_correct:
                    cnt_wrongs += 1
            
            for elem in passed_test.incorrect_answers_lst:
                if elem not in original_incorrect:
                    cnt_wrongs += 1
            
            total_answers = len(passed_test.incorrect_answers_lst) + len(passed_test.correct_answers_lst)
            result = int(round(1 - cnt_wrongs / total_answers, 2) * 100) if total_answers else 0
        
        elif passed_test.type == "Timeline":
            cnt_wrongs = passed_test.cnt_wrongs
            total_events = len(passed_test.events_list) - 3
            result = int(round(1 - cnt_wrongs / total_events, 2) * 100) if total_events else 0
        
        else:  # Default type
            cnt_wrongs = 0
            original_questions = {q["question"]: q["correct_answer"] for q in original_test.question_lst}
            
            for elem in passed_test.question_lst:
                question = elem.question
                corr_answ = elem.correct_answer
                if corr_answ != original_questions[question]:
                    cnt_wrongs += 1
            result = int(round(1 - cnt_wrongs / len(passed_test.question_lst), 2) * 100) if passed_test.question_lst else 0
        
         # Преобразуем вопросы в словари перед сохранением
        question_lst = []
        if passed_test.question_lst:
            for question in passed_test.question_lst:
                if isinstance(question, DefaultQuestionForPass):
                    question_lst.append({
                        "question": question.question,
                        "correct_answer": question.correct_answer,
                        "answers": question.answers
                    })
                else:
                    question_lst.append(question.dict() if hasattr(question, 'dict') else question)
        # Сохраняем результат
         # Создаем результат теста
        db_result = TestResultDB(
            test_id=passed_test.test_id,
            email_user=passed_test.email_user,
            author_name=passed_test.author_name,
            title=passed_test.title,
            type=passed_test.type,
            event_name=passed_test.event_name,
            event_description=original_test.event_description,
            correct_answers_lst=passed_test.correct_answers_lst,
            incorrect_answers_lst=passed_test.incorrect_answers_lst,
            events_list=[event.dict() for event in passed_test.events_list] if passed_test.events_list else None,
            question_lst=question_lst,
            cnt_wrongs=cnt_wrongs,
            result=result
        )
        
        db.add(db_result)
        db.commit()
        db.refresh(db_result)
        
        return {
            **db_result.__dict__
        }
    except Exception as e:
        db.rollback()
        print(str(e))
        return {"error": str(e)}
    finally:
        db.close()

def edit_test(test: TestCreate):
    db = SessionLocal()
    try:
        db_test = db.query(TestDB).filter(TestDB.id == test.id).first()
        if not db_test:
            return "Test is not exist"
        if db_test.email != test.email:
            return "Incorrect user"
        
        # Преобразуем вопросы в словари
        if test.question_lst:
            db_test.question_lst = [q.dict() for q in test.question_lst]
        else:
            db_test.question_lst = []
            
        db_test.title = test.title
        db_test.type = test.type
        db_test.event_name = test.event_name
        db_test.event_description = test.event_description
        db_test.correct_answers_lst = test.correct_answers_lst
        db_test.incorrect_answers_lst = test.incorrect_answers_lst
        db_test.events_list = [event.dict() for event in test.events_list] if test.events_list else []
        
        db.commit()
        return db_test
    except Exception as e:
        db.rollback()
        return f"Error: {str(e)}"
    finally:
        db.close()

def get_tests_by_email(email: EmailStr):
    db = SessionLocal()
    try:
        tests = db.query(TestDB).filter(TestDB.email == email).all()
        return [
            TestCreate(
                id=test.id,
                email=test.email,
                author_name=test.author_name,
                title=test.title,
                type=test.type,
                event_name=test.event_name,
                event_description=test.event_description,
                correct_answers_lst=test.correct_answers_lst,
                incorrect_answers_lst=test.incorrect_answers_lst,
                events_list=[TimelineEvent(**event) for event in test.events_list],
                question_lst=test.question_lst
            )
            for test in tests
        ]
    finally:
        db.close()

def get_all_tests(email: EmailStr):
    db = SessionLocal()
    try:
        tests = db.query(TestDB).all()
        return [
            TestCreate(
                id=test.id,
                email=test.email,
                author_name=test.author_name,
                title=test.title,
                type=test.type,
                event_name=test.event_name,
                event_description=test.event_description,
                correct_answers_lst=test.correct_answers_lst,
                incorrect_answers_lst=test.incorrect_answers_lst,
                events_list=[TimelineEvent(**event) for event in test.events_list],
                question_lst=test.question_lst
            )
            for test in tests
        ]
    finally:
        db.close()