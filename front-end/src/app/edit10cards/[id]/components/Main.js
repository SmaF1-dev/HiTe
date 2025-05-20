'use client'
import Link from "next/link"
import styles from "./main.module.scss"
import { toast } from "react-toastify"
import axios from "axios"
import axiosInstance from '@/app/lib/axios'
import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"

const Block_Create_Incorrect_Event = ({setDelIncorrFlag, incorrect_event, setIncorrectEvent, setAddIncorrFlag, chosenIncorrId}) => {

    const change_incorrect_event = (e) => {
        setIncorrectEvent(e.target.value)
    }

    let save_btn = <button onClick={()=>{setAddIncorrFlag(1)}}>Добавить</button>;
    let del_btn = null;

    if(chosenIncorrId !== -1){
        save_btn = <button onClick={()=>{setAddIncorrFlag(1)}}>Сохранить</button>;
        del_btn = <button className={styles.delete_btn} onClick={()=>{
            setDelIncorrFlag(1);
        }}>Удалить</button>;
    }
    
    return (
        <div className={styles.block_add_event}>
            <h3>Ложное событие</h3>
            <input 
            type="text"
            value={incorrect_event}
            onChange={change_incorrect_event}
            placeholder="Название события..."
            />
            {save_btn}
            {del_btn}
        </div>
    )
}

const Block_Create_Correct_Event = ({setDelCorrFlag, correct_event, setCorrectEvent, setAddCorrFlag, chosenCorrId}) => {

    const change_correct_event = (e) => {
        setCorrectEvent(e.target.value)
    }

    let save_btn = <button onClick={()=>{setAddCorrFlag(1)}}>Добавить</button>;
    let del_btn = null;

    if(chosenCorrId !== -1){
        save_btn = <button onClick={()=>{setAddCorrFlag(1)}}>Сохранить</button>;
        del_btn = <button className={styles.delete_btn} onClick={()=>{
            setDelCorrFlag(1);
        }}>Удалить</button>;
    }
    
    return (
        <div className={styles.block_add_event}>
            <h3>Правильное событие</h3>
            <input 
            type="text"
            value={correct_event}
            onChange={change_correct_event}
            placeholder="Название события..."
            />
            {save_btn}
            {del_btn}
        </div>
    )
}

const Block_Create_Events = ({correct_event, setCorrEvent, incorrect_event,
    setIncorrEvent, chosenIncorrId, chosenCorrId, setAddCorrFlag, setAddIncorrFlag,
    setDelCorrFlag, setDelIncorrFlag}) => {

    return(
        <div>
            <Block_Create_Correct_Event setDelCorrFlag={setDelCorrFlag} chosenCorrId={chosenCorrId} 
            correct_event={correct_event} setAddCorrFlag={setAddCorrFlag} setCorrectEvent={setCorrEvent} />
            <Block_Create_Incorrect_Event setDelIncorrFlag={setDelIncorrFlag} chosenIncorrId={chosenIncorrId} 
            incorrect_event={incorrect_event} setIncorrectEvent={setIncorrEvent} setAddIncorrFlag={setAddIncorrFlag} />
        </div>
    )
}

