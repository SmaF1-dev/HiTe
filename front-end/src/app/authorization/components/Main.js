import Link from "next/link"
import styles from "./main.module.scss"

const Auth_form = () => {
    return (
        <div className={styles.auth_form}>
            <h2>Форма авторизации</h2>
            <form>
                <input type="text" id="email" name="email" placeholder="Почта..."></input>
                <input type="text" id="password" name="password" placeholder="Пароль..."></input>
                <Link href="/user">
                    <button type="submit">Войти</button>
                </Link>
            </form>
        </div>
    )
}

const Block_to_signup = () => {
    return (
        <div className={styles.block_link}>
            <h2>Регистрация</h2>
            <br/>
            <br/>
            <Link href="/registration">
                <div className={styles.need_link}>
                    <h1>&gt;</h1>
                </div>
            </Link>
        </div>
    )
}

const Block_info = () => {
    return (
        <div className={styles.info_block}>
            <h2>HiTe</h2>
            <p>Historical Tests - платформа с интерактивными тестами, где Вы сможете изучить историю или 
                проверить свои знания в ней. На сайте присутствуют тесты как привычного формата, так и необычного, 
                в которых придется применить интуицию, но зато в процессе Вы будете получать знания о событиях. 
            Удачи!</p>
        </div>
    )
}

export const Main = () => {
    return (
        <main>
            <table className={styles.big_table}>
                <tbody>
                    <tr>
                        <td><Auth_form /></td>
                        <td>
                            <Block_info />
                            <Block_to_signup />
                        </td>
                    </tr>
                </tbody>
            </table>
        </main>
    )
}