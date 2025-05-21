'use client'
import Link from "next/link"
import styles from "./main.module.scss"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios, { all } from "axios"
import axiosInstance from '@/app/lib/axios'
import { useRouter } from "next/navigation"

const Block_base_event = ({name, description}) => {
    return (
        <div className={styles.base_event_block}>
            <h2>{name}</h2>
            <p>{description}</p>
        </div>
    )
}

const Block_rules = ({result, miniTitle, descrResult}) => {
    let styleBlock = styles.rules_block;
    if (result >= 75){
        styleBlock = styles.finish_block_gr;
    }else if (result >= 50){
        styleBlock = styles.finish_block_ye;
    }else if (result >= 0){
        styleBlock = styles.finish_block_re;
    } 
    return (
        <div className={styleBlock}>
            <h2>{miniTitle}</h2>
            <p>{descrResult}</p>
        </div>
    )
}

const Block_event_for_choose = ({name}) => {
    return (
        <div className={styles.picked_event_block}>
            <h2>{name}</h2>
        </div>
    )
}

const Block_picked_event = ({name}) => {
    return (
        <div className={styles.picked_event_block}>
            <h2>{name}</h2>
        </div>
    )
}

const Block_for_pick = ({ id, chosenId, setChosenId }) => {
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
            <button onClick={() => {setChosenId(id);}}>
                {id}
            </button>
        </div>
    );
}

const Events_list = ({eventsList}) => {

    return (
        <div>
            {eventsList}
        </div>
    );
}

const Save_btn = ({setChooseFlag, result}) => {
    let styleBlock = styles.save_block;
    if (result>=0){
        styleBlock = styles.no_elem;
    }
    return (
        <div className={styleBlock}>
            <button onClick={() => { setChooseFlag(1) }}>
                <h2>Выбрать</h2>
            </button>
        </div>
    )
}