const Added_event = ({ name, id, chosenId, setChosenId }) => {
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

const Events_Correct_list = ({chosenCorrId, setChosenCorrId, correct_events_lst}) => {

    const renderList = [];
    for(let i=0; i<correct_events_lst.length; i++){
        renderList.push(
            <Added_event key={i} name={correct_events_lst[i]} id={i} chosenId={chosenCorrId} setChosenId={setChosenCorrId} />
        )
    }

    return (
        <div className={styles.block_added_events}>
            <h3>Верные события</h3>
            {renderList}
        </div>
    );
}

const Events_Incorrect_list = ({chosenIncorrId, setChosenIncorrId, incorrect_events_lst}) => {

    const renderList = [];
    for(let i=0; i<incorrect_events_lst.length; i++){
        renderList.push(
            <Added_event key={i} name={incorrect_events_lst[i]} id={i} chosenId={chosenIncorrId} setChosenId={setChosenIncorrId} />
        )
    }

    return (
        <div className={styles.block_added_events}>
            <h3>Ложные события</h3>
            {renderList}
        </div>
    );
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

const Inp_name_block = ({testName, setTestName}) => {
    return (
        <Test_Name_Input testName={testName} setTestName={setTestName} />
    )
}

const Action_block = ({handleEditTest, setEventDescr, setEventName, eventName, eventDescr, setStatusAdd}) => {

    const eventNameChange = (e) =>{
        setEventName(e.target.value);
    }

    const eventDescrChange = (e) => {
        setEventDescr(e.target.value);
    }

    const sendDataEvent = ({setStatusAdd}) => {
        setStatusAdd(1);
    }
    
    return (
        <div className={styles.block_create_event}>
            <h3>Событие</h3>

            <input
            type="text"
            value={eventName}
            onChange={eventNameChange}
            placeholder="Название события..."
            />

            <textarea 
            type="text"
            value={eventDescr}
            onChange={eventDescrChange}
            placeholder="Описание с использованием верных событий как ключевых слов..."
            />

            <div className={styles.block_btn}>
                <button type="button" onClick={async () => {await handleEditTest()}}>Сохранить тест</button>
                <a href="/mytests">
                    <button type="button" className={styles.cancel_btn}>
                        <h2>
                            Отменить
                        </h2>
                    </button>
                </a>
            </div>
        </div>
    )
}

const Test_table = () => {
    const [chosenCorrId, setChosenCorrId] = useState(-1);
    const [chosenIncorrId, setChosenIncorrId] = useState(-1);

    const [testName, setTestName] = useState('');

    const [eventName, setEventName] = useState('');
    const [eventDescr, setEventDescr] = useState('');

    const [correct_events_lst, setCorrEventsList] = useState([]);
    const [incorrect_events_lst, setIncorrEventsList] = useState([]);

    const [correct_event, setCorrEvent] = useState('');
    const [incorrect_event, setIncorrEvent] = useState('');

    const [add_corr_flag, setAddCorrFlag] = useState(0);
    const [add_incorr_flag, setAddIncorrFlag] = useState(0);

    const [del_corr_flag, setDelCorrFlag] = useState(0);
    const [del_incorr_flag, setDelIncorrFlag] = useState(0);

    const [falseRender, setFalseRender] = useState(1);

    const [statusAdd, setStatusAdd] = useState(0);

    const params = useParams();
    const testId = String(params?.id);
    

    useEffect(
        ()=>{
            if(falseRender === 1){
                setFalseRender(0);

            }
            else{
                if(correct_event !== ''){
                    if (chosenCorrId === -1){
                        const new_events = correct_events_lst.map((elem) => elem);
                        new_events.push(correct_event);
                        setCorrEventsList(new_events);

                        setCorrEvent('');
                        setAddCorrFlag(0);
                    }
                    else{
                        const new_events = correct_events_lst.map((elem) => elem);
                        new_events[chosenCorrId] = correct_event;
                        setCorrEventsList(new_events);

                        setCorrEvent('');
                        setChosenCorrId(-1);
                        setAddCorrFlag(0);
                    }
                }
                else{
                    setAddCorrFlag(0);
                }

                if (del_corr_flag !== 0){
                    setAddCorrFlag(0);
                    setCorrEvent('');
                    setFalseRender(1);
                    setDelCorrFlag(0);

                    const new_events = [];
                    for(let i=0; i<correct_events_lst.length; i++){
                        if(i !== chosenCorrId){
                            new_events.push(correct_events_lst[i])
                        }
                    }

                    setCorrEventsList(new_events);
                    setChosenCorrId(-1);
                }
            }
        },
        [add_corr_flag, del_corr_flag]
    )

    const handleGetInfo = async () => {
        try{
            const response = await axiosInstance.get('/edit_test/'+testId);
            if (response.status === 200){
                setTestName(response.data["title"]);
                setEventName(response.data["event_name"]);
                setEventDescr(response.data["event_description"]);
                setCorrEventsList(response.data["correct_answers_lst"]);
                setIncorrEventsList(response.data["incorrect_answers_lst"]);
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
                if(incorrect_event !== ''){
                    if (chosenIncorrId === -1){
                        const new_events = incorrect_events_lst.map((elem) => elem);
                        new_events.push(incorrect_event);
                        setIncorrEventsList(new_events);
    
                        setIncorrEvent('');
                        setAddIncorrFlag(0);
                    }
                    else{
                        if(add_incorr_flag !== 0){
                            const new_events = incorrect_events_lst.map((elem) => elem);
                            new_events[chosenIncorrId] = incorrect_event;
                            setIncorrEventsList(new_events);
    
                            setIncorrEvent('');
                            setChosenIncorrId(-1);
                            setAddIncorrFlag(0);
                        }
                    }
                }
                else{
                    setAddIncorrFlag(0);
                }

                if (del_incorr_flag !== 0){
                    setAddIncorrFlag(0);
                    setIncorrEvent('');
                    setDelIncorrFlag(0);

                    const new_events = [];
                    for(let i=0; i<incorrect_events_lst.length; i++){
                        if(i !== chosenIncorrId){
                            new_events.push(incorrect_events_lst[i])
                        }
                    }

                    setIncorrEventsList(new_events);
                    setChosenIncorrId(-1);
                }
            }
        }, [add_incorr_flag, del_incorr_flag]
    )

    useEffect(()=>{
        if(chosenCorrId !== -1){
            setCorrEvent(correct_events_lst[chosenCorrId])
        }
        if (chosenIncorrId !== -1){
            setIncorrEvent(incorrect_events_lst[chosenIncorrId])
        }
    }, [chosenCorrId, chosenIncorrId])

    const handleEditTest =  async () => {
        if (falseRender==0 && testName !== '' && eventDescr !== '' && eventName !== '' && correct_events_lst.length !== 0 && incorrect_events_lst.length !== 0){
            try{
                const response = await axiosInstance.post('/edit_test/'+testId, {
                    "title": testName,
                    "type": "10cards",
                    "event_name": eventName,
                    "event_description": eventDescr,
                    "correct_answers_lst": correct_events_lst,
                    "incorrect_answers_lst": incorrect_events_lst,
                    "events_list": [],
                    "question_lst": []
                })

                if (response.status === 200){
                    toast.success("Тест успешно отредактирован!");
                }else{
                    toast.error("Что-то не так");
                }
            }catch (error){
                if (axios.isAxiosError(error) && error.response){
                    if (error.response.status === 401){
                        toast.error("Вы не авторизованы!");
                    }else{
                        toast.error("Что-то пошло не так :(");
                    }
                }else{
                    toast.error("Сетевая ошибка");
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
                        <Inp_name_block testName={testName} setTestName={setTestName}/>
                        <Action_block handleEditTest={handleEditTest} setStatusAdd={setStatusAdd} eventDescr={eventDescr} eventName={eventName} setEventDescr={setEventDescr} setEventName={setEventName} />
                    </td>
                    <td>
                        <Block_Create_Events
                        setAddCorrFlag={setAddCorrFlag} setAddIncorrFlag={setAddIncorrFlag} correct_event={correct_event}
                        setCorrEvent={setCorrEvent} incorrect_event={incorrect_event} setIncorrEvent={setIncorrEvent}
                        chosenCorrId={chosenCorrId} chosenIncorrId={chosenIncorrId} setDelCorrFlag={setDelCorrFlag} setDelIncorrFlag={setDelIncorrFlag} />
                    </td>
                    <td>
                        <Events_Correct_list chosenCorrId={chosenCorrId} setChosenCorrId={setChosenCorrId} correct_events_lst={correct_events_lst}/>
                    </td>
                    <td>
                        <Events_Incorrect_list chosenIncorrId={chosenIncorrId} setChosenIncorrId={setChosenIncorrId} incorrect_events_lst={incorrect_events_lst}/>
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
            <h2>Тип теста: 10 cards</h2>
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