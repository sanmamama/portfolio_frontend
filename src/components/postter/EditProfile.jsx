import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"

const EditProfile = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [messages, setMessages] = useState("");
	const [formData, setFormData] = useState({});
	const [formError, setFormError] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            avatar: e.target.files[0]
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
		if(formData.email != myUserDataGlobal.email){
        	formDataObj.append('email', formData.email);
		}

		if(formData.uid != myUserDataGlobal.uid){
        	formDataObj.append('uid', formData.uid);
		}

		if(formData.username != myUserDataGlobal.username){
        	formDataObj.append('username', formData.username);
		}

        if (formData.avatar) {
            formDataObj.append('avatar_imgurl', formData.avatar);
        }

		if(formData.profile_statement != myUserDataGlobal.profile_statement){
			formDataObj.append('profile_statement', formData.profile_statement);
		}

        fetch('http://localhost:8000/api/postter/user/', {
            method: 'PATCH',
            headers: {
				'Authorization': `Token ${token}`,
            },
            body: formDataObj,
        })
        .then(response => {
            if(response.ok){
                setMessages("プロフィールを更新しました")
            }else{
                setMessages("プロフィール更新に失敗しました")
            }
            return response.json();
        })
        .then(data => {
			setFormError(() => ({
                email: "",
				uid: "",
				username: "",
				avatar: "",
				profile_statement:"",
				non_field_error:""
            }));

            if(data.email?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    email: data.email[0]
                }));
            }
            if(data.uid?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    uid: data.uid[0]
                }));
            }
			if(data.username?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    username: data.username[0]
                }));
            }
            if(data.avatar?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    avatar: data.avatar[0]
                }));
            }
			if(data.profile_statement?.[0]){
                setFormError((prev) => ({
                    ...prev,
                    profile_statement: data.profile_statement[0]
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
	

	useEffect(() => {
		const reload = () =>{
			setFormData({
					email: myUserDataGlobal?myUserDataGlobal.email:"",
					uid: myUserDataGlobal?myUserDataGlobal.uid:"",
					username: myUserDataGlobal?myUserDataGlobal.username:"",
					avatar: null,
					profile_statement:myUserDataGlobal?myUserDataGlobal.profile_statement:"",
			});
		}
		reload()
	},[myUserDataGlobal])

	return (
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					<form method="post" onSubmit={handleSubmit}>
						<label>メールアドレス</label><span class="ml-3 text-danger">{formError.email}</span>
						<input class="form-control" type="text" name="email" value={formData.email} onChange={handleChange}/>
						<label>ユーザーID</label><span class="ml-3 text-danger">{formError.uid}</span>
						<input class="form-control" type="text" name="uid" value={formData.uid} onChange={handleChange}/>
						<label>ユーザー名</label><span class="ml-3 text-danger">{formError.username}</span>
						<input class="form-control" type="text" name="username" value={formData.username} onChange={handleChange}/>
						<label>プロフィール画像</label><span class="ml-3 text-danger">{formError.avatar}</span>
						<input type="file" id="avatar" name="avatar" onChange={handleFileChange} />
						<label>プロフィール文</label><span class="ml-3 text-danger">{formError.profile_statement}</span>
						<textarea class="form-control" type="textarea" name="profile_statement" value={formData.profile_statement} onChange={handleChange}/>
						<button type="submit" class="mb-2 mt-2 btn btn-outline-primary btn-block">更新する</button>
						<p class="ml-3 text-danger">{formError.non_field_error}</p>
					</form>
				</div>
			</div>
		</div>
	  );
}

export default EditProfile;