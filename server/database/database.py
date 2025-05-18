from pydantic import EmailStr
from typing import Optional
from random import shuffle

from models.models import User, TestWithoutResult, TestWithResult, TestForCreate, TestCreate, TestForPass, DefaultQuestionForPass
from security.pwdcrypt import encode_password

USER_DATA = {
    "example@mail.ru": {
        "email": "example@mail.ru",
        "first_name": "John",
        "last_name": "Doe",
        "middle_name": "Ivanovich",
        "birth_date": "2001-12-31",
        "education": "ITMO",
        "password": encode_password("password")
        },
    }

TESTS_DATA = {
    1: {
        "id": 1,
        "email": "example@mail.ru",
        "author_name": "John Doe Ivanovich",
        "title": "Первый тест",
        "type": "Timeline",
        "event_name": None,
        "event_description": None,
        "correct_answers_lst": [],
        "incorrect_answers_lst": [],
        "events_list": [
            {
                "name": "Name1",
                "description": "Description1"
            },
            {
                "name": "Name2",
                "description": "Description2"
            },
            {
                "name": "Name3",
                "description": "Description3"
            },
            {
                "name": "Name4",
                "description": "Description4"
            },
            {
                "name": "Name5",
                "description": "Description5"
            },
        ],
        "question_lst": []
    },
    2: {
        "id": 2,
        "email": "example@mail.ru",
        "author_name": "John Doe Ivanovich",
        "title": "Второй тест",
        "type": "Default",
        "event_name": None,
        "event_description": None,
        "correct_answers_lst": [],
        "incorrect_answers_lst": [],
        "events_list": [],
        "question_lst": [
            {
                "question": "Вопрос 1",
                "correct_answer": "I",
                "incorrect_answers": ['1', '2', '3']
            },
            {
                "question": "Вопрос 2",
                "correct_answer": "I",
                "incorrect_answers": ['1', '2', '3']
            },
            {
                "question": "Вопрос 3",
                "correct_answer": "I",
                "incorrect_answers": ['1', '2', '3']
            }
        ]
    }
}

TESTS_RESULTS = {
    1: {
        "test_id": 1,
        "email_user": "example@mail.ru",
        "author_name": "John Doe Ivanovich",
        "title": "Первый тест",
        "type": "Timeline",
        "event_name": None,
        "event_description": None,
        "correct_answers_lst": [],
        "incorrect_answers_lst": [],
        "events_list": [
            {
                "name": "Name1",
                "description": "Description1"
            },
            {
                "name": "Name2",
                "description": "Description2"
            },
            {
                "name": "Name3",
                "description": "Description3"
            },
            {
                "name": "Name4",
                "description": "Description4"
            },
            {
                "name": "Name5",
                "description": "Description5"
            },
        ],
        "question_lst": [],
        "cnt_wrongs": 0,
        "result": 100
    }
}



def get_user(email: EmailStr) -> User | None:
    if email in USER_DATA:
        return User(**USER_DATA[email])
    return None

def create_user(user: User) -> str:
    email = user.email
    if email not in USER_DATA:
        new_user = dict(user)
        password = new_user["password"]
        new_user["password"] = encode_password(password)
        USER_DATA[email] = new_user
        print(USER_DATA)
        return "Success"
    else:
        return "Error"

def create_test(test: TestForCreate) -> str:
    index_lst = list(TESTS_DATA.keys())
    index = index_lst[-1] + 1
    new_test = dict(test)
    new_test["id"] = index
    new_test["author_name"] = (USER_DATA[new_test["email"]]["last_name"] + ' ' 
    + USER_DATA[new_test["email"]]["first_name"] + ' ' + USER_DATA[new_test["email"]]["middle_name"])
    TESTS_DATA[index] = new_test
    return [TESTS_DATA, USER_DATA]

def get_passed_tests_by_email(email: EmailStr):
    lst_out = []
    for i in list(TESTS_RESULTS.keys()):
        if email == TESTS_RESULTS[i]["email_user"]:
            lst_out.append(TestWithResult(**TESTS_RESULTS[i]))
    return lst_out

