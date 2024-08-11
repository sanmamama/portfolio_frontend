
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserDataContext } from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"
const apiUrl = process.env.REACT_APP_API_URL;

const LoginForm = () => {
    const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [formError, setFormError] = useState({
        email: '',
        password: '',
        non_field_errors:''
    });
    const [messages, setMessages] = useState("");
    const [responseData, setResponseData] = useState([]);
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();



    const handleGuestLogin = (e) => {
        e.preventDefault();
        fetch(`${apiUrl}/auth/guest-login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if(response.ok){
                setMessages("ゲストログイン成功")
            }else{
                setMessages("")
            }
            return response.json();
        })
        .then(data => {
            setResponseData(data);

            if(data.key){
                const token = data.key
                document.cookie = `token=${token}; path=/`;
            
            getUserData(setMyUserDataGlobal)
            navigate("/postter/home")

            }else{
                navigate("/postter/login")
            }

        })
        .catch(error => {
            setErrors(error);
            navigate("/postter/login")
        });
    };

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${apiUrl}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if(response.ok){
                setMessages("ログイン成功")
            }else{
                setMessages("")
            }
            return response.json();
        })
        .then(data => {
            setResponseData(data);

            setFormError(() => ({
                'email':'',
                'password':'',
                'non_field_errors':''
            }));

            if(data.email?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    email: data.email[0]
                }));
            }
            if(data.password?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    password: data.password[0]
                }));
            }

            if(data.non_field_errors?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    non_field_errors: data.non_field_errors[0]
                }));
            }

            if(data.key){
                const token = data.key
                document.cookie = `token=${token}; path=/`;
                //document.cookie = `token=${token}; path=/; secure; samesite=None`;
            
            getUserData(setMyUserDataGlobal)
            navigate("/postter/home")
            // const token2 = document.cookie.split('; ').reduce((acc, row) => {
            //     const [key, value] = row.split('=');
            //     if (key === 'token') {
            //     acc = value;
            //     }
            //     return acc;
            // }, null);
            
            // setMessages(token +"ログイン中"+token2)

            }else{
                navigate("/postter/login")
            }
            //console.log(token)
        })
        .catch(error => {
            setErrors(error);
            navigate("/postter/login")
        });
    };

    return (
        <div className="row justify-content-center">
            <div className="col-10">
                <div>
                    <h2>ログイン</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>メールアドレス</label><span className="ml-3 text-danger">{formError.email}</span>
                            <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange}/>    
                            <label>パスワード</label><span className="ml-3 text-danger">{formError.password}</span>
                            <input className="form-control" type="password" name="password" value={formData.password} onChange={handleChange}/>
                        </div>
                        <button className="mt-2 btn btn-outline-primary btn-block" type="submit">送信</button>
                    </form>
                    <p>{messages}</p>
                    <p>{formError.non_field_errors}</p>
                </div>

                <div className="mt-5">
                    <button className="btn btn-primary btn-block" onClick={handleGuestLogin}>ゲストログイン</button>
                </div>
            </div>
            
        </div>
    );
};

export default LoginForm;
