// src/components/ContactForm.js
import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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
            console.log('Success:', data);
            alert('Message sent successfully!');
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
        <form onSubmit={handleSubmit}>
            <div>
                <label>お名前</label>
                <input class="form-control" type="text" name="name" value={formData.name} onChange={handleChange} />

                <label>メールアドレス</label>
                <input class="form-control" type="email" name="email" value={formData.email} onChange={handleChange} />

                <label>メッセージ</label>
                <textarea class="form-control" name="message" value={formData.message} onChange={handleChange}></textarea>
            </div>
            <button class="mt-2 btn btn-outline-primary btn-block" type="submit">送信</button>
        </form>
    );
};

export default ContactForm;
