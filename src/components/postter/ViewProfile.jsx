import React, { useEffect, useState ,useContext } from 'react';
import { Link,useLocation } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { loginCheck } from './LoginCheck';
import { useNavigate } from "react-router-dom";
import { getUserData } from "./GetUserData"
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import ModalEditProfileButton from './ModalEditProfileButton';
import PostContainer from './PostContainer';
const apiUrl = process.env.REACT_APP_API_URL;
//const baseUrl = process.env.REACT_APP_BASE_URL;


const Home = () => {
	const location = useLocation();
	const { uid } = useParams();
	
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);

	const [userData,setUserData] = useState(null);

	const [messages, setMessages] = useState("");

	const [posts, setPosts] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const refreshPost = ()=>{
		setPosts([])
		setPageCount(1)
		setHasMore(true)
	}
	const navigate = useNavigate();

	//ログインチェック
	useEffect(()=>{
		loginCheck(myUserDataGlobal,setMyUserDataGlobal,navigate)
	},[myUserDataGlobal,setMyUserDataGlobal,navigate])


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
			setMessages(res.actionType);
			
			if(res.actionType === "follow"){
				
				setMyUserDataGlobal(prevData => ({
					...prevData,
					following_count: prevData.following_count + 1,
					following: [...prevData.following, res.id]
				}));

				setUserData(()=>{
					userData.follower_count+=1;
					return userData
				})
				
			}else{

				setMyUserDataGlobal(prevData => ({
					...prevData,
					following_count: prevData.following_count - 1,
					following: prevData.following.filter(id => id !== res.id)
				}));

				setUserData(()=>{
					userData.follower_count-=1;
					return userData
				})
			}
			
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
		

		const response = await fetch(`${apiUrl}/postter/post/user/${uid}/?page=${pageCount}`,
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
			setHasMore(!!data.next)
			setPageCount(pageCount+1)
		}
	}


	


	useEffect(() => {
		const getTargetUserData = () => {
			const token = document.cookie.split('; ').reduce((acc, row) => {
				const [key, value] = row.split('=');
				if (key === 'token') {
				acc = value;
				}
				return acc;
			}, null);
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
		getTargetUserData()
		setPosts([])
		setPageCount(1)
		setHasMore(true)
		},[location.pathname,uid])

	

	

	if(!myUserDataGlobal || !userData || !posts){
		return("loading...")
	}

	return (
		<div className="col-sm-6 pl-0 pr-0">
			<div className="card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					<img className="rounded img-fluid mx-auto d-block" src={`${userData.avatar_imgurl}`} id="avatar-image" width="150" height="150" alt="avatarimage"/>
					
					<p className="mb-0"><b>{userData.username}</b></p>
					<p className="text-secondary">@{userData.uid}</p>
					<p> {userData.profile_statement} </p>
					<p>
					<span className="mr-3"><b>{ userData.post_count }</b>ポスト</span>
					<span className="mr-3"><Link to={`/postter/${userData.uid}/following/`}><b>{ userData.following_count }</b>フォロー</Link></span>
					<span className="mr-3"><Link to={`/postter/${userData.uid}/follower/`}><b>{ userData.follower_count }</b>フォロワー</Link></span>
					</p>

					{userData.id !== myUserDataGlobal.id && (
						<p className="mt-3 mb-3"><button className="btn btn-outline-success btn-sm" style={{cursor:"pointer"}} onClick={() => handleFollow(userData.id)}>
						{myUserDataGlobal.following.includes(userData.id) ? "フォローを解除" : "フォローする"}
						</button></p>
					)}
					{userData.id === myUserDataGlobal.id && (
						<>

					<ModalEditProfileButton uid={myUserDataGlobal.uid} username={myUserDataGlobal.username} profile_statement={myUserDataGlobal.profile_statement}
						setMyUserDataGlobal={setMyUserDataGlobal} setUserData={setUserData}
					/>
					    </>
					)}
					
					<p className="mt-3 mb-3"><Link className="btn btn-outline-success btn-sm" to={`/postter/add_member/${userData.id}/`}>リスト操作</Link></p>
					<div className="">
						<InfiniteScroll
								loadMore={loadPost}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{posts.map((postData,ix) => (
									<div className="container" key={ix}>
										<PostContainer
										postData={postData}
										myUserDataGlobal={myUserDataGlobal}
										posts={posts}
										setPosts={setPosts}
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
			</div>
		</div>
	  );
}

export default Home;