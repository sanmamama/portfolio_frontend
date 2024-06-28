
import React, { useState } from 'react';



function Contact() {
    return (
        <div className="col-sm-9">
            <div className="container container-m">
                <div className="row">
                    <div class="w-100">
                        <h1>会員登録</h1>
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
        password1: '',
        password2: ''
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
    
        fetch('http://localhost:8000/api/auth/registration/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            setMessages(data);
        })
        .catch(error => {
            setMessages(error);
        });
    };


    return (
        <>
        <form onSubmit={handleSubmit}>
            <div>

                <label>メールアドレス</label>
                <input class="form-control" type="email" name="email" value={formData.email} onChange={handleChange}/>
				
                <label>パスワード</label>
                <input class="form-control" type="password" name="password1" value={formData.password1} onChange={handleChange}/>

                <label>確認用パスワード</label>
                <input class="form-control" type="password" name="password2" value={formData.password2} onChange={handleChange}/>
				
            </div>
            <button class="mt-2 btn btn-outline-primary btn-block" type="submit">送信</button>
        </form>
        <p>{JSON.stringify(messages)}</p>
        </>
    );
};

export default Contact;
