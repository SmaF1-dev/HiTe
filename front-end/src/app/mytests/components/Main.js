import Link from "next/link"
import styles from "./main.module.scss"

const Create_panel = () => {
    return (
        <div className={styles.create_panel}>
            <h1>Создать новый тест:</h1>
            <div className={styles.block_btn}>
                <a href={"/create10cards"}>
                    <button>10 cards</button>
                </a>
                <a href={"/createtimeline"}>
                    <button>Timeline</button>
                </a>
                <a href={"/createdefault"}>
                    <button>Default</button>
                </a>
            </div>
        </div>
    )
}

const Block_with_test = ({name, type, src}) => {
    return (
        <div className={styles.test_block}>
            <h2>{name}</h2>
            <h3>Тип теста: {type}</h3>
            <Link href={src}>
                <div className={styles.test_link}>
                    <h1>&gt;</h1>
                </div>
            </Link>
        </div>
    )
}

const All_tests = () => {
    return (
        <table className={styles.tests_table}>
            <tbody>
                <tr>
                    <td>
                        <Block_with_test name="Распад СССР" type="Timeline" src="./"/>
                    </td>
                    <td>
                        <Block_with_test name="Первая мировая война" type="10 cards" src="./"/>
                    </td>
                    <td>
                        <Block_with_test name="Древняя русь" type="Timeline" src="./"/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export const Main = () => {
    return (
        <main>
            <Create_panel />
            <All_tests />
        </main>
    )
}