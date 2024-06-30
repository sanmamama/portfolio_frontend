
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";


function Contact() {
    return (
        <div className="col-sm-9">
            <div className="container container-m">
                <div className="row">
                    <div class="w-100">
                        <h1>ログイン</h1>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}




const ContactForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [messages, setMessages] = useState("");
    const [responseData, setResponseData] = useState([]);
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                setMessages("成功")
            }else{
                setMessages("失敗")
            }
            return response.json();
        })
        .then(data => {
            
            setResponseData(data);
            if(data.key){
                const token = data.key
                document.cookie = `token=${token}; path=/; secure; samesite=strict`;
                navigate("/postter/")
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
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>メールアドレス</label>
                    <input class="form-control" type="email" name="email" value={formData.email} onChange={handleChange}/>    
                    <label>パスワード</label>
                    <input class="form-control" type="password" name="password" value={formData.password} onChange={handleChange}/>
                </div>
                <button class="mt-2 btn btn-outline-primary btn-block" type="submit">送信</button>
            </form>
            <p>{messages}</p>
            <p>{JSON.stringify(errors)}</p>
            <p>{JSON.stringify(responseData)}</p>
        </div>
    );
};

export default Contact;
