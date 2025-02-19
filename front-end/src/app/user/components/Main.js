import Link from "next/link"
import styles from "./main.module.scss"

const UserInfo = ({fullname, organization, date}) => {
    return (
        <div className={styles.info_block}>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <di className={styles.user_img}>
                                <img src="/user.png"/>
                            </di>
                        </td>
                        <td>
                            <div className={styles.user_info}>
                                <h2>{fullname}</h2>
                                <h3>{organization}</h3>
                                <h3>{date}</h3>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button>Выйти</button>
        </div>
    )
}

const Result_Test = ({name, author, score, type, src}) => {
    let box_clr = null
    if (score>=80) {
        box_clr = styles.green_result
    }else if (score >= 60) {
        box_clr = styles.yellow_result
    }else {
        box_clr = styles.red_result
    }
    return (
        <div className={box_clr}>
            <div className={styles.tble_result}>
                <h2>{name}</h2>
                <h1>{score}%</h1>
            </div>
            <h3>Автор: {author}</h3>
            <h3>Тип теста: {type}</h3>
            <Link href={src}>
                <div className={styles.test_link}>
                    <h1>&gt;</h1>
                </div>
            </Link>
        </div>
    )
}

export const Main = () => {
    return (
        <main>
            <UserInfo fullname="Лютый Никита Артемович" organization="Университет ИТМО" date="03.10.2006"/>
            <Result_Test name="Распад СССР" author="Пригодич Никита Дмитриевич" score={90} type="Timeline" src="/" />
            <Result_Test name="Вторая мировая война" author="Пригодич Никита Дмитриевич" score={70} type="Timeline" src="/" />
        </main>
    )
}