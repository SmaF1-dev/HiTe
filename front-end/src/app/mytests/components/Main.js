'use client'
import Link from "next/link"
import styles from "./main.module.scss"
import axios from "axios"
import axiosInstance from '@/app/lib/axios'
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

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
    const [myTestsList_1, setMyTestsList_1] = useState([]);
    const [myTestsList_2, setMyTestsList_2] = useState([]);
    const [myTestsList_3, setMyTestsList_3] = useState([]);

    const handleGetMyTests = async () => {
        try{
            const tests_1 = [];
            const tests_2 = [];
            const tests_3 = [];
            const response = await axiosInstance.get('/my_tests', {});
            if (response.status === 200){
                for (let i=0; i<response.data.length; i++){
                    let pathForAdd = '/edit' + response.data[i]["type"].toLowerCase() + '/' + String(response.data[i]["id"]);
                    if (i%3===0){
                        tests_1.push(<Block_with_test name={response.data[i]["title"]} type={response.data[i]["type"]} 
                            src={pathForAdd} key={i}/>);
                    }else if (i%3===1){
                        tests_2.push(<Block_with_test name={response.data[i]["title"]} type={response.data[i]["type"]} 
                            src={pathForAdd} key={i}/>);
                    }
                    else{
                        tests_3.push(<Block_with_test name={response.data[i]["title"]} type={response.data[i]["type"]} 
                            src={pathForAdd} key={i}/>);
                    }
                }
                setMyTestsList_1(tests_1);
                setMyTestsList_2(tests_2);
                setMyTestsList_3(tests_3);
            }else{
                toast.error("Что-то не так");
            }
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
        handleGetMyTests();
    }, [true]);

    return (
        <table className={styles.tests_table}>
            <tbody>
                <tr>
                    <td>
                        {myTestsList_1}
                    </td>
                    <td>
                        {myTestsList_2}
                    </td>
                    <td>
                        {myTestsList_3}
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