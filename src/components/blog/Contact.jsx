
import React, { useState } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;



function Contact() {
    return (
        <div className="col-sm-9">
            <div className="container container-m">
                <div className="row">
                    <div className="w-100">
                        <h1>お問い合わせ</h1>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [messages, setMessages] = useState("");

    const validateForm = () => {
        let formErrors = {};
        if (!formData.name) formErrors.name = '名前を入力してください';
        if (!formData.email) formErrors.email = 'メールアドレスを入力してください';
        if (!formData.message) formErrors.message = 'メッセージを入力してください';
        return formErrors;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({
            ...errors,
            [e.target.name]: ''  // Clear the error message for this field
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        fetch(`${apiUrl}/contact/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            setMessages('送信しました')
            setFormData({
                name: '',
                email: '',
                message: ''
            });
        })
        .catch((error) => {
            console.error('There was an error!', error);
        });
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div>
                <label>お名前</label> {errors.name && <span className="ms-3" style={{ color: 'red' }}>{errors.name}</span>}
                <input className="form-control" type="text" name="name" value={formData.name} onChange={handleChange} />

                <label>メールアドレス</label> {errors.email && <span className="ms-3" style={{ color: 'red' }}>{errors.email}</span>}
                <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} />
				
                <label>メッセージ</label> {errors.message && <span className="ms-3" style={{ color: 'red' }}>{errors.message}</span>}
                <textarea className="form-control" name="message" value={formData.message} onChange={handleChange}></textarea>
				
            </div>
            <div class="d-grid gap-2">
                <button className="mt-2 btn btn-outline-primary" type="submit">送信</button>
            </div>
        </form>
        <p>{messages}</p>
        </>
    );
};

export default Contact;
