import React, { useEffect, useState ,useContext } from 'react';
import { Link,useLocation } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { loginCheck } from './LoginCheck';
import { useNavigate } from "react-router-dom";
import { getUserData } from "./GetUserData"
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import PostContent from './PostContent';
import ModalAddUserToList from './ModalAddUserToList';
import ModalEditProfileButton from './ModalEditProfileButton';
const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;


const Home = () => {
	const { post_id } = useParams();

	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [userData,setUserData] = useState(null);
	const [messages, setMessages] = useState("");
	const [posts, setPosts] = useState(null);
	const navigate = useNavigate();

	//ログインチェック
	useEffect(()=>{
		loginCheck(setMyUserDataGlobal,navigate)
	},[])

	//リツイートハンドル
	const handleRepost = async (postId,post_ix,post_reposted) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        try {
            const response = await fetch(`${apiUrl}/postter/repost/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ post: postId })
            });

            if (response.ok) {
				const data = await response.json();
				//dtrictModeのせいで2回コールされて+-2されるけど気にしないよう。
				if(post_reposted){
					setPosts(()=>{posts.repost_count-=1;return posts;})
				}else{
					setPosts(()=>{posts.repost_count+=1;return posts;})
				}
				getUserData(setMyUserDataGlobal)
                setMessages(data.detail);
            } else {
                const data = await response.json();
				if(post_reposted){
					setPosts(()=>{posts.repost_count-=1;return posts;})
				}else{
					setPosts(()=>{posts.repost_count+=1;return posts;})
				}
				getUserData(setMyUserDataGlobal)
                setMessages(data.detail);
            }
        } catch (error) {
            setMessages('An error occurred.');
        }
    };

	//いいねハンドル
	const handleLike = async (post_id,post_ix,post_liked) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        const response = await fetch(`${apiUrl}/postter/like/`, {
            method: 'POST',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            },
			body: JSON.stringify({"post":post_id}),
        });
		const res = await response.json();
		if(response.ok){
			//dtrictModeのせいで2回コールされて+-2されるけど気にしないよう。
			if(post_liked){
				setPosts(()=>{posts.like_count-=1;return posts;})
			}else{
				setPosts(()=>{posts.like_count+=1;return posts;})
			}
			getUserData(setMyUserDataGlobal)
			setMessages(`postId:${post_id}${res.message}`);
			
		}else{
			setMessages(`postId:${post_id}${res}`);
		}
        
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
        const response = await fetch(`${apiUrl}/postter/post/${postId}/`, {
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

	//フォローハンドル
	const handleFollow = async (following_id) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        const response = await fetch(`${apiUrl}/postter/follow/`, {
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
			getUserData(setMyUserDataGlobal)
			
		}else{
			setMessages(res);
		}
        
    };

	const loadPost = async() => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		

		const response = await fetch(`${apiUrl}/postter/post/${post_id}/`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Token ${token}`,
				},
			}
		)
		const data = await response.json()
		
		if(response.ok){
			setPosts(data)
		}
	}


	useEffect(() => {
		loadPost()
		},[])

	if(!posts){
		return("loading...")
	}

	return (
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					<table>
					<tr class="text">
										<td class="text" style={{width: "15%"}}>
											<img class="rounded img-fluid mx-auto d-block" src={`${posts.owner.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
										</td>
										<td class="text" style={{width: "80%"}}>
											{posts.repost_user && (
											<>
											<p><img class="mr-2" src={`${baseUrl}/icon/repost_active.svg`} width="16" height="16"/><Link to={`/postter/${posts.repost_user.uid}/`}>{posts.repost_user.username}</Link>がリポストしました</p>
											</>
											)}
											<h6>
												<Link to={`/postter/${posts.owner.uid}/`}><b>{posts.owner.username}</b></Link>
												<span class="ml-1 text-secondary">@{posts.owner.uid}</span>
												<span class="ml-1 text-secondary">{posts.created_at.split('.')[0].replace('T',' ')}</span>
											</h6>
											<p><PostContent content={posts.content}/></p>

											<a class="mr-4" style={{cursor:"pointer"}} onClick={() => handleLike(posts.id,1,myUserDataGlobal.like.includes(posts.id))}>
											{myUserDataGlobal.like.includes(posts.id) ? <img src={`${baseUrl}/icon/heart_active.svg`} width="16" height="16"/> : <img src={`${baseUrl}/icon/heart_no_active.svg`} width="16" height="16"/>}{posts.like_count}
											</a>
											
											<a class="mr-4" style={{cursor:"pointer"}} onClick={() => handleRepost(posts.id,1,myUserDataGlobal.repost.includes(posts.id))}>
											{myUserDataGlobal.repost.includes(posts.id) ? <img src={`${baseUrl}/icon/repost_active.svg`} width="16" height="16"/> : <img src={`${baseUrl}/icon/repost_no_active.svg`} width="16" height="16"/>}{posts.repost_count}
											</a>

	
											<img src={`${baseUrl}/icon/view_count.svg`} width="16" height="16"/>{posts.view_count}


										</td>
										<td class='text' style={{width: "5%"}}>
											<div class="dropdown">
												<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">︙</button>
												<div class="dropdown-menu">
												{posts.owner.id == myUserDataGlobal.id && (
													<>
														<ModalAddUserToList class={"dropdown-item"} id={posts.owner.id}/>
														<a class="dropdown-item" style={{cursor:"pointer"}} onClick={() => handlePostDelete(posts.id)}>ポストを削除する</a>
													</>
												)}
												{posts.owner.id !== myUserDataGlobal.id && (
													<>
														<ModalAddUserToList class={"dropdown-item"} id={posts.owner.id}/>
														<a class="dropdown-item" style={{cursor:"pointer"}} onClick={() => handleFollow(posts.owner.id)}>
															{myUserDataGlobal.following.includes(posts.owner.id) ? "フォローを解除する" : "フォローする"}
														</a>
													</>
												)}

												</div>
												

											</div>
										</td>
							</tr>
					</table>
				
				</div>
			</div>
		</div>
	  );
}

export default Home;