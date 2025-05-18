'use client'
import Link from "next/link"
import styles from "./main.module.scss"
import axiosInstance from '@/app/lib/axios'
import axios from "axios"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const UserInfo = ({fullname, organization, date}) => {
    return (
        <div className={styles.info_block}>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <div className={styles.user_img}>
                                <img src="/user.png"/>
                            </div>
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
            <Link href="/authorization">
                <button onClick={()=>{localStorage.setItem('token', '')}}>Выйти</button>
            </Link>
        </div>
    )
}

const Result_Test = ({name, author, score, type}) => {
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
            <br/>   
        </div>
    )
}

export const Main = () => {

    const [name, setName] = useState('');
    const [organization, setOriganization] = useState('');
    const [date, setDate] = useState('');

    const [listRenderTests, setListRenderTests] = useState([]);

    const router = useRouter();

    const get_info = async () => {
        try{
            let token = localStorage.getItem('token');

            const response_about = await axiosInstance.get('/aboutme', {})

            const response_tests = await axiosInstance.get('/passed_tests', {})

            setName(response_about.data["name"]);
            setOriganization(response_about.data["education"]);
            setDate(response_about.data["birth_date"]);

            const copy_render_list = listRenderTests.map((elem) => elem);
            for (let i=0; i<response_tests.data.length; i++){
                copy_render_list.push(
                    <Result_Test name={response_tests.data[i]["title"]} author={response_tests.data[i]["author_name"]} 
                    score={response_tests.data[i]["result"]}
                    type={response_tests.data[i]["type"]} key={i}/>
                )
            }
            setListRenderTests(copy_render_list);


        }catch (error){
            if (axios.isAxiosError(error) && error.response){
                if (error.response.status === 401){
                    router.push('/authorization')
                    toast.error("Вы не авторизованы!")
                }else{
                    toast.error("Что-то не так.")
                }
            }else{
                toast.error("Сетевая ошибка'")
            }
        }
    }

    useEffect(()=>{
        get_info();
    }, [true])

    return (
        <main>
            <UserInfo fullname={name} organization={organization} date={date}/>
            {listRenderTests}
        </main>
    )
}