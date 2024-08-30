import React, { useEffect, useState ,useContext } from 'react';
import { Link} from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import ModalAddUserToList from './ModalAddUserToList';
import { useTranslation } from 'react-i18next';
const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;


const Home = () => {
	const { i18n,t } = useTranslation();
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
                'accept-language':i18n.language,
            },
			body: JSON.stringify({"following":following_id}),
        });
		const res = await response.json();
		if(response.ok){
			if(res.actionType === "follow"){
				setMessages(`フォローしました`);
			}else{
				setMessages(`フォローを解除しました`);
			}
			getUserData(setMyUserDataGlobal)
			refreshFollow()
		}
    };

	const loadFollow = async(page) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		

		const response = await fetch(`${apiUrl}/postter/follow/${uid}/follower/?page=${pageCount}`,
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

	const refreshFollow = async() => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);

		const response = await fetch(`${apiUrl}/postter/follow/${uid}/follower/?page=1`,
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
			setHasMore(data.next)
			setPageCount(2)
		}
	}

	


	useEffect(() => {
		const getUidUserData = () => {
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

		getUidUserData()
		//refreshFollow()
		},[uid])

	

	if(!myUserDataGlobal || !userData){
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
					
					
					<p className="mb-0"><b>{userData.username}</b></p>
					<p className="text-secondary">@{userData.uid}</p>

					<p className="mt-3 mb-3">{t('follower')}</p>
				<div className="table table-responsive">
					<table id='post_list' className="table-sm" style={{width: "100%"}}>
						<tbody>
						<InfiniteScroll
								loadMore={loadFollow}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{posts.map((postData,ix) => (
								<tr className="text" key={ix}>
								<td className="text" style={{width: "15%"}}>
									<img className="rounded img-fluid mx-auto d-block" src={`${baseUrl}${postData.follower.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
								</td>
								<td className="text" style={{width: "80%"}}>
									<h6>
										<Link to={`/postter/${postData.follower.uid}/`}><b>{postData.follower.username}</b></Link>
										<span className="ms-1 text-secondary">@{postData.follower.uid}</span>
									</h6>
									<p>{postData.follower.profile_statement}</p>
								</td>
								<td className='text' style={{width: "5%"}}>
									<div className="dropdown">
										<button type="button" className="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">︙</button>
										<div className="dropdown-menu">
										{postData.follower.id === myUserDataGlobal.id && (
											<>
											<ModalAddUserToList t={t} class={"dropdown-item"} id={postData.follower.id}/>
											</>
										)}
										{postData.follower.id !== myUserDataGlobal.id && (
											<>
												<ModalAddUserToList t={t} class={"dropdown-item"} id={postData.follower.id}/>
												<button className="dropdown-item btn btn-link" style={{cursor:"pointer"}} onClick={() => handleFollow(postData.follower.id)}>
													{myUserDataGlobal.following.includes(postData.follower.id) ? t('do_unfollow') : t('do_follow')}
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
	  );
}

export default Home;