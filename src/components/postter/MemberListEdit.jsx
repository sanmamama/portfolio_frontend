import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { useParams } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

const Message = () => {
    const { id } = useParams();
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
    const [targetListData, setTargetListData] = useState(null);
	const [formData, setFormData] = useState({
		name:"",
		description:"",
	});
	const [formError, setFormError] = useState({});
	const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");

	const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

	const handleSubmit = (e) => {
        e.preventDefault();
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);

		const formDataObj = new FormData();
        formDataObj.append('name', formData.name);
        formDataObj.append('description', formData.description);

        fetch(`${apiUrl}/postter/memberlist/${id}/`, {
            method: 'PATCH',
            headers: {
				'Authorization': `Token ${token}`,
            },
            body: formDataObj,
        })
        .then(response => {
            if(response.ok){
                setMessages("リストを編集しました")
            }else{
                setMessages("リストの編集に失敗しました")
            }
            return response.json();
        })
        .then(data => {
			setFormError(() => ({
				name: "",
				description: "",
            }));

            if(data.name?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    name: data.name[0]
                }));
            }
			if(data.description?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    description: data.description[0]
                }));
            }
            
        })
        .catch(error => {
        });
    };

    useEffect(()=>{
		const getTargetListData = () => {
			const token = document.cookie.split('; ').reduce((acc, row) => {
				const [key, value] = row.split('=');
				if (key === 'token') {
				acc = value;
				}
				return acc;
			}, null);
			fetch(`${apiUrl}/postter/memberlist/?id=${id}`,
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
				setTargetListData(data.results[0])
                setFormData({
					name: data.results[0].name,
					description: data.results[0].description
			});
				})
			.catch(error => {
			});
		}
		getTargetListData()
	},[])
	




	return (
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					<h4>リストを編集</h4>				
					<form method="post" onSubmit={handleSubmit}>
						<label>リストの名前</label><span class="ml-3 text-danger">{formError.name}</span>
						<input class="form-control" type="text" name="name" value={formData.name} onChange={handleChange}/>
						<label>リストの説明</label><span class="ml-3 text-danger">{formError.description}</span>
						<input class="form-control" type="text" name="description" value={formData.description} onChange={handleChange}/>

						<button type="submit" class="mb-2 mt-2 btn btn-outline-primary btn-block">作成する</button>
						<p class="ml-3 text-danger">{formError.non_field_error}</p>
					</form>
				</div>
			</div>
		</div>
	  );
}

export default Message;