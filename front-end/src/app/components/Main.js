import Link from "next/link"
import styles from "./main.module.scss"

const Search_block = () => {
    return (
        <div className={styles.search_form}>
            <form>
                <input type="text" id="searchname" name="searchname" placeholder="Название теста..."></input>
                <button type="submit">Поиск</button>
            </form>
        </div>
    )
}

const Block_with_test = ({name, author, type, src}) => {
    return (
        <div className={styles.test_block}>
            <h2>{name}</h2>
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

const All_tests = () => {
    return (
        <table className={styles.tests_table}>
            <tbody>
                <tr>
                    <td>
                        <Block_with_test name="Распад СССР" author="Пригодич Никита Дмитриевич" type="Timeline" src="./timelinetest"/>
                    </td>
                    <td>
                        <Block_with_test name="Первая мировая война" author="Пригодич Никита Дмитриевич" type="10 cards" src="./"/>
                    </td>
                    <td>
                        <Block_with_test name="Древняя русь" author="Пригодич Никита Дмитриевич" type="Timeline" src="./"/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export const Main = () => {
    return (
        <main>
            <Search_block />
            <All_tests />
        </main>
    )
}