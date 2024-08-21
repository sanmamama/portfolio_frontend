import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import {NotificationContext} from "./providers/NotificationProvider"
import { getUserData } from "./GetUserData"
import InfiniteScroll from 'react-infinite-scroller';
import PostContent from './PostContent';
import ModalAddUserToList from './ModalAddUserToList';
import ModalCreateReplyButton from './ModalCreateReplyButton';
import { loginCheck } from './LoginCheck';
import { notificationCheck } from './NotificationCheck';
import { useNavigate } from "react-router-dom";


const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;

const Home = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const {setMyNotificationGlobal} = useContext(NotificationContext);
	const [formData, setFormData] = useState({
        content: ''
    });
	const [messages, setMessages] = useState("");
    const [setErrors] = useState("");
	const [posts, setPosts] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const navigate = useNavigate();

	//ログインチェック
	useEffect(()=>{
		loginCheck(myUserDataGlobal,setMyUserDataGlobal,navigate)
		notificationCheck(setMyNotificationGlobal)
	},[myUserDataGlobal,setMyUserDataGlobal,setMyNotificationGlobal,navigate])

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
				//refreshPost()
                setMessages(data.detail);
            } else {
                const data = await response.json();
				if(post_reposted){
					setPosts(()=>{posts[post_ix].repost_count-=1;return posts;})
				}else{
					setPosts(()=>{posts[post_ix].repost_count+=1;return posts;})
				}
				getUserData(setMyUserDataGlobal)
				//refreshPost()
                setMessages(data.detail);
            }
        } catch (error) {

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

	//フォローハンドル
	const handleFollow = async (user_id) => {
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
			body: JSON.stringify({"following":user_id}),
        });
		const res = await response.json();
		if(response.ok){
			setMessages(`userId:${user_id}${res.message}`);
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
	const handlePostDelete = async (postId,post_ix) => {
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
			refreshPost()
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
        fetch(`${apiUrl}/postter/post/`, {
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
				refreshPost()
			}
        })
        .catch(error => {
            setErrors(error);
        });
    };
	

	const refreshPost = async() => {
		setPosts([])
		setPageCount(1)
		setHasMore(true)
	}

	const loadPost = async() => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		
		const response = await fetch(`${apiUrl}/postter/post/?page=${pageCount}`,
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
			setHasMore(data.next === "true")
			setPageCount(pageCount+1)
		}
	}
	

	if(!myUserDataGlobal || !posts){
		return("loading...")
	}

	return (
		<div className="col-sm-6 pl-0 pr-0">
			<div className="card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					
					<form method="post" onSubmit={handlePostSubmit}>
						<textarea className="form-control" type="textarea" name="content" value={formData.content} onChange={handlePostChange} placeholder="いまなにしてる？"/>
						<button type="submit" className="mb-2 mt-2 btn btn-outline-primary btn-block">投稿する</button>
					</form>

					<div className="">
							<InfiniteScroll
								loadMore={loadPost}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{posts.map((postData,ix) => (

								<div className="container" key={ix}>
									<div className="row pb-2 pt-1">
										{postData.repost_user && (
											<>
												<div className="col-1 text-right">
													
												</div>
												<div className="col-11 pl-0 pr-0" style={{fontSize:"14px"}}>
													<img className="pl-0 pr-0" src={`${baseUrl}/media/icon/repost_active.svg`} width="16" height="16" alt="repost"/>
													<Link to={`/postter/${postData.repost_user.uid}/`}>{postData.repost_user.username}</Link>がリポストしました
												</div>
											</>
										)}
										{postData.parent && (
											<>
												<div className="col-1 text-right">
													
												</div>
												<div className="col-11 pl-0 pr-0" style={{fontSize:"14px"}}>
												<img className="pl-0 pr-0" src={`${baseUrl}/media/icon/reply.svg`} width="16" height="16" alt="reply"/>
													<Link to={`/postter/post/${postData.parent}/`}>ポストID{postData.parent}</Link>へのリプライ
												</div>
											</>
										)}
									</div>
								<div className="row border-bottom">
									<div className="col pl-0 pr-0">
										<img className="rounded img-fluid mx-auto d-block" src={postData.owner.avatar_imgurl} id="avatar-image" width="40" height="40" alt="avatarimage"/>
									</div>
									<div className="col-11">

										<div className="row">
											<div className="col-10 pl-1 pr-0">
												<h6>
												<Link to={`/postter/${postData.owner.uid}/`}><b>{postData.owner.username}</b></Link>
												<span className="ml-1 text-secondary">@{postData.owner.uid}</span>
												<span className="ml-1 text-secondary">{postData.created_at.split('.')[0].replace('T',' ')}</span>
												</h6>
											</div>

											<div className="col-2 dropdown text-right pl-1 pr-0">
												<button type="button" className="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">︙</button>
												<div className="dropdown-menu">
												{postData.owner.id === myUserDataGlobal.id && (
													<>
														<ModalAddUserToList class={"dropdown-item"} id={postData.owner.id}/>
														<button className="dropdown-item" style={{cursor:"pointer"}} onClick={() => handlePostDelete(postData.id)}>ポストを削除する</button>
													</>
												)}
												{postData.owner.id !== myUserDataGlobal.id && (
													<>
														<ModalAddUserToList class={"dropdown-item"} id={postData.owner.id}/>
														<button className="btn btn-link dropdown-item" style={{cursor:"pointer"}} onClick={() => handleFollow(postData.owner.id,ix)}>
															{myUserDataGlobal.following.includes(postData.owner.id) ? "フォローを解除する" : "フォローする"}
														</button>
													</>
												)}

												</div>
											</div>
										</div>

										<div className="row">
											<div className="ml-1">
												<Link className="no-link-style" to={`/postter/post/${postData.id}/`}>	
												<p><PostContent content={postData.content}/></p>
												<p><PostContent content={postData.content_EN}/></p>
												</Link>
											</div>
										</div>

										<div className="row">
											<div className="col-3">
												<ModalCreateReplyButton refreshPost={refreshPost} postData={postData}/>
											</div>

											<div className="col-3">
												<button className="btn btn-link" style={{cursor:"pointer"}} onClick={() => handleLike(postData.id,ix,myUserDataGlobal.like.includes(postData.id))}>
												{myUserDataGlobal.like.includes(postData.id) ? <img src={`${baseUrl}/media/icon/heart_active.svg`} width="16" height="16" alt="like"/> : <img src={`${baseUrl}/media/icon/heart_no_active.svg`} width="16" height="16" alt="like"/>}{postData.like_count}
												</button>
											</div>

											<div className="col-3">
												<button className="btn btn-link" style={{cursor:"pointer"}} onClick={() => handleRepost(postData.id,ix,myUserDataGlobal.repost.includes(postData.id))}>
												{myUserDataGlobal.repost.includes(postData.id) ? <img src={`${baseUrl}/media/icon/repost_active.svg`} width="16" height="16"  alt="repost"/> : <img src={`${baseUrl}/media/icon/repost_no_active.svg`} width="16" height="16"  alt="repost"/>}{postData.repost_count}
												</button>
											</div>

											<div className="col-3">
												<div style={{padding : ".375rem .75rem" , fontSize : "16px"}}>
													<img src={`${baseUrl}/media/icon/view_count.svg`} width="16" height="16" alt="view"/>
													{postData.view_count}
												</div>
											</div>
										</div>
									</div>
								</div>	
							</div>
							))}
							</InfiniteScroll>
					</div>
				</div>
			</div>
		</div>
	  );
}

export default Home;