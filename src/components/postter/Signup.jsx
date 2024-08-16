
import React, { useState } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;


const SignupForm = () => {
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
        <div className="row justify-content-center">
            <div className="col-5">
                <h2>会員登録</h2>
                <form onSubmit={handleSubmit}>
                    <label>メールアドレス</label><span className="ml-3 text-danger">{formError.email}</span>
                    <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange}/>

                    <label>ユーザー名</label><span className="ml-3 text-danger">{formError.username}</span>
                    <input className="form-control" type="username" name="username" value={formData.username} onChange={handleChange}/>
                    
                    <label>パスワード</label><span className="ml-3 text-danger">{formError.password1}</span>
                    <input className="form-control" type="password" name="password1" value={formData.password1} onChange={handleChange}/>
                    
                    <label>確認用パスワード</label><span className="ml-3 text-danger">{formError.password2}</span>
                    <input className="form-control" type="password" name="password2" value={formData.password2} onChange={handleChange}/>
                    
				
                    <button className="mt-2 btn btn-outline-primary btn-block" type="submit">送信</button>
                </form>

                <p>{messages}</p>
                <p>{formError.non_field_errors}</p>
            </div>
        </div>
    );
};

export default SignupForm;
