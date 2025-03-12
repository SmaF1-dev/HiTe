'use client'
import Link from "next/link"
import styles from "./main.module.scss"
import { useEffect, useState } from "react"

const update_choose = ({id, choosed_id, setChoose}) => {
    if (choosed_id.includes(id)){
        setChoose(choosed_id.replace(id, ''))
    }
    else{
        setChoose(choosed_id + id)
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

const BigEvent = ({event_name}) => {
    return (
        <div className={styles.big_event_block}>
            <h2>{event_name}</h2>
        </div>
    )
}

const RulesBlock = () => {
    return (
        <div className={styles.rules_block}>
            <h2>Правила теста</h2>
            <p>В данном формате теста у Вас есть 10 событий. 
            Ваша задача - выбрать из них те, которые по Вашему мнению относятся к большому событию, 
            которое указано у Вас в тесте.
            Удачи.</p>
        </div>
    )
}

const Event_for_pick = ({name, id, choosed_id, setChoose}) => {
    const [style_block, setStyle] = useState(styles.block_for_pick);

    useEffect(() => {
        if (choosed_id.includes(id)) {
            setStyle(styles.block_picked);
        } else {
            setStyle(styles.block_for_pick);
        }
    }, [choosed_id, id]);

    return (
        <div className={style_block}>
            <button onClick={() => {update_choose({id, choosed_id, setChoose})}}>
                <h2>{name}</h2>
            </button>
        </div>
    )
}

const Interactive_block = ({events, choosed_id, setChoose}) => {
    return (
        <div className={styles.right_block}>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <Event_for_pick name={events[0]} id={'0'} choosed_id={choosed_id} setChoose={setChoose} />
                            <Event_for_pick name={events[1]} id={'1'} choosed_id={choosed_id} setChoose={setChoose} />
                            <Event_for_pick name={events[2]} id={'2'} choosed_id={choosed_id} setChoose={setChoose} />
                            <Event_for_pick name={events[3]} id={'3'} choosed_id={choosed_id} setChoose={setChoose} />
                            <Event_for_pick name={events[4]} id={'4'} choosed_id={choosed_id} setChoose={setChoose} />
                        </td>
                        <td>
                            <Event_for_pick name={events[5]} id={'5'} choosed_id={choosed_id} setChoose={setChoose} />
                            <Event_for_pick name={events[6]} id={'6'} choosed_id={choosed_id} setChoose={setChoose} />
                            <Event_for_pick name={events[7]} id={'7'} choosed_id={choosed_id} setChoose={setChoose} />
                            <Event_for_pick name={events[8]} id={'8'} choosed_id={choosed_id} setChoose={setChoose} />
                            <Event_for_pick name={events[9]} id={'9'} choosed_id={choosed_id} setChoose={setChoose} />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className={styles.save_block}>
                <button onClick={() => { console.log(choosed_id) }}>
                    Подтвердить
                </button>
            </div>
        </div>
    )
}

const Test_table = () => {
    const [choosed_id, setChoose] = useState('')

    const events = [
        "Событие 1",
        "Событие 2",
        "Событие 3",
        "Событие 4",
        "Событие 5",
        "Событие 6",
        "Событие 7",
        "Событие 8",
        "Событие 9",
        "Событие 10",
    ]

    return (
        <table className={styles.tests_table}>
            <tbody>
                <tr>
                    <td>
                        <div className={styles.left_block}>
                            <BigEvent event_name={"Большое событие"}/>
                            <RulesBlock />
                        </div>
                    </td>
                    <td>
                        <Interactive_block choosed_id={choosed_id} setChoose={setChoose} events={events}/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export const Main = () => {
    return (
        <main>
            <Page_text name={"Первая мировая война"} author={"Пригодич Никита Дмитриевич"}/>
            <Test_table />
        </main>
    )
}