import Link from "next/link"
import styles from "./header.module.scss"

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
            <Page_text name={"Регистрация"}/>
        </>
    )
}