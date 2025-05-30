'use client'
import Link from "next/link"
import styles from "./main.module.scss"
import { toast } from "react-toastify"
import axios from "axios"
import axiosInstance from '@/app/lib/axios'
import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"

const Added_question = ({ name, id, chosenId, setChosenId }) => {
    const [style_block, setStyle] = useState(styles.block_for_pick);

    useEffect(() => {
        if (id === chosenId) {
            setStyle(styles.block_picked);
        } else {
            setStyle(styles.block_for_pick);
        }
    }, [chosenId, id]);

    return (
        <div className={style_block}>
            <button onClick={() => setChosenId(id)}>
                <h3>{name}</h3>
            </button>
        </div>
    );
}

const Questions_lst = ({chosenId, setChosenId, questions_lst}) => {

    const renderList = [];
    for(let i=0; i<questions_lst.length; i++){
        renderList.push(
            <Added_question key={i} name={questions_lst[i]['question']} id={i} chosenId={chosenId} setChosenId={setChosenId} />
        )
    }

    return (
        <div className={styles.block_added_events}>
            <h3>Добавленные вопросы</h3>
            {renderList}
        </div>
    );
}

const Cancel_button = () => {
    return (
        <div className={styles.cancel_btn_block}>
            <a href="/mytests">
                <button>
                    <h2>
                        Отменить
                    </h2>
                </button>
            </a>
        </div>
    )
}

const Test_Name_Input = ({testName, setTestName}) => {
    const handleChange = (e) => {
      setTestName(e.target.value);
    };
  
    const handleSubmit = () => {
      // Сохранение в localStorage
      // localStorage.setItem('testName', testName);
      
      // Или отправка на API
      // fetch('/api/tests', { method: 'POST', body: JSON.stringify({ name: testName }) })
    };
  
    return (
      <div className={styles.block_inp_name}>
        <input
          type="text"
          value={testName}
          onChange={handleChange}
          placeholder="Название теста"
        />
      </div>
    )}

