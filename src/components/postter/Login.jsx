
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserDataContext } from "./providers/UserDataProvider"

const getUserData = (setEmail) => {
    const token = document.cookie.split('; ').reduce((acc, row) => {
		const [key, value] = row.split('=');
		if (key === 'token') {
		acc = value;
		}
		return acc;
	}, null);
	fetch('http://localhost:8000/api/auth/user/',
		{
		method: 'GET',
		headers: {
			'Authorization': `Token ${token}`,
			},
		})
	.then(response => {
		if(!response.ok){
			//トークンのセッション切れ
			throw new Error();
		}
		return response.json()
		})
	.then(data => {
		//ログインしているとき
		setEmail(data.email)
		})
	.catch(error => {
		//ログインしていないとき
	});
}

const LoginForm = () => {
    const {email,setEmail} = useContext(UserDataContext)
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

    useEffect(() => {
        const handleSetFormData = async () => {
            try{
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await fetch('http://localhost:8000/api/auth/user/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                    });

                if(response.ok){
                    navigate("/postter/")
                }
            }catch(e){
                //クッキーからトークン取得失敗時とトークンのセッション切れはここに来る
            }
        }
        handleSetFormData()
    
        }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        fetch('http://localhost:8000/api/auth/login/', {
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
                document.cookie = `token=${token}; path=/; secure; samesite=strict`;
                navigate("/postter/")
            
            getUserData(setEmail)

            }else{
                navigate("/postter/login")
            }
            //console.log(token)
        })
        .catch(error => {
            setErrors(error);
        });
    };


    return (
        <div class="row justify-content-center">
            <div class="col-5">
                <h2>ログイン</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>メールアドレス</label><span class="ml-3 text-danger">{formError.email}</span>
                        <input class="form-control" type="email" name="email" value={formData.email} onChange={handleChange}/>    
                        <label>パスワード</label><span class="ml-3 text-danger">{formError.password}</span>
                        <input class="form-control" type="password" name="password" value={formData.password} onChange={handleChange}/>
                    </div>
                    <button class="mt-2 btn btn-outline-primary btn-block" type="submit">送信</button>
                </form>
                <p>{messages}</p>
                <p>{formError.non_field_errors}</p>
            </div>
        </div>
    );
};

export default LoginForm;
