import React, { useEffect, useState ,useContext,useCallback } from 'react';
import { Link,useLocation } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { loginCheck } from './LoginCheck';
import { useNavigate } from "react-router-dom";
import { getUserData } from "./GetUserData"
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import PostContent from './PostContent';
import ModalAddUserToList from './ModalAddUserToList';
import ModalCreateReplyButton from './ModalCreateReplyButton';
import PostContainer from './PostContainer';
const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;


const Home = () => {
	const location = useLocation();
	const { post_id } = useParams();

	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [messages, setMessages] = useState("");
	const [newPost, setNewPost] = useState("");
	const [posts, setPosts] = useState(null);
	const [replies, setReplies] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const navigate = useNavigate();

	//ログインチェック
	useEffect(()=>{
		loginCheck(myUserDataGlobal,setMyUserDataGlobal,navigate)
	},[myUserDataGlobal,setMyUserDataGlobal,navigate])

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
				const data = await response.json();
				//dtrictModeのせいで2回コールされて+-2されるけど気にしないよう。
				if(post_ix >= 0){
					if(post_reposted){
						setReplies(()=>{replies[post_ix].repost_count-=1;return replies;})
					}else{
						setReplies(()=>{replies[post_ix].repost_count+=1;return replies;})
					}
					
				}else{
					if(post_reposted){
						setPosts(()=>{posts.repost_count-=1;return posts;})
					}else{
						setPosts(()=>{posts.repost_count+=1;return posts;})
					}
				}
				getUserData(setMyUserDataGlobal)
				setMessages(data.detail);

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
			if(post_ix >= 0){
				if(post_liked){
					setReplies(()=>{replies[post_ix].like_count-=1;return replies;})
				}else{
					setReplies(()=>{replies[post_ix].like_count+=1;return replies;})
				}
			}else{
				if(post_liked){
					setPosts(()=>{posts.like_count-=1;return posts;})
				}else{
					setPosts(()=>{posts.like_count+=1;return posts;})
				}
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
		refreshPost()
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

	//返信投稿
	//ポストフォームチェンジ
	const handleInputChange = (e) => {
        setNewPost(e.target.value)
    };

	const handlePostSubmit = (event) => {
		event.preventDefault();
		if (newPost === "") return;
		
		const token = document.cookie.split('; ').reduce((acc, row) => {
				const [key, value] = row.split('=');
				if (key === 'token') {
				acc = value;
				}
				return acc;
			}, null);
			fetch(`${apiUrl}/postter/post/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Token ${token}`,
				},
				body: JSON.stringify({content:newPost,parent:post_id}),
			})
			.then(response => {
				if(response.ok){
					setNewPost("")
				}else{
	
				}
				
				return response.json();
			})
			.then(data => {
	
			})
			.catch(error => {
	
			});
		refreshPost()
	  }

	

	const loadReply = async(page) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		

		const response = await fetch(`${apiUrl}/postter/post/reply/${post_id}/?page=${pageCount}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Token ${token}`,
				},
			}
		)
		const data = await response.json()
		
		if(response.ok){
			setReplies([...replies, ...data.results])
			setHasMore(data.next)
			setPageCount(pageCount+1)
		}else{
			setReplies([])
			setHasMore(false)
		}
	}

	const refreshPost = useCallback(() => {
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
		loadPost()
		setReplies([])
		setHasMore(true)
		setPageCount(1)
	  }, [post_id]);

	useEffect(() => {
		refreshPost()
		},[location.pathname,refreshPost])


	if(!posts  || !myUserDataGlobal){
		return("loading...")
	}


	return (
			<div className="card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					<div className="container">
						<PostContainer
						postData={posts}
						myUserDataGlobal={myUserDataGlobal}
						posts={null}
						setPosts={setPosts}
						getUserData={getUserData}
						setMyUserDataGlobal={setMyUserDataGlobal}
						setMessages={setMessages}
						refreshPost={refreshPost}
						ix={0}
						/>
					</div>
					
					<hr/>
					<form onSubmit={handlePostSubmit}>
						<textarea 
							className="form-control"
							value={newPost}
							onChange={handleInputChange}
							rows="2"
							cols="50"
							placeholder="返信をポストする"
						/>
						<button　className="mb-2 mt-2 btn btn-outline-primary btn-block" type="submit">返信</button>
						</form>
					<hr/>
					<table id='Reply_list' className="table-sm" style={{width: "100%"}}>
						<tbody>
							<InfiniteScroll
								loadMore={loadReply}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{replies.map((replyData,ix) => (
								<>
									
								<tr className="text" key={ix}>
								<td className="text" style={{width: "15%"}}>
									<img className="rounded img-fluid mx-auto d-block" src={replyData.owner.avatar_imgurl} id="avatar-image" width="40" height="40" alt="avatarimage"/>
								</td>
								<td className="text" style={{width: "80%"}}>
									<h6>
										<Link to={`/postter/${replyData.owner.uid}/`}><b>{replyData.owner.username}</b></Link>
										<span className="ml-1 text-secondary">@{replyData.owner.uid}</span>
										<span className="ml-1 text-secondary">{replyData.created_at.split('.')[0].replace('T',' ')}</span>
									</h6>
									<Link className="no-link-style" to={`/postter/post/${replyData.id}/`}>	
									<p><PostContent content={replyData.content}/></p>
									</Link>

									<ModalCreateReplyButton postData={replyData}/>
									
									<button className="mr-4" style={{cursor:"pointer"}} onClick={() => handleLike(replyData.id,ix,myUserDataGlobal.like.includes(replyData.id))}>
									{myUserDataGlobal.like.includes(replyData.id) ? <img src={`${baseUrl}/media/icon/heart_active.svg`} width="16" height="16" alt="like"/> : <img src={`${baseUrl}/media/icon/heart_no_active.svg`} width="16" height="16" alt="like"/>}{replyData.like_count}
									</button>
									
									<button className="mr-4" style={{cursor:"pointer"}} onClick={() => handleRepost(replyData.id,ix,myUserDataGlobal.repost.includes(replyData.id))}>
									{myUserDataGlobal.repost.includes(replyData.id) ? <img src={`${baseUrl}/media/icon/repost_active.svg`} width="16" height="16" alt="repost"/> : <img src={`${baseUrl}/media/icon/repost_no_active.svg`} width="16" height="16" alt="repost"/>}{replyData.repost_count}
									</button>

									<img src={`${baseUrl}/media/icon/view_count.svg`} width="16" height="16" alt="view"/>{replyData.view_count}

									
									

									
								</td>
								<td className='text' style={{width: "5%"}}>
								
									<div className="dropdown">
										<button type="button" className="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">︙</button>
										<div className="dropdown-menu">
										{replyData.owner.id === myUserDataGlobal.id && (
											<>
												<ModalAddUserToList className={"dropdown-item"} id={replyData.owner.id}/>
												<button className="dropdown-item" style={{cursor:"pointer"}} onClick={() => handlePostDelete(replyData.id)}>ポストを削除する</button>
											</>
										)}
										{replyData.owner.id !== myUserDataGlobal.id && (
											<>
												<ModalAddUserToList className={"dropdown-item"} id={replyData.owner.id}/>
												<button className="dropdown-item" style={{cursor:"pointer"}} onClick={() => handleFollow(replyData.owner.id,ix)}>
													{myUserDataGlobal.following.includes(replyData.owner.id) ? "フォローを解除する" : "フォローする"}
												</button>
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
	  );
}

export default Home;