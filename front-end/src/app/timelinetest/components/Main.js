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
            <button onClick={() => setChosenId(id)}>
                {id}
            </button>
        </div>
    );
}

const Events_list = () => {
    const [chosenId, setChosenId] = useState(-1);

    useEffect(() => {
        console.log(chosenId)
    }, [chosenId]);

    const events_lst = [
        <Block_picked_event name={"Событие 1"} />,
        <Block_for_pick id={1} chosenId={chosenId} setChosenId={setChosenId} />,
        <Block_picked_event name={"Событие 2"} />,
        <Block_for_pick id={3} chosenId={chosenId} setChosenId={setChosenId} />,
        <Block_picked_event name={"Событие 3"} />
    ];

    return (
        <div>
            {events_lst}
        </div>
    );
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