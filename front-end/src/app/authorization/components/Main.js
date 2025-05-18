'use client';
import { useRouter } from 'next/navigation';
import Link from "next/link"
import styles from "./main.module.scss"
import axios from "axios";
import axiosInstance from "@/app/lib/axios"
import { toast } from "react-toastify";
import { useState } from 'react';

const Auth_form = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const changeEmail = (e) => {
        setEmail(e.target.value);
    }

    const changePassword = (e) => {
        setPassword(e.target.value)
    }

    const router = useRouter();


    const handle_auth = async () => {
        if (password !== '' && email !== ''){
            try{
                const response = await axiosInstance.post("/login",{
                    email: email,
                    password: password
                })

                if (response.status === 200){
                    toast.success("Добро пожаловать!")
                    localStorage.setItem('token', response.data["access_token"])

                    setEmail('');
                    setPassword('');
                    router.push("/user")
                } else{
                    toast.error("Что-то пошло не так.")
                }
            }catch (error){
                if (axios.isAxiosError(error) && error.response){
                    if (error.response.status === 401){
                        toast.error("Неправильная почта или пароль");
                    }else{
                        toast.error(`Ошибка: ${error.response.data.message || 'Авторизация не удалась'}`)
                    }
                }else {
                    toast.error('Сетевая ошибка');
                }
            }
        }else{
            toast.error('Не все обязательные поля заполены!')
        }
    }

    return (
        <div className={styles.auth_form}>
            <h2>Форма авторизации</h2>
            <form>
                <input type="text" id="email" name="email" value={email} onChange={changeEmail} placeholder="Почта..."></input>
                <input type="password" id="password" name="password" value={password} onChange={changePassword} placeholder="Пароль..."></input>
                <button type="button" onClick={handle_auth}>Войти</button>
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