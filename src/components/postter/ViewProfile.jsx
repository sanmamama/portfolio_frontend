import React, { useEffect, useState ,useContext } from 'react';
import { Link,useLocation } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { getFollowData } from "./GetFollowData"
import { getUserData } from "./GetUserData"
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import PostContent from './PostContent';



const Home = () => {
	const location = useLocation();
	const { uid } = useParams();
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);

	const [userData,setUserData] = useState(null);

	const [messages, setMessages] = useState("");
	const [responseMessages, setResponseMessages] = useState("");
    const [errors, setErrors] = useState("");

	const [posts, setPosts] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);



	//いいねハンドル
	const handleLike = async (post_id,post_ix,post_liked) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        const response = await fetch(`http://127.0.0.1:8000/api/postter/like/`, {
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
			getUserData(setMyUserDataGlobal)
			
		}else{
			setMessages(res);
		}
        
    };

	const loadPost = async(page) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		

		const response = await fetch(`http://localhost:8000/api/postter/post/user/${uid}/?page=${pageCount}`,
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

	const refreshPost = async() => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);

		const response = await fetch(`http://localhost:8000/api/postter/post/user/${uid}/?page=1`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Token ${token}`,
				},
			}
		)
		const data = await response.json()
		
		if(response.ok){
			setPosts(data.results)
			console.log(data.results)
			setHasMore(data.next)
			setPageCount(2)
		}
	}

	const getMyUserData = () => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		})
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


	useEffect(() => {
		setMessages("")
		getMyUserData()
		refreshPost()
		},[location.pathname])

	

	if(!myUserDataGlobal || !userData || !posts){
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
					<span class="mr-3"><Link to={`/postter/${userData.uid}/following/`}><b>{ userData.following_count }</b>フォロー</Link></span>
					<span class="mr-3"><Link to={`/postter/${userData.uid}/follower/`}><b>{ userData.follower_count }</b>フォロワー</Link></span>
					</p>

					{userData.id !== myUserDataGlobal.id && (
						<p class="mt-3 mb-3"><a class="btn btn-outline-success btn-sm" role="button" style={{cursor:"pointer"}} onClick={() => handleFollow(userData.id)}>
						{myUserDataGlobal.following.includes(userData.id) ? "フォローを解除" : "フォローする"}
						</a></p>
					)}
					{userData.id == myUserDataGlobal.id && (
					<h3><Link class="btn btn-outline-success btn-sm" to="/postter/editprofile" role="button">プロフィールを編集する</Link></h3>
					)}

					<p class="mt-3 mb-3"><a class="btn btn-outline-success btn-sm" href="">リスト操作</a></p>
				<div class="table table-responsive">
					<table id='post_list' class="table-sm" style={{width: "100%"}}>
						<tbody>
						<InfiniteScroll
								loadMore={loadPost}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{posts.map((postData,ix) => (
								<tr class="text" key={ix}>
								<td class="text" style={{width: "15%"}}>
									<img class="rounded img-fluid mx-auto d-block" src={`http://localhost:8000${userData.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
								</td>
								<td class="text" style={{width: "80%"}}>
									<h6>
										<Link to={`/postter/${postData.owner.uid}/`}><b>{postData.owner.username}</b></Link>
										<span class="ml-1 text-secondary">@{postData.owner.uid}</span>
										<span class="ml-1 text-secondary">{postData.created_at.split('.')[0].replace('T',' ')}</span>
									</h6>
									<p><PostContent content={postData.content}/></p>

									{postData.owner.id == myUserDataGlobal.id && (
										<>
										{myUserDataGlobal.like.includes(postData.id) ? "♥" : "♡"}({postData.like_count})
										</>
									)}
									{postData.owner.id !== myUserDataGlobal.id && (
										<button class="btn btn-outline-primary btn-sm" onClick={() => handleLike(postData.id,ix,myUserDataGlobal.like.includes(postData.id))}>
										{myUserDataGlobal.like.includes(postData.id) ? "♥" : "♡"}({postData.like_count})
										</button>
									)}
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
												<a class="dropdown-item" style={{cursor:"pointer"}}>このユーザーをリストに追加/削除</a>
												<a class="dropdown-item" style={{cursor:"pointer"}} onClick={() => handleFollow(postData.owner.id)}>
													{myUserDataGlobal.following.includes(postData.owner.id) ? "このユーザーのフォローを解除する" : "このユーザーをフォローする"}
												</a>
											</>
										)}

										</div>
										

									</div>
								</td>
							</tr>
							
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