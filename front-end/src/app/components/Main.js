'use client'
import Link from "next/link"
import styles from "./main.module.scss"
import { toast } from "react-toastify"
import axios from "axios"
import axiosInstance from '@/app/lib/axios'
import { useEffect, useState } from "react"

const Search_block = ({paramSearch, setParamSearch, setSearchFlag}) => {
    const handleChangeSearch = (e) => {
        setParamSearch(e.target.value);
    }

    return (
        <div className={styles.search_form}>
            <form>
                <input type="text" id="searchname" name="searchname" value={paramSearch} onChange={handleChangeSearch} placeholder="Название теста..."></input>
                <button type="button" onClick={()=>{setSearchFlag(1)}}>Поиск</button>
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

const All_tests = ({listTests_1, listTests_2, listTests_3}) => {
    return (
        <table className={styles.tests_table}>
            <tbody>
                <tr>
                    <td>
                        {listTests_1}
                    </td>
                    <td>
                        {listTests_2}
                    </td>
                    <td>
                        {listTests_3}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export const Main = () => {
    const [paramSearch, setParamSearch] = useState('');

    const [listTests_1, setListTests_1] = useState([]);
    const [listTests_2, setListTests_2] = useState([]);
    const [listTests_3, setListTests_3] = useState([]);

    const [searchFlag, setSearchFlag] = useState(0);

    const [allTests, setAllTests] = useState([]);

    const handleGetAllTests = async () => {
        try{
            const response = await axiosInstance.get('/all_tests');
            
            if (response.status === 200){
                const tests_1 = [];
                const tests_2 = [];
                const tests_3 = [];
                setAllTests(response.data);
                for (let i=0; i<response.data.length; i++){
                    let pathForAdd = '/' + response.data[i]["type"].toLowerCase() + '/' + String(response.data[i]["id"]);
                    if (i%3===0){
                        tests_1.push(<Block_with_test name={response.data[i]["title"]} type={response.data[i]["type"]} 
                            src={pathForAdd} key={i} author={response.data[i]["author_name"]}/>);
                    }else if (i%3===1){
                        tests_2.push(<Block_with_test name={response.data[i]["title"]} type={response.data[i]["type"]} 
                            src={pathForAdd} key={i} author={response.data[i]["author_name"]}/>);
                    }
                    else{
                        tests_3.push(<Block_with_test name={response.data[i]["title"]} type={response.data[i]["type"]} 
                            src={pathForAdd} key={i} author={response.data[i]["author_name"]}/>);
                    }
                }
                setListTests_1(tests_1);
                setListTests_2(tests_2);
                setListTests_3(tests_3);
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
                toast.error("Сетевая ошибка")
            }
        }
    }

    useEffect(()=>{
        handleGetAllTests();
    }, [true])

    useEffect(()=>{
        if (searchFlag==1){
            setSearchFlag(0);
            const tests_1 = [];
            const tests_2 = [];
            const tests_3 = [];
            for (let i=0; i<allTests.length; i++){
                if (allTests[i]["title"].toLowerCase().includes(paramSearch)){
                    let pathForAdd = '/' + allTests[i]["type"].toLowerCase() + '/' + String(allTests[i]["id"]);
                    if (i%3===0){
                        tests_1.push(<Block_with_test name={allTests[i]["title"]} type={allTests[i]["type"]} 
                            src={pathForAdd} key={i} author={allTests[i]["author_name"]}/>);
                    }else if (i%3===1){
                        tests_2.push(<Block_with_test name={allTests[i]["title"]} type={allTests[i]["type"]} 
                            src={pathForAdd} key={i} author={allTests[i]["author_name"]}/>);
                    }
                    else{
                        tests_3.push(<Block_with_test name={allTests[i]["title"]} type={allTests[i]["type"]} 
                            src={pathForAdd} key={i} author={allTests[i]["author_name"]}/>);
                    }
                }
            }
            setListTests_1(tests_1);
            setListTests_2(tests_2);
            setListTests_3(tests_3);
        }
    }, [searchFlag])

    return (
        <main>
            <Search_block paramSearch={paramSearch} setParamSearch={setParamSearch} setSearchFlag={setSearchFlag}/>
            <All_tests listTests_1={listTests_1} listTests_2={listTests_2} listTests_3={listTests_3} />
        </main>
    )
}