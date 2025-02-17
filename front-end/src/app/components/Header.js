import Link from "next/link"
import styles from "./header.module.scss"

const Navigate_elem = ({src, name, style}) => {
    return (
        <div className={style}>
            <Link href={src}>
                <h2>{name}</h2>
            </Link>
        </div>
    )
}

const Navigate_table = () => {
    return (
        <table className={styles.nav_tble}>
            <thead>
                <tr>
                    <th>
                        <Navigate_elem src={'/'} name={'К тестам'} style={styles.nav_elem_selected}/>
                    </th>
                    <th>
                        <Navigate_elem src={'/'} name={'Мои тесты'} style={styles.nav_elem}/>
                    </th>
                    <th>
                        <Navigate_elem src={'/'} name={'Личный кабинет'} style={styles.nav_elem}/>
                    </th>
                </tr>
            </thead>
        </table>
    )
}

const Navigate_text = ({src, name}) => {
    return (
        <div className={styles.nav_main_elem}>
            <Link href={src}>
                <h1>{name}</h1>
            </Link>
        </div>
    )
}

const Navigate = () => {
    return (
        <div className={styles.nav}>
            <Navigate_text src={'/'} name={'HiTe'}/>
            <Navigate_table />
        </div>
    )
}

const Page_text = ({name}) => {
    return (
        <div className={styles.page_text}>
            <h1>{name}</h1>
        </div>
    )
}

export const Header = () => {
    return (
        <>
            <Navigate />
            <Page_text name={"Historical tests"}/>
        </>
    )
}