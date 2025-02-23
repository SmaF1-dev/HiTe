import Link from "next/link"
import styles from "./main.module.scss"

const Auth_form = () => {
    return (
        <div className={styles.auth_form}>
            <h2>Форма регистрации</h2>
            <form>
                <input type="text" id="email" name="email" placeholder="Почта..."></input>
                <input type="text" id="firstname" name="firstname" placeholder="Имя..."></input>
                <input type="text" id="lastname" name="lastname" placeholder="Фамилия..."></input>
                <input type="text" id="secondname" name="secondname" placeholder="Отчество (при наличии)..."></input>
                <input type="date" id="date" name="date" placeholder="Дата рождения в формате dd.mm.yyyy..."></input>
                <input type="text" id="organization" name="organization" placeholder="Образовательная организация..."></input>
                <input type="text" id="password" name="password" placeholder="Пароль..."></input>
                <input type="text" id="password_2" name="password_2" placeholder="Повторите ароль..."></input>
                <Link href="/user">
                    <button type="submit">Сохранить</button>
                </Link>
            </form>
        </div>
    )
}

const Block_to_signup = () => {
    return (
        <div className={styles.block_link}>
            <h2>Вход в аккаунт</h2>
            <br/>
            <br/>
            <Link href="/authorization">
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