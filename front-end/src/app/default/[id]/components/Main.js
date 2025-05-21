'use client'
import styles from "./main.module.scss"
import { useEffect, useState } from "react"
import axios from "axios"
import axiosInstance from '@/app/lib/axios'
import { toast } from "react-toastify"
import { useParams, useRouter } from "next/navigation"

const update_choose = (answer, id, choosed, setChoose) => {
    const new_choosed = choosed.map((elem)=>elem);

    if (choosed[id]["correct_answer"] === answer){
        new_choosed[id]["incorrect_answers"].push(new_choosed[id]["correct_answer"]);
        new_choosed[id]["correct_answer"] = "";
        setChoose(new_choosed);
    }else{
        if (new_choosed[id]["correct_answer"] !== ""){
            new_choosed[id]["incorrect_answers"].push(new_choosed[id]["correct_answer"]);
        }
        const idx = new_choosed[id]["incorrect_answers"].indexOf(answer);
        new_choosed[id]["incorrect_answers"].splice(idx, 1);
        new_choosed[id]["correct_answer"] = answer;
    }

    setChoose(new_choosed);
}

const Page_text = ({name, author}) => {
    return (
        <div className={styles.page_text}>
            <h1>{name}</h1>
            <h2>Автор: {author}</h2>
        </div>
    )
}

const RulesBlock = ({miniTitle, descrResult, result}) => {
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

const Finish_button = ({setFinishFlag, result}) => {
    let styleBlock = styles.save_block;
    if (result >= 0){
        styleBlock = styles.no_elem;
    }
    return (
        <div className={styleBlock}>
            <button onClick={() => { setFinishFlag(1); console.log(1); }}>
                Завершить тест
            </button>
        </div>
    )
}

const Button_for_pick = ({id_question, choosed, setChoose, answer}) => {
    const [style_block, setStyle] = useState(styles.block_for_pick);

    useEffect(() => {
        if (choosed[id_question]["correct_answer"] === answer) {
            setStyle(styles.block_picked);
        } else {
            setStyle(styles.block_for_pick);
        }
    }, [choosed]);

    return (
        <div className={style_block}>
            <button onClick={() => {update_choose(answer, id_question, choosed, setChoose)}}>{answer}</button>
        </div>
    )
}

const Question_block = ({question, choosed, setChoose, id}) => {

    return (
        <div className={styles.question_block}>
            <h2>{question["question"]}</h2>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <Button_for_pick id_question={id} choosed={choosed} setChoose={setChoose} answer={question["answers"][0]}/>
                        </td>
                        <td>
                            <Button_for_pick id_question={id} choosed={choosed} setChoose={setChoose} answer={question["answers"][1]}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Button_for_pick id_question={id} choosed={choosed} setChoose={setChoose} answer={question["answers"][2]}/>
                        </td>
                        <td>
                            <Button_for_pick id_question={id} choosed={choosed} setChoose={setChoose} answer={question["answers"][3]}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const Test_Block = ({questions, choosed, setChoose}) => {

    const add_line_2 = (elem1, elem2) => {
        return (
            <tr>
                <td>
                    {elem1}
                </td>
                <td>
                    {elem2}
                </td>
            </tr>
        )
    }
    
    const add_line_1 = (elem) => {
        return (
            <tr>
                <td>
                    {elem}
                </td>
            </tr>
        )
    }

    let block_for_render = [];
    let i = 0;

    while(i<questions.length-1){
        block_for_render.push(add_line_2(<Question_block key={i} question={questions[i]} id={i} choosed={choosed} setChoose={setChoose}/>, <Question_block key={i+1} question={questions[i+1]} id={i+1} choosed={choosed} setChoose={setChoose}/>))
        i = i+2
    }

    if(questions.length % 2 === 1){
        block_for_render.push(add_line_1(<Question_block key={i} question={questions[i]} id={i} choosed={choosed} setChoose={setChoose}/>))
    }

    return (
        <div>
            <table>
                <tbody>
                    {block_for_render}
                </tbody>
            </table>
        </div>
    )
}

const Test_table = ({questionList, choosed, setChoose, miniTitle, descrResult, result, setFinishFlag}) => {

    return (
        <table className={styles.tests_table}>
            <tbody>
                <tr>
                    <td>
                        <div className={styles.left_block}>
                            <RulesBlock miniTitle={miniTitle} descrResult={descrResult} result={result}/>
                            <Finish_button setFinishFlag={setFinishFlag} result={result} />
                        </div>
                    </td>
                    <td>
                        <Test_Block questions={questionList} choosed={choosed} setChoose={setChoose} />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export const Main = () => {
    const [nameTest, setNameTest] = useState('');
    const [authorTest, setAuthorTest] = useState('');

    const [questionList, setQuestionList] = useState([]);

    const [choosed, setChoose] = useState([]);

    const [miniTitle, setMiniTitle] = useState('Правила теста');
    const [result, setResult] = useState(-1);
    const [descrResult, setDescrResult] = useState('В данном формате теста у Вас есть вопросы. На каждый из вопросов есть 4 варианта ответа. Ваша задача - выбрать верный. Удачи.');

    const [finishFlag, setFinishFlag] = useState(0);

    const params = useParams();
    const testId = String(params?.id);

    const handleGetTest = async () => {
        try{
            const response = await axiosInstance.get('/test/'+testId);
            if (response.status === 200){
                setNameTest(response.data["title"]);
                setAuthorTest(response.data["author_name"]);
                setQuestionList(response.data["question_lst"].map((elem)=>elem));
                const choosed_question = [];
                for (let i=0; i<response.data["question_lst"].length; i++){
                    choosed_question.push(
                        {
                            "question": response.data["question_lst"][i]["question"],
                            "correct_answer": "",
                            "incorrect_answers": response.data["question_lst"][i]["answers"].map((elem)=>elem)
                        }
                    )
                }
                setChoose(choosed_question);
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
            "type": "Default",
            "author_name": authorTest,
            "event_name": '',
            "event_description": '',
            "correct_answers_lst": [],
            "incorrect_answers_lst": [],
            "events_list": [],
            "cnt_wrongs": 0,
            "question_lst": choosed
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
        handleGetTest();
    }, [true]);

    useEffect(()=>{
        if(finishFlag === 1){
            let fullForm = 1;
            for (let i=0; i<choosed.length; i++){
                if (choosed[i]["correct_answer"] === ""){
                    fullForm = 0;
                    break;
                }
            }

            if (fullForm === 1){
                handlePostTest();
            }else{
                toast.error("Вы дали ответ не на все вопросы!");
            }
        }
    }, [finishFlag])

    return (
        <main>
            <Page_text name={nameTest} author={authorTest}/>
            <Test_table questionList={questionList} choosed={choosed} setChoose={setChoose} miniTitle={miniTitle} 
            descrResult={descrResult} result={result} setFinishFlag={setFinishFlag}/>
        </main>
    )
}