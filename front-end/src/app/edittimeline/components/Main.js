'use client'
import Link from "next/link"
import styles from "./main.module.scss"
import { useEffect, useRef, useState } from "react"

const Block_rules_save = () => {
    return (
        <div className={styles.rules_block}>
            <h2>Правила создания теста</h2>
            <p>Для создания теста типа Timeline Вам необходимо заполнить форму справа. 
                После нажатия кнопки “Добавить” событие добавится в конец списка. 
                Порядок событий должен быть от раннего к позднему.</p>
            <button>Сохранить</button>
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

const Events_list = ({chosenId, setChosenId, events_lst}) => {

    const renderList = [];
    for(let i=0; i<events_lst.length; i++){
        renderList.push(
            <Added_event key={i} name={events_lst[i][0]} id={i} chosenId={chosenId} setChosenId={setChosenId} />
        )
    }

    return (
        <div className={styles.block_added_events}>
            <h3>Добавленные события</h3>
            {renderList}
        </div>
    );
}

const Cancel_button = () => {
    return (
        <div className={styles.cancel_btn_block}>
            <a href="./mytests">
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

const Inp_name_block = ({testName, setTestName}) => {
    return (
        <div className={styles.name_cancel_block}>
            <Test_Name_Input testName={testName} setTestName={setTestName} />
            <Cancel_button />
        </div>
    )
}

const Action_block = ({chosenId, setDelEvent, setStatusAdd, setEventDescr, setEventName, eventName, eventDescr}) => {

    const eventNameChange = (e) =>{
        setEventName(e.target.value);
    }

    const eventDescrChange = (e) => {
        setEventDescr(e.target.value);
    }

    const sendDataEvent = ({setStatusAdd}) => {
        setStatusAdd(1);
    }

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
            <h3>Событие</h3>

            <input
            type="text"
            value={eventName}
            onChange={eventNameChange}
            placeholder="Название события"
            />

            <textarea 
            type="text"
            value={eventDescr}
            onChange={eventDescrChange}
            placeholder="Описание события"
            />

            <div className={styles.block_btn}>
                {save_btn}
                {delete_btn}
            </div>
        </div>
    )
}

const Test_table = () => {
    const [chosenId, setChosenId] = useState(-1);

    const [testName, setTestName] = useState('');

    const [eventName, setEventName] = useState('');
    const [eventDescr, setEventDescr] = useState('');
    const [events_lst, setEventsList] = useState([]);
    
    const [statusAdd, setStatusAdd] = useState(0);
    const [falseRender, setFalseRender] = useState(0);

    const [delEvent, setDelEvent] = useState(0);

    useEffect(
        ()=>{
            if(falseRender === 1){
                setFalseRender(0);
            }
            else{
                if(eventName !== '' && eventDescr !== ''){
                    if (chosenId === -1){
                        const new_events = events_lst.map((elem) => elem);
                        new_events.push([eventName, eventDescr]);
                        setEventsList(new_events);

                        setEventName('');
                        setEventDescr('');
                        setStatusAdd(0);
                    }
                    else{
                        const new_events = events_lst.map((elem) => elem);
                        new_events[chosenId] = [eventName, eventDescr];
                        setEventsList(new_events);

                        setEventName('');
                        setEventDescr('');
                        setChosenId(-1);
                        setStatusAdd(0);
                    }
                }
                else{
                    setStatusAdd(0);
                }
                if(delEvent !== 0){
                    setEventName('')
                    setEventDescr('')
                    setStatusAdd(0);
                    setFalseRender(1);
                    setDelEvent(0);

                    const new_events = [];
                    for(let i=0; i<events_lst.length; i++){
                        if(i !== chosenId){
                            new_events.push(events_lst[i])
                        }
                    }
                    setEventsList(new_events);
                    setChosenId(-1);
                }
            }
        },
        [statusAdd, delEvent]
    );

    useEffect(
        () => {
            if(chosenId !== -1){
                setEventName(events_lst[chosenId][0])
                setEventDescr(events_lst[chosenId][1])
            }
        }
    , [chosenId]);

    return (
        <table className={styles.tests_table}>
            <tbody>
                <tr>
                    <td>
                        <Inp_name_block testName={testName} setTestName={setTestName}/>
                    </td>
                    <td>
                        <Block_rules_save />
                    </td>
                    <td>
                        <Action_block setDelEvent={setDelEvent} chosenId={chosenId} statusAdd={statusAdd} setStatusAdd={setStatusAdd} setEventName={setEventName} eventName={eventName} eventDescr={eventDescr} setEventDescr={setEventDescr}/>
                    </td>
                    <td>
                        <Events_list chosenId={chosenId} setChosenId={setChosenId} events_lst={events_lst}/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

const Page_text = () => {
    return (
        <div className={styles.page_text}>
            <h1>Создание теста</h1>
            <h2>Тип теста: Timeline</h2>
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