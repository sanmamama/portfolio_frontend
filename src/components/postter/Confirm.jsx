
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation, useHistory } from 'react-router-dom';


function Contact() {
    return (
        <div className="col-sm-9">
            <div className="container container-m">
                <div className="row">
                    <div class="w-100">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

// カスタムフック: URLクエリパラメータを取得
function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const ContactForm = () => {
    const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");
    const query = useQuery();
	const key = query.get('key')


    useEffect(() => {
        fetch('http://localhost:8000/api/auth/registration/verify-email/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({key}),
        })
        .then(response => {

            return response.json();
        })
        .then(data => {
            setMessages(data);
        })
        .catch(error => {
            setErrors(error);
        });
    }, []);


    return (
        <>
        <p>{JSON.stringify(messages)}</p>
        <p>{JSON.stringify(errors)}</p>
        </>
    );
};

export default Contact;
