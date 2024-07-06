import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import {FollowDataContext} from "./providers/FollowDataProvider"
import { getFollowData } from "./GetFollowData"
import { getUserData } from "./GetUserData"

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
	const handleFollow = async (user_id) => {
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
			body: JSON.stringify({"following":user_id}),
        });
		const res = await response.json();
		if(response.ok){
			setMessages(`userId:${user_id}${res.message}`);
			getFollowData(setMyFollowDataGlobal)
			getUserData(setMyUserDataGlobal)
			
		}else{
			setMessages(`userId:${user_id}${res}`);
		}
        
    };

	//ポストフォームチェンジ
	const handlePostChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

	//ポスト消すハンドル
	const handlePostDelete = async (postId) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        const response = await fetch(`http://127.0.0.1:8000/api/postter/post/${postId}/`, {
            method: 'DELETE',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            }
        });
		if(response.ok){
			setMessages(`id:${postId}ポストを削除しました`);
			
		}else{
			setMessages(`id:${postId}ポストの削除に失敗しました`);
		}
	};

    const handlePostSubmit = (e) => {
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
                
            }else{
                setMessages("投稿に失敗しました")
            }
            return response.json();
        })
        .then(data => {
            setFormData(() => ({
                'content':''
            }));
			if(data.id){
				setMessages(`postId:${data.id}投稿しました`)
			}
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
	

	if(!myUserDataGlobal || !myFollowDataGlobal){
		return("loading...")
	}

	return (
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					<form method="post" onSubmit={handlePostSubmit}>
						<textarea class="form-control" type="textarea" name="content" value={formData.content} onChange={handlePostChange} placeholder="いまなにしてる？"/>
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
										<Link to={`${postData.owner.uid}/`}><b>{postData.owner.username}</b></Link>
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
										{postData.owner.id == myUserDataGlobal.id && (
											<>
												<a class="dropdown-item" onClick={() => handlePostDelete(postData.id)}>このポストを削除する</a>
											</>
										)}
										{postData.owner.id !== myUserDataGlobal.id && (
											<>
												<a class="dropdown-item" href="">このユーザーをリストに追加/削除</a>
												<a class="dropdown-item" onClick={() => handleFollow(postData.owner.id)}>
													{myFollowDataGlobal.includes(postData.owner.id) ? "このユーザーのフォローを解除する" : "このユーザーをフォローする"}
												</a>
											</>
										)}

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