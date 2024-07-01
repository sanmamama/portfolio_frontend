
import React, { useState } from 'react';



function Contact() {
    return (
        <div className="col-sm-9">
            <div className="container container-m">
                <div className="row">
                    <div class="w-100">
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

        fetch('http://localhost:8000/api/contact/', {
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
            //console.log('Success:', data);
            //alert('Message sent successfully!');
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
                <label>お名前</label> {errors.name && <span class="ml-3" style={{ color: 'red' }}>{errors.name}</span>}
                <input class="form-control" type="text" name="name" value={formData.name} onChange={handleChange} />

                <label>メールアドレス</label> {errors.email && <span class="ml-3" style={{ color: 'red' }}>{errors.email}</span>}
                <input class="form-control" type="email" name="email" value={formData.email} onChange={handleChange} />
				
                <label>メッセージ</label> {errors.message && <span class="ml-3" style={{ color: 'red' }}>{errors.message}</span>}
                <textarea class="form-control" name="message" value={formData.message} onChange={handleChange}></textarea>
				
            </div>
            <button class="mt-2 btn btn-outline-primary btn-block" type="submit">送信</button>
        </form>
        <p>{messages}</p>
        </>
    );
};

export default Contact;
