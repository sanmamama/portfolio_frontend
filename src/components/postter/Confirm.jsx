
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const apiUrl = process.env.REACT_APP_API_URL;


function useQuery() {
    const location = useLocation(); // useLocationから正しく値を取得する
    return new URLSearchParams(location.search);
}

const Confirm = () => {
    const { i18n } = useTranslation();
    const [messages, setMessages] = useState("");
    const [responseData, setResponseData] = useState([]);
    const [errors, setErrors] = useState("");
    const query = useQuery();
	const key = query.get('key')
    const navigate = useNavigate();


    useEffect(() => {
        fetch(`${apiUrl}/auth/registration/verify-email/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept-language':i18n.language,
            },
            body: JSON.stringify({key}),
        })
        .then(response => {
            if(response.ok){
                setMessages("認証完了")
                navigate("/postter/login/")
            }
            else{
                setMessages("認証失敗")
            }
            return response.json();
        })
        .then(data => {
            setMessages(data.detail)
            setResponseData(data);
        })
        .catch(error => {
            setErrors(error);
        });
    }, [key,navigate,i18n]);


    return (
        <div className="col-sm-9">
            <div className="container container-m">
                <div className="row">
                    <div className="w-100">
                        <p>{messages}</p>
                        <p>{JSON.stringify(errors)}</p>
                        <p>{JSON.stringify(responseData)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirm;
