from pydantic import EmailStr
from typing import Optional
from random import shuffle

from models.models import User, TestWithoutResult, TestWithResult, TestForCreate, TestCreate, TestForPass, DefaultQuestionForPass
from security.pwdcrypt import encode_password

USER_DATA = {
    "example@mail.ru": {
        "email": "example@mail.ru",
        "first_name": "Никита",
        "last_name": "Лютый",
        "middle_name": "Артемович",
        "birth_date": "2006-10-03",
        "education": "ITMO University",
        "password": encode_password("password")
        },
    }

TESTS_DATA = {
    1: {
        "id": 1,
        "email": "example@mail.ru",
        "author_name": "Лютый Никита Артемович",
        "title": "История освоения космоса",
        "type": "Timeline",
        "event_name": None,
        "event_description": None,
        "correct_answers_lst": [],
        "incorrect_answers_lst": [],
        "events_list": [
            {
                "name": "Запуск «Спутника-1»",
                "description": "Запуск первого искусственного спутника Земли (СССР, 1957г.)"
            },
            {
                "name": "Полет Юрия Гагарина",
                "description": "Первый человек в космосе (1961 г.)."
            },
            {
                "name": "Программа «Аполлон»",
                "description": "Высадка на Луну (Нил Армстронг, 1969 г.)"
            },
            {
                "name": "Запуск «Союз-Аполлон»",
                "description": "Первая международная стыковка (1975 г.)."
            },
            {
                "name": "Старт программы «Спейс Шаттл»",
                "description": "Старт создания американского многоразового транспортного космического корабля (1981 г.)."
            },
            {
                "name": "Запуск станции «Мир»",
                "description": "Первая модульная орбитальная станция (1986 г.)."
            },
            {
                "name": "Начало работы МКС",
                "description": "Начало работы международного космического проекта (1998 г.)."
            },
        ],
        "question_lst": []
    },
    2: {
        "id": 2,
        "email": "example@mail.ru",
        "author_name": "Лютый Никита Артемович",
        "title": "СССР в 1920–1930-е годы",
        "type": "Default",
        "event_name": None,
        "event_description": None,
        "correct_answers_lst": [],
        "incorrect_answers_lst": [],
        "events_list": [],
        "question_lst": [
            {
                "question": "Как назывался первый пятилетний план развития экономики СССР?",
                "correct_answer": "Пятилетка",
                "incorrect_answers": ['План ГОЭЛРО', 'Новая экономическая политика (НЭП)', 'План "Барбаросса"']
            },
            {
                "question": "Что стало главной целью коллективизации в СССР?",
                "correct_answer": "Создание колхозов и ликвидация кулачества",
                "incorrect_answers": ['Развитие частного фермерства', 'Увеличение импорта зерна', 'Возрождение помещичьих хозяйств']
            },
            {
                "question": "Какой процесс сопровождался массовыми арестами и расстрелами в 1937–1938 гг.?",
                "correct_answer": "Большой террор",
                "incorrect_answers": ['Индустриализация', 'Косыгинская реформа', 'Оттепель']
            },
            {
                "question": "Какая стройка стала символом индустриализации в 1930-е?",
                "correct_answer": "Магнитогорский металлургический комбинат",
                "incorrect_answers": ['Байкало-Амурская магистраль (БАМ)', 'Волго-Донской канал', 'Транссибирская магистраль']
            },
            {
                "question": "Кто возглавлял НКВД во время Большого террора?",
                "correct_answer": "Николай Ежов",
                "incorrect_answers": ['Лаврентий Берия', 'Феликс Дзержинский', 'Вячеслав Молотов']
            }
        ]
    },
    3: {
        "id": 3,
        "email": "example@mail.ru",
        "author_name": "Лютый Никита Артемович",
        "title": "Распад колониальных империй после Второй мировой войны",
        "type": "10cards",
        "event_name": "Суэцкий кризис",
        "event_description": "Суэцкий кризис (1956) – международный конфликт, вызванный национализацией Египтом Суэцкого канала, ранее контролировавшегося Великобританией и Францией. В ответ Израиль вторгся на Синайский полуостров, а Великобритания и Франция начали бомбардировки Египта под предлогом «защиты канала». Кризис обострился, когда СССР пригрозил ядерным ударом по Лондону и Парижу, а США осудили действия союзников, потребовав их вывода. В итоге под давлением ООН интервенция прекратилась, что стало началом конца британского и французского влияния на Ближнем Востоке.",
        "correct_answers_lst": ['Национализация Суэцкого канала', 'Вторжение Израиля на Синай', 'Угроза СССР о ядерном ударе', 'Давление США через ООН', 'Потеря влияния Великобритании и Франции в регионе'],
        "incorrect_answers_lst": ['Алжирская война', 'Карибский кризис', 'Война во Вьетнаме', 'Корейская война', 'Берлинский кризис'],
        "events_list": [],
        "question_lst": []
    }
}

TESTS_RESULTS = {
    1: {
        "test_id": 1,
        "email_user": "example@mail.ru",
        "author_name": "Лютый Никита Артемович",
        "title": "История освоения космоса",
        "type": "Timeline",
        "event_name": None,
        "event_description": None,
        "correct_answers_lst": [],
        "incorrect_answers_lst": [],
        "events_list": [
            {
                "name": "Запуск «Спутника-1»",
                "description": "Запуск первого искусственного спутника Земли (СССР, 1957г.)"
            },
            {
                "name": "Полет Юрия Гагарина",
                "description": "Первый человек в космосе (1961 г.)."
            },
            {
                "name": "Программа «Аполлон»",
                "description": "Высадка на Луну (Нил Армстронг, 1969 г.)"
            },
            {
                "name": "Запуск «Союз-Аполлон»",
                "description": "Первая международная стыковка (1975 г.)."
            },
            {
                "name": "Старт программы «Спейс Шаттл»",
                "description": "Старт создания американского многоразового транспортного космического корабля (1981 г.)."
            },
            {
                "name": "Запуск станции «Мир»",
                "description": "Первая модульная орбитальная станция (1986 г.)."
            },
            {
                "name": "Начало работы МКС",
                "description": "Начало работы международного космического проекта (1998 г.)."
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
                                        middle_event=middle_event, end_event=end_event, events_list=lst_events, 
                                        author_name=test.author_name, correct_events_list=test.events_list)
        elif test.type == "10cards":
            lst_answers = test.correct_answers_lst.copy()
            for elem in test.incorrect_answers_lst:
                lst_answers.append(elem)
            
            shuffle(lst_answers)
            
            test_for_pass = TestForPass(title=test.title, type=test.type, event_name=test.event_name, 
                                        answers_lst=lst_answers, author_name=test.author_name)
            
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
            test_for_pass = TestForPass(title=test.title, type=test.type, question_lst=question_lst, 
                                        author_name=test.author_name)

        return test_for_pass


    else:
        return "Test is not exist"
    
def passing_test(passed_test: TestWithoutResult):
    idx = passed_test.test_id
    original_test = TestCreate(**TESTS_DATA[idx])

    if passed_test.type == "10cards":
        cnt_wrongs = 0

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
    TESTS_RESULTS[index] = dict(TestWithResult(result=result, **dict(passed_test)))
    return dict(**TESTS_DATA[passed_test.test_id], result=result)

    
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

def get_all_tests(email: EmailStr):
    index_lst = list(TESTS_DATA.keys())
    all_tests = list(map(lambda x: TestCreate(**TESTS_DATA[x]), index_lst))
    return all_tests