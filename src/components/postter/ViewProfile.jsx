import React, { useEffect, useState ,useContext } from 'react';
import { Link,useLocation } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import ModalEditProfileButton from './ModalEditProfileButton';
import PostContainer from './PostContainer';
import { useTranslation } from 'react-i18next';
import {handleFollow} from './HandleFollow';
import ModalAddUserToList from './ModalAddUserToList';
const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;


const ViewProfile = () => {
	const { i18n,t } = useTranslation();
	const location = useLocation();
	const { uid } = useParams();
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [userData,setUserData] = useState(null);
	const [messages, setMessages] = useState("");
	const [posts, setPosts] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);



	//toast
	useEffect(()=>{
		if(messages !== ""){
			const toastBootstrap = window.bootstrap.Toast.getOrCreateInstance(document.getElementById('liveToast'))
			toastBootstrap.show()
		}
	},[messages])

	const refreshPost = ()=>{
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
			<div className="card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
					
					<div className="toast-container position-fixed">
						<div id="liveToast" className="toast position-fixed top-0 start-50 translate-middle-x m-1" role="alert" aria-live="assertive" aria-atomic="true">
							<div className="toast-body">
								{messages}
							</div>
						</div>
					</div>

					<img className="rounded img-fluid mx-auto d-block" src={`${baseUrl}${userData.avatar_imgurl}`} id="avatar-image" width="150" height="150" alt="avatarimage"/>
					
					<p className="mb-0"><b>{userData.username}</b></p>
					<p className="text-secondary">@{userData.uid}</p>
					<p> {userData.profile_statement} </p>
					<p>
					<span className="me-3"><b>{ userData.post_count }</b>{t('post')}</span>
					<span className="me-3"><Link to={`/postter/${userData.uid}/following/`}><b>{ userData.following_count }</b>{t('follow')}</Link></span>
					<span className="me-3"><Link to={`/postter/${userData.uid}/follower/`}><b>{ userData.follower_count }</b>{t('follower')}</Link></span>
					</p>

					{userData.id !== myUserDataGlobal.id && (
						<button className="btn btn-outline-success btn-sm" style={{cursor:"pointer"}} onClick={() => handleFollow(userData.id,setMessages,t,setMyUserDataGlobal,userData,setUserData,i18n.language)}>
						{myUserDataGlobal.following.includes(userData.id) ? t("do_unfollow") : t("do_follow")}
						</button>
					)}
					{userData.id === myUserDataGlobal.id && (
						<>

					<ModalEditProfileButton t={t} uid={myUserDataGlobal.uid} username={myUserDataGlobal.username} profile_statement={myUserDataGlobal.profile_statement}
						setMyUserDataGlobal={setMyUserDataGlobal} setUserData={setUserData}
					/>
					    </>
					)}
					
					<ModalAddUserToList t={t} class={"btn btn-outline-primary btn-sm mt-3 mb-3"} id={userData.id}/>

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
	  );
}

export default ViewProfile;