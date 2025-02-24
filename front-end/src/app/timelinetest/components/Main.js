'use client'
import Link from "next/link"
import styles from "./main.module.scss"
import { useEffect, useState } from "react"

const Block_base_event = ({name, description}) => {
    return (
        <div className={styles.base_event_block}>
            <h2>{name}</h2>
            <p>{description}</p>
        </div>
    )
}

const Block_rules = () => {
    return (
        <div className={styles.rules_block}>
            <h2>Правила теста</h2>
            <p>В данном формате теста у Вас есть 3 события. Информация о них расположена слева. 
            Ваша задача - выбрать верный промежуток между событиями, в который по Вашему мнению подойдет событие снизу.
            Удачи.</p>
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

const Block_for_pick = ({choosed_id, id}) => {

    let [style_block, setStyle] = useState(styles.block_for_pick);
    let [new_id, setId] = useState(choosed_id);

    // if(choosed_id!=id){
    //     setStyle(styles.block_for_pick);
    // }else{
    //     setStyle(styles.block_for_pick);
    // }

    useEffect(() => {
        localStorage.setItem('choosed_id', id);
        setId(id);
    }, [style_block]);

    return (
        <div className={style_block}>
            <button onClick={()=>{setStyle(styles.block_picked)}}>
                {new_id}
            </button>
        </div>
    )
}

const Events_list = () => {

    if (localStorage.getItem('choosed_id') == null){
        localStorage.setItem('choosed_id', -1);
    }
    
    let choosed_id = localStorage.getItem('choosed_id')

    const events_lst = [
        <Block_picked_event name={"Событие 1"} />,
        <Block_for_pick id={1} choosed_id={choosed_id}/>,
        <Block_picked_event name={"Событие 2"} />,
        <Block_for_pick id={3} choosed_id={choosed_id}/>,
        <Block_picked_event name={"Событие 3"} />
    ]

    return events_lst
}

const Save_btn = () => {
    return (
        <div className={styles.save_block}>
            <button>
                <h2>Выбрать</h2>
            </button>
        </div>
    )
}

const Test_table = () => {
    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <Block_base_event name={"Событие 1"} description={"Описание события"}/>
                        <Block_base_event name={"Событие 2"} description={"Описание события"}/>
                        <Block_base_event name={"Событие 3"} description={"Описание события"}/>
                    </td>
                    <td>
                        <Block_rules />
                        <Block_event_for_choose name={"Выбранное событие"} />
                        <Save_btn />
                    </td>
                    <td>
                        <Events_list />
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
    return (
        <main>
            <Page_text name={"Распад СССР"} author={"Пригодич Никита Дмитриевич"}/>
            <Test_table />
        </main>
    )
}