const Inp_name_block = ({testName, setTestName, handleEditTest}) => {
    return (
        <div className={styles.name_cancel_block}>
            <Test_Name_Input testName={testName} setTestName={setTestName} />
            <div className={styles.block_btn}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <Cancel_button />
                            </td>
                            <td>
                                <button type="button" onClick={async () => {await handleEditTest()}}>Сохранить</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const Action_block = ({
    chosenId, setDelEvent, incorrAnswFirst, setIncorrAnswFirst,
    incorrAnswSecond, setIncorrAnswSecond, incorrAnswThird, setIncorrAnswThird,
    setStatusAdd, setCorrAnsw, setQuestion, question, corrAnsw
    }) => {

    const questionChange = (e) =>{
        setQuestion(e.target.value);
    };

    const sendDataEvent = ({setStatusAdd}) => {
        setStatusAdd(1);
    };

    const corrAnswChange = (e) => {
        setCorrAnsw(e.target.value);
    };

    const incorrAnswFirstChange = (e) => {
        setIncorrAnswFirst(e.target.value);
    };

    const incorrAnswSecondChange = (e) => {
        setIncorrAnswSecond(e.target.value);
    };

    const incorrAnswThirdChange = (e) => {
        setIncorrAnswThird(e.target.value);
    };

    let delete_btn = null;
    let save_btn = <button onClick={()=>{sendDataEvent({setStatusAdd})}}>Добавить</button>;
    if(chosenId !== -1){
        delete_btn = <button 
        className={styles.delete_btn}
        onClick={()=>{
            setDelEvent(1);
        }}
        >
            Удалить
        </button>

        save_btn = <button onClick={()=>{sendDataEvent({setStatusAdd})}}>Сохранить</button>
    }
    
    return (
        <div className={styles.block_create_event}>
            <h3>Вопрос</h3>

            <table>
                <tbody>
                    <tr>
                        <td>
                            <input
                            type="text"
                            value={question}
                            onChange={questionChange}
                            placeholder="Вопрос"
                            />

                            <h3>Правильный ответ:</h3>

                            <input
                            type="text"
                            value={corrAnsw}
                            onChange={corrAnswChange}
                            placeholder="Правильный ответ"
                            />

                            <div className={styles.block_btn}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {save_btn}
                                            </td>
                                            <td>
                                                {delete_btn}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                        <td>
                            <h3>Неправильные ответы:</h3>

                            <input
                            type="text"
                            value={incorrAnswFirst}
                            onChange={incorrAnswFirstChange}
                            placeholder="Неправильный ответ"
                            />

                            <input
                            type="text"
                            value={incorrAnswSecond}
                            onChange={incorrAnswSecondChange}
                            placeholder="Неправильный ответ"
                            />

                            <input
                            type="text"
                            value={incorrAnswThird}
                            onChange={incorrAnswThirdChange}
                            placeholder="Неправильный ответ"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    )
}

const Test_table = () => {
    const [chosenId, setChosenId] = useState(-1);

    const [testName, setTestName] = useState('');

    const [question, setQuestion] = useState('');
    const [corrAnsw, setCorrAnsw] = useState('');
    const [questions_lst, setQuestionsList] = useState([]);

    const [incorrAnswFirst, setIncorrAnswFirst] = useState('');
    const [incorrAnswSecond, setIncorrAnswSecond] = useState('');
    const [incorrAnswThird, setIncorrAnswThird] = useState('');
    
    const [statusAdd, setStatusAdd] = useState(0);
    const [falseRender, setFalseRender] = useState(1);

    const [delEvent, setDelEvent] = useState(0);

    const params = useParams();
    const testId = String(params?.id);

    const handleGetInfo = async () => {
        try{
            const response = await axiosInstance.get('/edit_test/'+testId);
            if (response.status === 200){
                setTestName(response.data["title"]);
                const question_lst = response.data["question_lst"]
                const new_question_lst = [];
                for (let i=0; i<question_lst.length; i++){
                    new_question_lst.push(
                        {
                            question: question_lst[i]["question"],
                            corrAnsw: question_lst[i]['correct_answer'],
                            incorrAnswFirst: question_lst[i]['incorrect_answers'][0],
                            incorrAnswSecond: question_lst[i]['incorrect_answers'][1],
                            incorrAnswThird: question_lst[i]['incorrect_answers'][2]
                        }
                    )
                }
                setQuestionsList(new_question_lst);
            }else{
                toast.error("Что-то не так");
            }
        }catch (error){
            if (axios.isAxiosError(error) && error.response){
                toast.error('Что-то пошло не так :(');
            }else{
                toast.error("Сетевая ошибка");
            }
        }
    }

    useEffect(
        ()=>{
            if(falseRender === 1){
                setFalseRender(0);
                handleGetInfo();
            }
            else{
                if(question !== '' && corrAnsw !== '' && incorrAnswFirst !== '' && incorrAnswSecond !== '' && incorrAnswThird!==''){
                    if (chosenId === -1){
                        const new_questions = questions_lst.map((elem) => elem);
                        new_questions.push(
                            {
                                question: question,
                                corrAnsw: corrAnsw,
                                incorrAnswFirst: incorrAnswFirst,
                                incorrAnswSecond: incorrAnswSecond,
                                incorrAnswThird: incorrAnswThird
                            }
                        );
                        setQuestionsList(new_questions);

                        setQuestion('');
                        setCorrAnsw('');
                        setIncorrAnswFirst('');
                        setIncorrAnswSecond('');
                        setIncorrAnswThird('');
                        setStatusAdd(0);
                    }
                    else{
                        const new_questions = questions_lst.map((elem) => elem);
                        new_questions[chosenId] = {
                            question: question,
                            corrAnsw: corrAnsw,
                            incorrAnswFirst: incorrAnswFirst,
                            incorrAnswSecond: incorrAnswSecond,
                            incorrAnswThird: incorrAnswThird
                        };
                        setQuestionsList(new_questions);

                        setQuestion('');
                        setCorrAnsw('');
                        setIncorrAnswFirst('');
                        setIncorrAnswSecond('');
                        setIncorrAnswThird('');
                        setChosenId(-1);
                        setStatusAdd(0);
                    }
                }
                else{
                    setStatusAdd(0);
                }
                if(delEvent !== 0){
                    setQuestion('');
                    setCorrAnsw('');
                    setIncorrAnswFirst('');
                    setIncorrAnswSecond('');
                    setIncorrAnswThird('');
                    setStatusAdd(0);
                    setFalseRender(1);
                    setDelEvent(0);

                    const new_questions = [];
                    for(let i=0; i<questions_lst.length; i++){
                        if(i !== chosenId){
                            new_questions.push(questions_lst[i])
                        }
                    }
                    setQuestionsList(new_questions);
                    setChosenId(-1);
                }
            }
        },
        [statusAdd, delEvent]
    );

    useEffect(
        () => {
            if(chosenId !== -1){
                setQuestion(questions_lst[chosenId]['question']);
                setCorrAnsw(questions_lst[chosenId]['corrAnsw']);
                setIncorrAnswFirst(questions_lst[chosenId]['incorrAnswFirst']);
                setIncorrAnswSecond(questions_lst[chosenId]['incorrAnswSecond']);
                setIncorrAnswThird(questions_lst[chosenId]['incorrAnswThird'])
            }
        }
    , [chosenId]);

    const handleEditTest = async () => {
        if (testName !== '' && questions_lst.length !== 0){
            try{
                const new_questions = [];
                for (let i=0; i<questions_lst.length; i++){
                    new_questions.push(
                        {
                            question: questions_lst[i]["question"],
                            correct_answer: questions_lst[i]['corrAnsw'],
                            incorrect_answers: [questions_lst[i]['incorrAnswFirst'], questions_lst[i]['incorrAnswSecond'], questions_lst[i]['incorrAnswThird']]
                        }
                    )
                }
                const response = await axiosInstance.post('/edit_test/'+testId, {
                    "title": testName,
                    "type": "Default",
                    "event_name": '',
                    "event_description": '',
                    "correct_answers_lst": [],
                    "incorrect_answers_lst": [],
                    "events_list": [],
                    "question_lst": new_questions
                })

                if (response.status === 200){
                    toast.success("Тест отредактирован!");
                }else{
                    toast.error("Что-то не так");
                }
            }catch (error){
                if (axios.isAxiosError(error) && error.response){
                    if (error.response.status === 401){
                        toast.error("Вы не авторизованы!");
                    }else{
                        toast.error("Что-то пошло не так :(")
                    }
                }else{
                    toast.error("Сетевая ошибка")
                }
            }
        }else{
            toast.error("Не все поля заполнены!")
        }
    }

    return (
        <table className={styles.tests_table}>
            <tbody>
                <tr>
                    <td>
                        <Inp_name_block handleEditTest={handleEditTest} testName={testName} setTestName={setTestName}/>
                    </td>
                    <td>
                        <Action_block 
                        setDelEvent={setDelEvent} chosenId={chosenId} statusAdd={statusAdd} 
                        setStatusAdd={setStatusAdd} incorrAnswFirst={incorrAnswFirst} 
                        setIncorrAnswFirst={setIncorrAnswFirst}  incorrAnswSecond={incorrAnswSecond}
                        setIncorrAnswSecond={setIncorrAnswSecond} incorrAnswThird={incorrAnswThird} 
                        setIncorrAnswThird={setIncorrAnswThird} setQuestion={setQuestion} 
                        question={question} corrAnsw={corrAnsw} setCorrAnsw={setCorrAnsw}/>
                    </td>
                    <td>
                        <Questions_lst chosenId={chosenId} setChosenId={setChosenId} questions_lst={questions_lst}/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

const Page_text = () => {
    return (
        <div className={styles.page_text}>
            <h1>Редактирование теста</h1>
            <h2>Тип теста: Default</h2>
        </div>
    )
}

export const Main = () => {
    return (
        <main>
            <Page_text/>
            <Test_table />
        </main>
    )
}