import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"

const Home = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [messages, setMessages] = useState("");
	const [formData, setFormData] = useState({
        email: myUserDataGlobal.email,
        uid: myUserDataGlobal.uid,
        username: myUserDataGlobal.username,
        avatar: null,
		profile_statement:myUserDataGlobal.profile_statement,
    });

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
        formDataObj.append('email', formData.email);
        formDataObj.append('uid', formData.uid);
        formDataObj.append('username', formData.username);
        if (formData.avatar) {
            formDataObj.append('avatar_imgurl', formData.avatar);
        }
		formDataObj.append('profile_statement', formData.profile_statement);

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
        })
        .catch(error => {
        });
    };
	

	
	

	return (
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					<form method="post" onSubmit={handleSubmit}>
						<label>メールアドレス</label><span class="ml-3 text-danger"></span>
						<input class="form-control" type="text" name="email" value={formData.email} onChange={handleChange}/>
						<label>ユーザーID</label><span class="ml-3 text-danger"></span>
						<input class="form-control" type="text" name="uid" value={formData.uid} onChange={handleChange}/>
						<label>ユーザー名</label><span class="ml-3 text-danger"></span>
						<input class="form-control" type="text" name="username" value={formData.username} onChange={handleChange}/>
						<label>プロフィール画像</label><span class="ml-3 text-danger"></span>
						<input type="file" id="avatar" name="avatar" onChange={handleFileChange} />
						<label>プロフィール文</label><span class="ml-3 text-danger"></span>
						<textarea class="form-control" type="textarea" name="profile_statement" value={formData.profile_statement} onChange={handleChange}/>
						<button type="submit" class="mb-2 mt-2 btn btn-outline-primary btn-block">投稿する</button>
					</form>
				</div>
			</div>
		</div>
	  );
}

export default Home;