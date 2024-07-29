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
	const location = useLocation();
	const { uid } = useParams();
	const { post_id } = useParams();

	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [userData,setUserData] = useState(null);
	const [messages, setMessages] = useState("");
	const [posts, setPosts] = useState([]);
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
					setPosts(()=>{posts[post_ix].repost_count-=1;return posts;})
				}else{
					setPosts(()=>{posts[post_ix].repost_count+=1;return posts;})
				}
				getUserData(setMyUserDataGlobal)
				refreshPost()
                setMessages(data.detail);
            } else {
                const data = await response.json();
				if(post_reposted){
					setPosts(()=>{posts[post_ix].repost_count-=1;return posts;})
				}else{
					setPosts(()=>{posts[post_ix].repost_count+=1;return posts;})
				}
				getUserData(setMyUserDataGlobal)
				refreshPost()
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
				setPosts(()=>{posts[post_ix].like_count-=1;return posts;})
			}else{
				setPosts(()=>{posts[post_ix].like_count+=1;return posts;})
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
			refreshPost()
			
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
			refreshPost()
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
		

		const response = await fetch(`${apiUrl}/postter/post/user/${uid}/`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Token ${token}`,
				},
			}
		)
		const data = await response.json()
		
		if(response.ok){
			setPosts([...posts, ...data.results])
			setHasMore(data.next)
			setPageCount(pageCount+1)
		}
	}


	const getMyUserData = () => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		console.log(token)
		fetch(`${apiUrl}/postter/user/${uid}/`,
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


	useEffect(() => {
		getMyUserData()
		setPosts([])
		setPageCount(1)
		setHasMore(true)
		},[location.pathname])

	

	

	if(!myUserDataGlobal || !userData || !posts){
		return("loading...")
	}

	return (
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					<img class="rounded img-fluid mx-auto d-block" src={`${userData.avatar_imgurl}`} id="avatar-image" width="150" height="150"/>
					
					<p class="mb-0"><b>{userData.username}</b></p>
					<p class="text-secondary">@{userData.uid}</p>
					<p> {userData.profile_statement} </p>
					<p>
					<span class="mr-3"><b>{ userData.post_count }</b>ポスト</span>
					<span class="mr-3"><Link to={`/postter/${userData.uid}/following/`}><b>{ userData.following_count }</b>フォロー</Link></span>
					<span class="mr-3"><Link to={`/postter/${userData.uid}/follower/`}><b>{ userData.follower_count }</b>フォロワー</Link></span>
					</p>

					{userData.id !== myUserDataGlobal.id && (
						<p class="mt-3 mb-3"><a class="btn btn-outline-success btn-sm" role="button" style={{cursor:"pointer"}} onClick={() => handleFollow(userData.id)}>
						{myUserDataGlobal.following.includes(userData.id) ? "フォローを解除" : "フォローする"}
						</a></p>
					)}
					{userData.id == myUserDataGlobal.id && (
						<>

					<ModalEditProfileButton uid={myUserDataGlobal.uid} username={myUserDataGlobal.username} profile_statement={myUserDataGlobal.profile_statement}
						setMyUserDataGlobal={setMyUserDataGlobal} setUserData={setUserData}
					/>
					    </>
					)}
					
					<p class="mt-3 mb-3"><a class="btn btn-outline-success btn-sm" href={`/postter/add_member/${userData.id}/`}>リスト操作</a></p>
				<div class="table table-responsive">
					<table id='post_list' class="table-sm" style={{width: "100%"}}>
						<tbody>
						<InfiniteScroll
								loadMore={loadPost}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{posts.map((postData,ix) => (
									<>
										<tr class="text" key={ix}>
										<td class="text" style={{width: "15%"}}>
											<img class="rounded img-fluid mx-auto d-block" src={`${postData.owner.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
										</td>
										<td class="text" style={{width: "80%"}}>
											{postData.repost_user && (
											<>
											<p><img class="mr-2" src={`${baseUrl}/icon/repost_active.svg`} width="16" height="16"/><Link to={`/postter/${postData.repost_user.uid}/`}>{postData.repost_user.username}</Link>がリポストしました</p>
											</>
											)}
											<h6>
												<Link to={`/postter/${postData.owner.uid}/`}><b>{postData.owner.username}</b></Link>
												<span class="ml-1 text-secondary">@{postData.owner.uid}</span>
												<span class="ml-1 text-secondary">{postData.created_at.split('.')[0].replace('T',' ')}</span>
											</h6>
											<p><PostContent content={postData.content}/></p>

											<a class="mr-4" style={{cursor:"pointer"}} onClick={() => handleLike(postData.id,ix,myUserDataGlobal.like.includes(postData.id))}>
											{myUserDataGlobal.like.includes(postData.id) ? <img src={`${baseUrl}/icon/heart_active.svg`} width="16" height="16"/> : <img src={`${baseUrl}/icon/heart_no_active.svg`} width="16" height="16"/>}{postData.like_count}
											</a>
											
											<a class="mr-4" style={{cursor:"pointer"}} onClick={() => handleRepost(postData.id,ix,myUserDataGlobal.repost.includes(postData.id))}>
											{myUserDataGlobal.repost.includes(postData.id) ? <img src={`${baseUrl}/icon/repost_active.svg`} width="16" height="16"/> : <img src={`${baseUrl}/icon/repost_no_active.svg`} width="16" height="16"/>}{postData.repost_count}
											</a>

	
											<img src={`${baseUrl}/icon/view_count.svg`} width="16" height="16"/>{postData.view_count}


										</td>
										<td class='text' style={{width: "5%"}}>
											<div class="dropdown">
												<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">︙</button>
												<div class="dropdown-menu">
												{postData.owner.id == myUserDataGlobal.id && (
													<>
														<ModalAddUserToList class={"dropdown-item"} id={postData.owner.id}/>
														<a class="dropdown-item" style={{cursor:"pointer"}} onClick={() => handlePostDelete(postData.id)}>ポストを削除する</a>
													</>
												)}
												{postData.owner.id !== myUserDataGlobal.id && (
													<>
														<ModalAddUserToList class={"dropdown-item"} id={postData.owner.id}/>
														<a class="dropdown-item" style={{cursor:"pointer"}} onClick={() => handleFollow(postData.owner.id)}>
															{myUserDataGlobal.following.includes(postData.owner.id) ? "フォローを解除する" : "フォローする"}
														</a>
													</>
												)}

												</div>
												

											</div>
										</td>
									</tr>
							</>
							
							))}
							</InfiniteScroll>
						
						</tbody>
					</table>
				</div>
				</div>
			</div>
		</div>
	  );
}

export default Home;