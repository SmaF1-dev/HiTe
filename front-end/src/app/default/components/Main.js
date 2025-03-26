'use client'
import Link from "next/link"
import styles from "./main.module.scss"
import { useEffect, useState } from "react"

const update_choose = (answ, id, choosed_id, setChoose) => {
    if (choosed_id.includes(id)){
        let id_for_del = choosed_id.indexOf(id);
        let part_for_delete = choosed_id.slice(id_for_del, id_for_del+4);
        setChoose(choosed_id.replace(part_for_delete, id+':'+answ+';'))
    }
    else{
        setChoose(choosed_id + id+':'+answ+';')
    }
}

const Page_text = ({name, author}) => {
    return (
        <div className={styles.page_text}>
            <h1>{name}</h1>
            <h2>Автор: {author}</h2>
        </div>
    )
}

const RulesBlock = () => {
    return (
        <div className={styles.rules_block}>
            <h2>Правила теста</h2>
            <p>В данном формате теста у Вас есть вопросы. 
            На каждый из вопросов есть 4 варианта ответа.
            Ваша задача - выбрать верный.
            Удачи.</p>
        </div>
    )
}

const Finish_button = ({choosed_id}) => {
    return (
        <div className={styles.save_block}>
            <button onClick={() => { console.log(choosed_id) }}>
                Завершить тест
            </button>
        </div>
    )
}

const Question_block = ({question, choosed_id, setChoose, id}) => {

    return (
        <div className={styles.question_block}>
            <h2>{question["question"]}</h2>
            <button onClick={() => {update_choose('0', String(id), choosed_id, setChoose)}}>{question["answ"][0]}</button>
            <button onClick={() => {update_choose('1', String(id), choosed_id, setChoose)}}>{question["answ"][1]}</button>
            <button onClick={() => {update_choose('2', String(id), choosed_id, setChoose)}}>{question["answ"][2]}</button>
            <button onClick={() => {update_choose('3', String(id), choosed_id, setChoose)}}>{question["answ"][3]}</button>
        </div>
    )
}

const Test_Block = ({questions, choosed_id, setChoose}) => {

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
        block_for_render.push(add_line_2(<Question_block question={questions[i]} id={i} choosed_id={choosed_id} setChoose={setChoose}/>, <Question_block question={questions[i+1]} id={i+1} choosed_id={choosed_id} setChoose={setChoose}/>))
        i = i+2
    }

    if(questions.length % 2 === 1){
        block_for_render.push(add_line_1(<Question_block question={questions[i]} id={i} choosed_id={choosed_id} setChoose={setChoose}/>))
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

const Test_table = () => {
    const [choosed_id, setChoose] = useState('')

    const questions = [
        {
            'question': "Вопрос 1",
            'answ': ['Ответ 1', 'Ответ 2', 'Ответ 3','Ответ 4']
        },
        {
            'question': "Вопрос 2",
            'answ': ['Ответ 1', 'Ответ 2', 'Ответ 3','Ответ 4']
        },
        {
            'question': "Вопрос 3",
            'answ': ['Ответ 1', 'Ответ 2', 'Ответ 3','Ответ 4']
        },
        {
            'question': "Вопрос 4",
            'answ': ['Ответ 1', 'Ответ 2', 'Ответ 3','Ответ 4']
        },
        {
            'question': "Вопрос 5",
            'answ': ['Ответ 1', 'Ответ 2', 'Ответ 3','Ответ 4']
        }
        
    ]

    return (
        <table className={styles.tests_table}>
            <tbody>
                <tr>
                    <td>
                        <div className={styles.left_block}>
                            <RulesBlock />
                            <Finish_button choosed_id={choosed_id} />
                        </div>
                    </td>
                    <td>
                        <Test_Block questions={questions} choosed_id={choosed_id} setChoose={setChoose} />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export const Main = () => {
    return (
        <main>
            <Page_text name={"Российская империя"} author={"Пригодич Никита Дмитриевич"}/>
            <Test_table />
        </main>
    )
}