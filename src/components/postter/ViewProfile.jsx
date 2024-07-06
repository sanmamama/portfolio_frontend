import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import {FollowDataContext} from "./providers/FollowDataProvider"
import { getFollowData } from "./GetFollowData"
import { getUserData } from "./GetUserData"
import { useParams } from 'react-router-dom';

const Home = () => {
	const { uid } = useParams();
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const {myFollowDataGlobal,setMyFollowDataGlobal} = useContext(FollowDataContext);
	const [postData,setPostData] = useState(null);
	const [userData,setUserData] = useState(null);

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
			getUserData(setMyUserDataGlobal)
			
		}else{
			setMessages(res);
		}
        
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
			fetch('http://localhost:8000/api/postter/post/user/'+uid+'/',
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

		const getUserData = (token) => {
			fetch('http://localhost:8000/api/postter/user/'+uid+'/',
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
				setUserData(data)
				})
			.catch(error => {
				//ログインしていないとき
			});
		}

		getPostData(token)
		getUserData(token)
	},[])
	

	if(!userData || !postData){
		return("loading...")
	}

	return (
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					<img class="rounded img-fluid mx-auto d-block" src={`http://localhost:8000${userData.avatar_imgurl}`} id="avatar-image" width="150" height="150"/>
					
					<p class="mb-0"><b>{userData.username}</b></p>
					<p class="text-secondary">@{userData.uid}</p>
					<p> {userData.profile_statement} </p>
					<p>
					<span class="mr-3"><b>{ userData.post_count }</b>ポスト</span>
					<span class="mr-3"><a href=""><b>{ userData.following_count }</b>フォロー</a></span>
					<span class="mr-3"><a href=""><b>{ userData.follower_count }</b>フォロワー</a></span>
					</p>

					<h1><a class="btn btn-outline-success btn-sm" href="" role="button">フォローする</a></h1>
					<h2><a class="btn btn-outline-success btn-sm" href="" role="button">フォローを外す</a></h2>
					<h3><Link class="btn btn-outline-success btn-sm" to="/postter/editprofile" role="button">プロフィールを編集する</Link></h3>

					<p class="mt-3 mb-3"><a class="btn btn-outline-success btn-sm" href="">リスト操作</a></p>
				<div class="table table-responsive">
					<table id='post_list' class="table-sm">
						<tbody>
							{postData.map((postData) => (
								<tr class="text">
								<td class="text" style={{width: "15%"}}>
									<img class="rounded img-fluid mx-auto d-block" src={`http://localhost:8000${postData.owner.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
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