import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"
import InfiniteScroll from 'react-infinite-scroller';
import PostContent from './PostContent';
import { loginCheck } from './LoginCheck';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import ModalAddUserToList from './ModalAddUserToList';
const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
	const query = useQuery();
	const q = query.get('q');
	//const { q } = useParams();
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [messages, setMessages] = useState("");
	const [posts, setPosts] = useState([]);
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


	const refreshPost = async() => {
		setPosts([])
		setPageCount(1)
		setHasMore(true)
	}

	const loadPost = async(page) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		

		const response = await fetch(`${apiUrl}/postter/post/?q=${q}&page=${pageCount}`,
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

	useEffect(()=>{
		refreshPost()
	},[q])
	

	if(!myUserDataGlobal || !posts){
		return("loading...")
	}

	return (
		<div className="col-sm-6 pl-0 pr-0">
			<div className="card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
					<p>「{q}」で検索中</p>
					{messages}
				<div className="table table-responsive">
					<table id='post_list' className="table-sm" style={{width: "100%"}}>
						<tbody>
							<InfiniteScroll
								
								loadMore={loadPost}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{posts.map((postData,ix) => (
								<tr className="text" key={ix}>
								<td className="text" style={{width: "15%"}}>
									<img className="rounded img-fluid mx-auto d-block" src={postData.owner.avatar_imgurl} id="avatar-image" width="40" height="40" alt="avatarimage"/>
								</td>
								<td className="text" style={{width: "80%"}}>
									<h6>
										<Link to={`/postter/${postData.owner.uid}/`}><b>{postData.owner.username}</b></Link>
										<span className="ml-1 text-secondary">@{postData.owner.uid}</span>
										<span className="ml-1 text-secondary">{postData.created_at.split('.')[0].replace('T',' ')}</span>
									</h6>
									<p><PostContent content={postData.content}/></p>

									<button className="mr-4 btn btn-link" style={{cursor:"pointer"}} onClick={() => handleLike(postData.id,ix,myUserDataGlobal.like.includes(postData.id))}>
									{myUserDataGlobal.like.includes(postData.id) ? <img src={`${baseUrl}/media/icon/heart_active.svg`} width="16" height="16" alt="like"/> : <img src={`${baseUrl}/media/icon/heart_no_active.svg`} width="16" height="16" alt="like"/>}{postData.like_count}
									</button>
									
									<button className="mr-4 btn btn-link" style={{cursor:"pointer"}} onClick={() => handleRepost(postData.id,ix,myUserDataGlobal.repost.includes(postData.id))}>
									{myUserDataGlobal.repost.includes(postData.id) ? <img src={`${baseUrl}/media/icon/repost_active.svg`} width="16" height="16" alt="repost"/> : <img src={`${baseUrl}/media/icon/repost_no_active.svg`} width="16" height="16" alt="repost"/>}{postData.repost_count}
									</button>

									<img src={`${baseUrl}/media/icon/view_count.svg`} width="16" height="16" alt="view"/>{postData.view_count}
									
								</td>
								<td className='text' style={{width: "5%"}}>
									<div className="dropdown">
										<button type="button" className="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">︙</button>
										<div className="dropdown-menu">
										{postData.owner.id === myUserDataGlobal.id && (
											<>
												<ModalAddUserToList class={"dropdown-item"} id={postData.owner.id}/>
												<button className="dropdown-item" onClick={() => handlePostDelete(postData.id)}>ポストを削除する</button>
											</>
										)}
										{postData.owner.id !== myUserDataGlobal.id && (
											<>
												<ModalAddUserToList class={"dropdown-item"} id={postData.owner.id}/>
												<button className="dropdown-item" style={{cursor:"pointer"}} onClick={() => handleFollow(postData.owner.id,ix)}>
													{myUserDataGlobal.following.includes(postData.owner.id) ? "フォローを解除する" : "フォローする"}
												</button>
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