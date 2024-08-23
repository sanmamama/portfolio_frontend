import React, { useEffect, useState ,useContext,useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { loginCheck } from './LoginCheck';
import { useNavigate } from "react-router-dom";
import { getUserData } from "./GetUserData"
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

import PostContainer from './PostContainer';
const apiUrl = process.env.REACT_APP_API_URL;
//const baseUrl = process.env.REACT_APP_BASE_URL;


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
			if(data){
				setReplies([...replies, ...data.results])
				setHasMore(!!data.next)
				setPageCount(pageCount+1)
			}else{
				setReplies([])
				setHasMore(false)
			}
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
					<div className="container mb-1">
						<PostContainer
						postData={posts}
						myUserDataGlobal={myUserDataGlobal}
						posts={null}
						setPosts={setPosts}
						getUserData={getUserData}
						setMyUserDataGlobal={setMyUserDataGlobal}
						setMessages={setMessages}
						refreshPost={refreshPost}
						ix={-1}
						/>
					</div>
					
					
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
					
							<InfiniteScroll
								loadMore={loadReply}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{replies.map((replyData,ix) => (
									<div className="container" key={ix}>
										<PostContainer
										postData={replyData}
										myUserDataGlobal={myUserDataGlobal}
										posts={replies}
										setPosts={setReplies}
										getUserData={getUserData}
										setMyUserDataGlobal={setMyUserDataGlobal}
										setMessages={setMessages}
										refreshPost={refreshPost}
										ix={ix}
										/>
									</div>
							))}
							</InfiniteScroll>
				
				</div>
			</div>
	  );
}

export default Home;