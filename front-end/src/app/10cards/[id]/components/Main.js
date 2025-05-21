'use client'
import styles from "./main.module.scss"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import axiosInstance from '@/app/lib/axios'
import { useParams, useRouter } from "next/navigation"

const update_choose = ({name, choosed, setChoose, unchoosed, setUnchoosed}) => {
    const copy_lst = choosed.map((elem)=>elem);
    const copy_lst_unchoosed = unchoosed.map((elem)=>elem);
    if (choosed.includes(name)){
        let idx = choosed.indexOf(name);
        copy_lst.splice(idx, 1);
        copy_lst_unchoosed.push(name);
    }
    else{
        copy_lst.push(name);
        let idx = copy_lst_unchoosed.indexOf(name);
        copy_lst_unchoosed.splice(idx, 1);
    }
    setChoose(copy_lst);
    setUnchoosed(copy_lst_unchoosed);
}

const Page_text = ({name, author}) => {
    return (
        <div className={styles.page_text}>
            <h1>{name}</h1>
            <h2>Автор: {author}</h2>
        </div>
    )
}

const BigEvent = ({event_name, result, descrResult}) => {
    const [styleBlock, setStyleBlock] = useState(styles.big_event_block);
    useEffect(()=>{
        if(result >= 75){
            setStyleBlock(styles.finish_block_gr);
        }else if(result >= 50){
            setStyleBlock(styles.finish_block_ye);
        }else if (result >= 0){
            setStyleBlock(styles.finish_block_re);
        }else{
            setStyleBlock(styles.big_event_block);
        }
    }, [result])
    return (
        <div className={styleBlock}>
            <h2>{event_name}</h2>
            <h3>{descrResult}</h3>
        </div>
    )
}

const RulesBlock = ({miniTitle, description}) => {
    return (
        <div className={styles.rules_block}>
            <h2>{miniTitle}</h2>
            <p>{description}</p>
        </div>
    )
}

const Event_for_pick = ({name, choosed, setChoose, unchoosed, setUnchoosed}) => {
    const [style_block, setStyle] = useState(styles.block_for_pick);

    useEffect(() => {
        if (choosed.includes(name)) {
            setStyle(styles.block_picked);
        } else {
            setStyle(styles.block_for_pick);
        }
    }, [choosed]);

    return (
        <div className={style_block}>
            <button onClick={() => {update_choose({name, choosed, setChoose, unchoosed, setUnchoosed})}}>
                <h2>{name}</h2>
            </button>
        </div>
    )
}

const Interactive_block = ({events, choosed, setChoose, setUnchoosed, unchoosed, setFinishFlag}) => {
    const events_1 = [];
    const events_2 = [];

    const middle_lst = events.length / 2;

    const [styleBtn, setStyleBtn] = useState(styles.save_block);

    for(let i=0; i<events.length; i++){
        if (i <= middle_lst){
            events_1.push(
                <Event_for_pick name={events[i]} key={i} choosed={choosed} setChoose={setChoose} 
                setUnchoosed={setUnchoosed} unchoosed={unchoosed}/>
            )
        }else{
            events_2.push(
                <Event_for_pick name={events[i]} key={i} choosed={choosed} setChoose={setChoose} 
                setUnchoosed={setUnchoosed} unchoosed={unchoosed}/>
            )
        }
    }

    return (
        <div className={styles.right_block}>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <div className={styles.column_events}>
                                {events_2}
                            </div>
                        </td>
                        <td>
                            <div className={styles.column_events}>
                                {events_1}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className={styleBtn}>
                <button onClick={() => { setFinishFlag(1); setStyleBtn(styles.save_block_final)}}>
                    Подтвердить
                </button>
            </div>
        </div>
    )
}

const Test_table = ({bigEvent, eventsList, choosed, setChoose, unchoosed, setUnchoosed, miniTitle, result, descrResult, setFinishFlag, description}) => {

    return (
        <table className={styles.tests_table}>
            <tbody>
                <tr>
                    <td>
                        <div className={styles.left_block}>
                            <BigEvent event_name={bigEvent} result={result} descrResult={descrResult}/>
                            <RulesBlock miniTitle={miniTitle} description={description}/>
                        </div>
                    </td>
                    <td>
                        <div className={styles.right_block}>
                            <Interactive_block choosed={choosed} setChoose={setChoose} events={eventsList}
                            unchoosed={unchoosed} setUnchoosed={setUnchoosed} setFinishFlag={setFinishFlag}/>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export const Main = () => {
    const [nameTest, setNameTest] = useState('');
    const [authorTest, setAuthorTest] = useState('');

    const [bigEvent, setBigEvent] = useState('');
    const [eventsList, setEventsList] = useState([]);

    const [choosed, setChoose] = useState([]);
    const [unchoosed, setUnchoosed] = useState([]);

    const [miniTitle, setMiniTitle] = useState('Правила теста');
    const [description, setDescription] = useState('В данном формате теста у Вас есть 10 событий. Ваша задача - выбрать из них те, которые по Вашему мнению относятся к большому событию, которое указано у Вас в тесте. Удачи.')

    const [result, setResult] = useState(-1);
    const [descrResult, setDescrResult] = useState('');

    const [finishFlag, setFinishFlag] = useState(0);

    const params = useParams();
    const testId = String(params?.id);

    const handleGetTest = async () => {
        try{
            const response = await axiosInstance.get('/test/'+testId);
            if (response.status === 200){
                setNameTest(response.data["title"]);
                setAuthorTest(response.data["author_name"]);
                setBigEvent(response.data["event_name"]);
                setEventsList(response.data["answers_lst"]);
                setUnchoosed(response.data["answers_lst"]);
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

    const handlePostTest = async () => {
        try{
            const response = await axiosInstance.post('/test/'+testId, {
            "test_id": Number(testId),
            "title": nameTest,
            "type": "10cards",
            "author_name": authorTest,
            "event_name": bigEvent,
            "event_description": '',
            "correct_answers_lst": choosed,
            "incorrect_answers_lst": unchoosed,
            "events_list": [],
            "cnt_wrongs": 0,
            "question_lst": []
        });
            if (response.status === 200){
                setBigEvent('Тест завершен');
                setDescription(response.data["event_description"]);
                setMiniTitle("Правильный ответ:");
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
        handleGetTest();
    }, [true]);

    useEffect(()=>{
        if(finishFlag === 1){
            handlePostTest();
        }
    }, [finishFlag])

    return (
        <main>
            <Page_text name={nameTest} author={authorTest}/>
            <Test_table bigEvent={bigEvent} eventsList={eventsList} setChoose={setChoose} choosed={choosed}
            unchoosed={unchoosed} setUnchoosed={setUnchoosed} miniTitle={miniTitle} description={description}
            result={result} descrResult={descrResult} setFinishFlag={setFinishFlag}/>
        </main>
    )
}