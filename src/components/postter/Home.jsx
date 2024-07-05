import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import {FollowDataContext} from "./providers/FollowDataProvider"
import { getFollowData } from "./GetFollowData"

const Home = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const {myFollowDataGlobal,setMyFollowDataGlobal} = useContext(FollowDataContext);
	const [postData,setPostData] = useState([]);
	const [formData, setFormData] = useState({
        content: ''
    });
	const [messages, setMessages] = useState("");
	const [responseMessages, setResponseMessages] = useState("");
    const [errors, setErrors] = useState("");



	//フォローハンドル
	const handleFollow = async (following_id) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        const response = await fetch(`http://127.0.0.1:8000/api/postter/follow/`, {
            method: 'POST',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            },
			body: JSON.stringify({"following":following_id}),
        });
		const res = await response.json();
		if(response.ok){
        	setMessages(res.message);

			getFollowData(setMyFollowDataGlobal)
			


		}else{
			setMessages(res);
		}
        
    };

	const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
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
        fetch('http://localhost:8000/api/postter/post/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if(response.ok){
                setMessages("投稿しました")
            }else{
                setMessages("投稿に失敗しました")
            }
            return response.json();
        })
        .then(data => {
            setFormData(() => ({
                'content':''
            }));
			//setResponseMessages(data.id)
        })
        .catch(error => {
            setErrors(error);
        });
    };
	

	useEffect(() => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);

		const getPostData = (token) => {
			fetch('http://localhost:8000/api/postter/post/',
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
				//ログインしているとき
				setPostData(data.results)
				})
			.catch(error => {
				//ログインしていないとき
			});
		}

		getPostData(token)
	},[messages])
	

	if(myUserDataGlobal==null){
		return("loading")
	}
	if(myFollowDataGlobal==null){
		return("loading")
	}

	return (
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					{myFollowDataGlobal}
					<form method="post" onSubmit={handleSubmit}>
						<textarea class="form-control" type="textarea" name="content" value={formData.content} onChange={handleChange}/>
						<button type="submit" class="mb-2 mt-2 btn btn-outline-primary btn-block">投稿する</button>
					</form>
				<div class="table table-responsive">
					<table id='post_list' class="table-sm">
						<tbody>
							{postData.map((postData) => (
								<tr class="text">
								<td class="text" style={{width: "15%"}}>
									<img class="rounded img-fluid mx-auto d-block" src={postData.owner.avatar_imgurl} id="avatar-image" width="40" height="40"/>
								</td>
								<td class="text" style={{width: "80%"}}>
									<h6>
										<a text-dark text-decoration-none href=""><b>{postData.owner.username}</b></a>
										<span class="ml-1 text-secondary">@{postData.owner.uid}</span>
										<span class="ml-1 text-secondary">{postData.created_at.split('.')[0].replace('T',' ')}</span>
									</h6>
									<p>{postData.content}</p>
									<form action="" method="post">
										<button class="btn btn-outline-primary btn-sm" type="submit">
											♥
										</button>
									</form>
								</td>
								<td class='text' style={{width: "5%"}}>
									<div class="dropdown">
										<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">︙</button>
										<div class="dropdown-menu">
											<a class="dropdown-item" href="">このユーザーをリストに追加/削除</a>
											<a class="dropdown-item" onClick={() => handleFollow(postData.owner.id)}>{myFollowDataGlobal.includes(postData.owner.id) ? "このユーザーのフォローを解除する":"このユーザーをフォローする"}</a>
										
										</div>
										

									</div>
								</td>
							</tr>

							))}
						
						</tbody>
					</table>
				</div>
				</div>
			</div>
		</div>
	  );
}

export default Home;