def get_test_for_edit_by_id(id: int, email: EmailStr):
    if id in list(TESTS_DATA.keys()):
        test = TestCreate(**TESTS_DATA[id])
        if test.email != email:
            return "Incorrect user"
        else:
            return test
    else:
        return "Test is not exist"
    
def get_test_for_pass_by_id(id: int):
    if id in list(TESTS_DATA.keys()):
        test = TestCreate(**TESTS_DATA[id])

        if test.type == "Timeline":
            cnt_events = len(test.events_list)

            start_event = test.events_list[0]
            middle_event = test.events_list[cnt_events//2]
            end_event = test.events_list[-1]

            lst_events = test.events_list.copy()
            lst_events.pop(cnt_events//2)
            lst_events.pop(0)
            lst_events.pop()

            shuffle(lst_events)

            test_for_pass = TestForPass(title=test.title, type=test.type, start_event = start_event, 
                                        middle_event=middle_event, end_event=end_event, events_list=lst_events)
        elif test.type == "10cards":
            lst_answers = test.correct_answers_lst.copy()
            for elem in test.incorrect_answers_lst:
                lst_answers.append(elem)
            
            shuffle(lst_answers)
            
            test_for_pass = TestForPass(title=test.title, type=test.type, event_name=test.event_name, 
                                        answers_lst=lst_answers)
            
        else:
            question_lst = test.question_lst.copy()
            cnt_question = len(question_lst)

            for i in range(cnt_question):
                question_block = question_lst[i]

                answers = question_block.incorrect_answers.copy()
                answers.append(question_block.correct_answer)

                shuffle(answers)

                question_lst[i] = DefaultQuestionForPass(question=question_block.question, answers=answers)

            shuffle(question_lst)
            test_for_pass = TestForPass(title=test.title, type=test.type, question_lst=question_lst)

        return test_for_pass


    else:
        return "Test is not exist"
    
def passing_test(passed_test: TestWithoutResult):
    if passed_test.type == "10cards":
        cnt_wrongs = 0
        idx = passed_test.test_id
        original_test = TestCreate(**TESTS_DATA[idx])

        for elem in passed_test.correct_answers_lst:
            if elem not in original_test.correct_answers_lst:
                cnt_wrongs+=1

        for elem in passed_test.incorrect_answers_lst:
            if elem not in original_test.incorrect_answers_lst:
                cnt_wrongs+=1
        
        result = int(round(1 - cnt_wrongs/(len(passed_test.incorrect_answers_lst) + len(passed_test.correct_answers_lst)), 2)*100)

    elif passed_test.type == "Timeline":
        cnt_wrongs = passed_test.cnt_wrongs

        result = int(round(1 - cnt_wrongs/(len(passed_test.events_list)-3), 2)*100)

    else:
        cnt_wrongs = 0
        idx = passed_test.test_id
        original_test = TestCreate(**TESTS_DATA[idx])

        for elem in passed_test.question_lst:
            question = elem.question
            corr_answ = elem.correct_answer

            for element in original_test.question_lst:
                if question == element.question:
                    if corr_answ != element.correct_answer:
                        cnt_wrongs +=1
                    break
        
        result = int(round(1-cnt_wrongs/len(passed_test.question_lst), 2)*100)
     
    index = len(list(TESTS_RESULTS.keys()))+1
    TESTS_RESULTS[index] = dict(TestWithResult(result=result, **dict(passed_test), 
                                               author_name=USER_DATA[passed_test.email_user]["last_name"] + ' ' 
                                               + USER_DATA[passed_test.email_user]["first_name"] + ' '
                                               + USER_DATA[passed_test.email_user]["middle_name"]))
    return TESTS_RESULTS

    
def edit_test(test: TestCreate):
    index = test.id
    if index in list(TESTS_DATA.keys()):
        if TESTS_DATA[index]['email'] == test.email:
            edited_test = dict(test)
            TESTS_DATA[index] = edited_test
            return TESTS_DATA
        else:
            return "Incorrect user"
    else:
        return "Test is not exist"

def get_tests_by_email(email: EmailStr):
    index_lst = list(TESTS_DATA.keys())
    tests_lst = []

    for ind in index_lst:
        if TESTS_DATA[ind]['email'] == email:
            tests_lst.append(TestCreate(**TESTS_DATA[ind]))

    return tests_lst