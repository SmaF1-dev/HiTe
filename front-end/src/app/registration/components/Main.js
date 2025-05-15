'use client'
import Link from "next/link"
import styles from "./main.module.scss"
import axiosInstance from '@/app/lib/axios';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from "react"

const Auth_form = () => {

    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [secondname, setSecondname] = useState('');
    const [date, setDate] = useState('');
    const [education, setEducation] = useState('');
    const [password, setPassword] = useState('');

    const changeEmail = (e) => {
        setEmail(e.target.value);
    }

    const changeFirstname = (e) => {
        setFirstname(e.target.value);
    }

    const changeLastname = (e) => {
        setLastname(e.target.value);
    }

    const changeSecondname = (e) => {
        setSecondname(e.target.value);
    }

    const changeDate = (e) => {
        setDate(e.target.value);
    }

    const changeEducation = (e) => {
        setEducation(e.target.value);
    }

    const changePassword = (e) => {
        setPassword(e.target.value);
    }

     const handleRegister = async () => {

            if (email !== '' && firstname !== '' && lastname !== '' && education !== '' && password !== '' && date !== ''){
            
                try {
                    const response = await axiosInstance.post('/register', {
                        email: email,
                        password: password,
                        first_name: firstname,
                        last_name: lastname,
                        middle_name: secondname,
                        birth_date: date,
                        education: education
                    });

                    if (response.status === 200) {
                        toast.success('Регистрация прошла успешно!');
                        setDate('');
                        setEducation('');
                        setEmail('');
                        setFirstname('');
                        setLastname('');
                        setPassword('');
                        setSecondname('');

                    } else {
                        toast.error('Что-то пошло не так.');
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        if (error.response.status == 409){
                            toast.error('Пользователь с таким email уже существует');
                        }
                        else{
                            toast.error(`Ошибка: ${error.response.data.message || 'Регистрация не удалась'}`);
                        }
                    } else {
                        toast.error('Сетевая ошибка');
                    }
                }
            }else{
                toast.error('Не все обязательные поля заполены!')
            }
        };



    return (
        <div className={styles.auth_form}>
            <h2>Форма регистрации</h2>
            <form>
                <input type="text" id="email" value={email} name="email" required onChange={changeEmail} placeholder="Почта*"></input>
                <input type="text" id="firstname" value={firstname} name="firstname" required onChange={changeFirstname} placeholder="Имя*"></input>
                <input type="text" id="lastname" value={lastname} name="lastname" required onChange={changeLastname} placeholder="Фамилия*"></input>
                <input type="text" id="secondname" value={secondname} name="secondname" onChange={changeSecondname} placeholder="Отчество (при наличии)"></input>
                <input type="date" id="date" value={date} name="date" required onChange={changeDate} placeholder="Дата рождения в формате dd.mm.yyyy*"></input>
                <input type="text" id="education" value={education} name="education" required onChange={changeEducation} placeholder="Образовательная организация*"></input>
                <input type="text" id="password" value={password} name="password" required onChange={changePassword} placeholder="Пароль*"></input>
                <button type="button" onClick={handleRegister}>Сохранить</button>
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