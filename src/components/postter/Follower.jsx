import React, { useEffect, useState ,useContext } from 'react';
import { Link,useLocation } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { getFollowData } from "./GetFollowData"
import { getUserData } from "./GetUserData"
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;


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
			refreshFollow()
		}else{
			setMessages(res);
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

	const getUidUserData = () => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		})
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
		setMessages("")
		getUidUserData()
		refreshFollow()
		},[location.pathname])

	

	if(!myUserDataGlobal || !userData || !posts){
		return("loading...")
	}

	return (
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					
					
					<p class="mb-0"><b>{userData.username}</b></p>
					<p class="text-secondary">@{userData.uid}</p>

					<p class="mt-3 mb-3">フォロワー</p>
				<div class="table table-responsive">
					<table id='post_list' class="table-sm" style={{width: "100%"}}>
						<tbody>
						<InfiniteScroll
								loadMore={loadFollow}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{posts.map((postData,ix) => (
								<tr class="text" key={ix}>
								<td class="text" style={{width: "15%"}}>
									<img class="rounded img-fluid mx-auto d-block" src={`${baseUrl}${postData.follower.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
								</td>
								<td class="text" style={{width: "80%"}}>
									<h6>
										<Link to={`/postter/${postData.follower.uid}/`}><b>{postData.follower.username}</b></Link>
										<span class="ml-1 text-secondary">@{postData.follower.uid}</span>
									</h6>
									<p>{postData.follower.profile_statement}</p>
								</td>
								<td class='text' style={{width: "5%"}}>
									<div class="dropdown">
										<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">︙</button>
										<div class="dropdown-menu">
										{postData.follower.id == myUserDataGlobal.id && (
											<>

											</>
										)}
										{postData.follower.id !== myUserDataGlobal.id && (
											<>
												<a class="dropdown-item" style={{cursor:"pointer"}}>このユーザーをリストに追加/削除</a>
												<a class="dropdown-item" style={{cursor:"pointer"}} onClick={() => handleFollow(postData.follower.id)}>
													{myUserDataGlobal.following.includes(postData.follower.id) ? "このユーザーのフォローを解除する" : "このユーザーをフォローする"}
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