const Test_table = ({startEvent, middleEvent, endEvent, pickedId, setPickedId, allEvents, corrAllEvents, 
    miniTitle, setMiniTitle, descrResult, setDescrResult, result, cntWrongs, setCntWrongs, choosed, setChoose,
    chosenId, setChosenId, eventsList, chooseFlag, setChooseFlag}) => {

    useEffect(() => {
        if(chooseFlag===1 && chosenId !== -1){
            let left_event = choosed[chosenId-1];
            let right_event = choosed[chosenId+1];
            let event_for_pick = allEvents[pickedId]["name"];
            let left_idx = -1;
            let right_idx = -1;
            let our_idx = -1;
            
            for (let i=0; i<corrAllEvents.length; i++){
                if (corrAllEvents[i]["name"] === left_event){
                    left_idx = i;
                }else if (corrAllEvents[i]["name"] === right_event){
                    right_idx = i;
                }else if (corrAllEvents[i]["name"] === event_for_pick){
                    our_idx = i;
                }
            }

            if (left_idx<our_idx && right_idx>our_idx){
                console.log("правильно")
                let copy_choosed_1 = choosed.slice(0, choosed.indexOf(left_event)+1);
                let copy_choosed_2 = choosed.slice(choosed.indexOf(right_event), choosed.length);
                let new_choosed = [...copy_choosed_1, '', event_for_pick, '', ...copy_choosed_2];
                setChoose(new_choosed);
            }else{
                let idx_to_left = our_idx-1;
                let idx_to_right = our_idx+1;
                console.log("ошибка");
                setCntWrongs(cntWrongs+1);

                left_idx = choosed.indexOf(corrAllEvents[idx_to_left]["name"]);
                while (left_idx === -1){
                    idx_to_left -= 1;
                    left_idx = choosed.indexOf(corrAllEvents[idx_to_left]["name"]);
                }
                
                right_idx = choosed.indexOf(corrAllEvents[idx_to_right]["name"]);
                while (right_idx === -1){
                    idx_to_right += 1;
                    right_idx = choosed.indexOf(corrAllEvents[idx_to_right]["name"]);
                }

                let copy_choosed_1 = choosed.slice(0, left_idx+1);
                let copy_choosed_2 = choosed.slice(right_idx, choosed.length);
                let new_choosed = [...copy_choosed_1, '', event_for_pick, '', ...copy_choosed_2];
                setChoose(new_choosed);
            }
            setChosenId(-1);
            setChooseFlag(0);
            setPickedId(pickedId+1);
            setMiniTitle("Описание прошлого события:");
            setDescrResult(allEvents[pickedId]?.description || "Описание события недоступно");
        }else{
            setChooseFlag(0);
        }
        
    }, [chooseFlag]);

    return (
        <table className={styles.tests_table}>
            <tbody>
                <tr>
                    <td>
                        <Block_base_event name={startEvent["name"]} description={startEvent["description"]}/>
                        <Block_base_event name={middleEvent["name"]} description={middleEvent["description"]}/>
                        <Block_base_event name={endEvent["name"]} description={endEvent["description"]}/>
                    </td>
                    <td>
                        <Block_rules result={result} miniTitle={miniTitle} descrResult={descrResult} />
                        <Block_event_for_choose name={allEvents[pickedId]?.name || "Название события недоступно"} />
                        <Save_btn setChooseFlag={setChooseFlag} result={result}/>
                    </td>
                    <td>
                        <Events_list eventsList={eventsList}/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

const Page_text = ({name, author}) => {
    return (
        <div className={styles.page_text}>
            <h1>{name}</h1>
            <h2>Автор: {author}</h2>
        </div>
    )
}

export const Main = () => {
    const [nameTest, setNameTest] = useState('');
    const [authorTest, setAuthorTest] = useState('');

    const [startEvent, setStartEvent] = useState({});
    const [middleEvent, setMiddleEvent] = useState({});
    const [endEvent, setEndEvent] = useState({});
    const [allEvents, setAllEvents] = useState([]);

    const [pickedId, setPickedId] = useState(0);

    const [corrAllEvents, setCorrAllEvents] = useState([]);

    const [cntWrongs, setCntWrongs] = useState(0);

    const [choosed, setChoose] = useState([]);

    const [miniTitle, setMiniTitle] = useState('Правила теста');
    const [result, setResult] = useState(-1);
    const [descrResult, setDescrResult] = useState('В данном формате теста у Вас есть 3 события. Информация о них расположена слева. Ваша задача - выбрать верный промежуток между событиями, в который по Вашему мнению подойдет событие снизу. Удачи.');

    const [finishFlag, setFinishFlag] = useState(0);

    const [eventsList, setEventsList] = useState([]);
    const [chosenId, setChosenId] = useState(-1);

    const params = useParams();
    const testId = String(params?.id);

    const [firstRender, setFirstRender] = useState(1);

    const [chooseFlag, setChooseFlag] = useState(0);

    const handleGetTest = async () => {
        try{
            const response = await axiosInstance.get('/test/'+testId);
            if (response.status === 200){
                setNameTest(response.data["title"]);
                setAuthorTest(response.data["author_name"]);
                setStartEvent(response.data["start_event"]);
                setMiddleEvent(response.data["middle_event"]);
                setEndEvent(response.data["end_event"]);
                setAllEvents([...response.data["events_list"], {
                    "name": "Вы прошли тест :)",
                    "description": ""
                }]);
                setCorrAllEvents(response.data["correct_events_list"]);
                setEventsList([
                    <Block_picked_event name={response.data["start_event"]["name"]} />,
                    <Block_for_pick id={1} chosenId={chosenId} setChosenId={setChosenId} />,
                    <Block_picked_event name={response.data["middle_event"]["name"]} />,
                    <Block_for_pick id={3} chosenId={chosenId} setChosenId={setChosenId} />,
                    <Block_picked_event name={response.data["end_event"]["name"]} />
                ]);
                setChoose([
                    response.data["start_event"]["name"], '' ,response.data["middle_event"]["name"], '',
                    response.data["end_event"]["name"]
                ]);
                
            }else{
                toast.error('Что-то не так');
            }
        }catch (error){
            if (axios.isAxiosError(error) && error.response){
                if (error.response.status === 401){
                    const router = useRouter();
                    router.push('/authorization');
                }else{
                    toast.error('Что-то пошло не так :(');
                }
            }else{
                toast.error("Сетевая ошибка");
            }
        }
    }

    const handlePostTest = async () => {
        try{
            const response = await axiosInstance.post('/test/'+testId, {
            "test_id": Number(testId),
            "title": nameTest,
            "type": "Timeline",
            "author_name": authorTest,
            "event_name": '',
            "event_description": '',
            "correct_answers_lst": [],
            "incorrect_answers_lst": [],
            "events_list": corrAllEvents,
            "cnt_wrongs": cntWrongs,
            "question_lst": []
        });
            if (response.status === 200){
                setMiniTitle("Тест завершен");
                setResult(response.data["result"]);
                setDescrResult('Ваш результат: '+String(response.data["result"])+'%');
            }else{
                toast.error('Что-то не так')
            }
        }catch (error){
            if (axios.isAxiosError(error) && error.response){
                if (error.response.status === 401){
                    const router = useRouter();
                    router.push('/authorization');
                }else{
                    toast.error('Что-то пошло не так :(');
                }
            }else{
                toast.error("Сетевая ошибка");
            }
        }
    }

    useEffect(()=>{
        if (firstRender === 1){
            handleGetTest();
            setFirstRender(0);
        }else{
            const event_lst = [];

            for(let i=0; i<choosed.length; i++){
                if(choosed[i]===''){
                    event_lst.push(<Block_for_pick id={i} chosenId={chosenId} setChosenId={setChosenId} />)
                }else{
                    event_lst.push(<Block_picked_event name={choosed[i]} />)
                }
            }

            setEventsList(event_lst)
        }
    }, [chosenId]);

    useEffect(()=>{
        if(chooseFlag === 1 && pickedId === (corrAllEvents.length-4)){
            handlePostTest();
        }
    }, [chooseFlag])


    return (
        <main>
            <Page_text name={nameTest} author={authorTest}/>
            <Test_table startEvent={startEvent} middleEvent={middleEvent} endEvent={endEvent} pickedId={pickedId}
            allEvents={allEvents} corrAllEvents={corrAllEvents} miniTitle={miniTitle} setMiniTitle={setMiniTitle}
            descrResult={descrResult} setDescrResult={setDescrResult} result={result} cntWrongs={cntWrongs} 
            setCntWrongs={setCntWrongs} choosed={choosed} setChoose={setChoose} chosenId={chosenId} 
            setChosenId={setChosenId} eventsList={eventsList} chooseFlag={chooseFlag} setChooseFlag={setChooseFlag} 
            setPickedId={setPickedId}/>
        </main>
    )
}