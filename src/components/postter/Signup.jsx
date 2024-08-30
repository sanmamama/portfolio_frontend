
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;

const SignupForm = () => {
    const { i18n,t } = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password1: '',
        password2: ''
    });
    const [formError, setFormError] = useState({
        email: '',
        username: '',
        password1: '',
        password2: '',
        non_field_errors:''
    });
    const [messages, setMessages] = useState("");


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        fetch(`${apiUrl}/auth/registration/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept-language':i18n.language,

            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if(response.ok){
                setMessages("入力されたメールアドレス宛に認証メールを送りましたのでご確認ください")
            }else{
                setMessages("")
            }
            return response.json();
        })
        .then(data => {
            
            setFormError(() => ({
                'email':'',
                'username':'',
                'password1':'',
                'password2':'',
                'non_field_errors':''
            }));

            if(data.email?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    email: data.email[0]
                }));
            }
            if(data.username?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    username: data.username[0]
                }));
            }
            if(data.password1?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    password1: data.password1[0]
                }));
            }
            if(data.password2?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    password2: data.password2[0]
                }));
            }
            if(data.non_field_errors?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    non_field_errors: data.non_field_errors[0]
                }));
            }
        })
        .catch(error => {

        });
    };


    return (
        <div>
            
                <div className="container text-center">
                        <img className="img-fluid mb-4" src={`${baseUrl}/media/logo/postter.png`} width="200" height="200" alt="postter"/>
                        <h2>{t("signup")}</h2>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <label>{t("email")}</label><span className="ms-3 text-danger">{formError.email}</span>
                    <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange}/>

                    <label>{t("username")}</label><span className="ms-3 text-danger">{formError.username}</span>
                    <input className="form-control" type="username" name="username" value={formData.username} onChange={handleChange}/>
                    
                    <label>{t("password")}</label><span className="ms-3 text-danger">{formError.password1}</span>
                    <input className="form-control" type="password" name="password1" value={formData.password1} onChange={handleChange}/>
                    
                    <label>{t("confirm_password")}</label><span className="ms-3 text-danger">{formError.password2}</span>
                    <input className="form-control" type="password" name="password2" value={formData.password2} onChange={handleChange}/>
                    
                    <div className="d-grid gap-2">
                        <button className="mt-2 btn btn-outline-primary btn-block" type="submit">{t("register")}</button>
                    </div>
                </form>

                <p>{messages}</p>
                <p>{formError.non_field_errors}</p>

        </div>
    );
};

export default SignupForm;
