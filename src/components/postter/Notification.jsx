import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import InfiniteScroll from 'react-infinite-scroller';
import { loginCheck } from './LoginCheck';
import PostContent from './PostContent';
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

const Message = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [NotificationList, setNotificationList] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const navigate = useNavigate();

	//ログインチェック
	useEffect(()=>{
		loginCheck(myUserDataGlobal,setMyUserDataGlobal,navigate)
	},[myUserDataGlobal,setMyUserDataGlobal,navigate])


	// const refreshNotificationList = async() => {
	// 	const token = document.cookie.split('; ').reduce((acc, row) => {
	// 		const [key, value] = row.split('=');
	// 		if (key === 'token') {
	// 		acc = value;
	// 		}
	// 		return acc;
	// 	}, null);

	// 	const response = await fetch(`${apiUrl}/postter/message/?page=1`,
	// 		{
	// 			method: 'GET',
	// 			headers: {
	// 				'Authorization': `Token ${token}`,
	// 			},
	// 		}
	// 	)
	// 	const data = await response.json()
		
	// 	if(response.ok){
	// 		setNotificationList(data.results)
	// 		console.log(data.results)
	// 		setHasMore(data.next)
	// 		setPageCount(2)
	// 	}
	// }

	const loadNotificationList = async() => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		

		const response = await fetch(`${apiUrl}/postter/notification/?page=${pageCount}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Token ${token}`,
				},
			}
		)
		const data = await response.json()
		
		if(response.ok){		
			setNotificationList([...NotificationList, ...data.results])
			setHasMore(data.next)
			setPageCount(pageCount+1)
		}
	}
	

	if(!myUserDataGlobal || !NotificationList){
		return("loading...")
	}

	return (
		<div className="col-sm-6 pl-0 pr-0">
			<div className="card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
					<h4>通知</h4>
					<div>
						<InfiniteScroll
							loadMore={loadNotificationList}
							loader={<div key={0}>Loading ...</div>}
							hasMore={hasMore}
							threshold={5} >
							{NotificationList.map((NotificationData,ix) => (
								<div>
												
									{NotificationData.notification_type === "follow" && (
										<>
											<Link className="no-link-style" to={`/postter/${NotificationData.sender.uid}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
													<p className="text-center">{NotificationData.notification_type}</p>
												</div>
											<div className="col-10">
											
											<p className="ml-1"><b>{NotificationData.sender.username}</b>さんにフォローされました</p>
											<p className="ml-1 text-secondary"><PostContent content={NotificationData.content}/></p>
											<p className="ml-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
											
												</div>
											</div>
											</Link>
										</>
									)}
									{NotificationData.notification_type === "like" && (
										<>
											<Link className="no-link-style" to={`/postter/post/${NotificationData.post}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
													<p className="text-center">{NotificationData.notification_type}</p>
												</div>
											<div className="col-10">
											
											<p className="ml-1"><b>{NotificationData.sender.username}</b>さんにいいねされました</p>
											<p className="ml-1 text-secondary"><PostContent content={NotificationData.content}/></p>
											<p className="ml-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
											
											</div>
										</div>
										</Link>
										</>
									)}
									{NotificationData.notification_type === "repost" && (
										<>
											<Link className="no-link-style" to={`/postter/post/${NotificationData.post}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
													<p className="text-center">{NotificationData.notification_type}</p>
												</div>
											<div className="col-10">
											
											<p className="ml-1"><b>{NotificationData.sender.username}</b>さんにリポストされました</p>
											<p className="ml-1 text-secondary"><PostContent content={NotificationData.content}/></p>
											<p className="ml-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
											
											</div>
										</div>
										</Link>
										</>
									)}
									{NotificationData.notification_type === "mention" && (
										<>
											<Link className="no-link-style" to={`/postter/post/${NotificationData.post}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
													<p className="text-center">{NotificationData.notification_type}</p>
												</div>
											<div className="col-10">
											
											<p className="ml-1"><b>{NotificationData.sender.username}</b>さんからメンションを受け取りました</p>
											<p className="ml-1 text-secondary"><PostContent content={NotificationData.content}/></p>
											<p className="ml-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
											
											</div>
										</div>
										</Link>
										</>
									)}
									{NotificationData.notification_type === "message" && (
										<>
										<Link className="no-link-style" to={`/postter/message/${myUserDataGlobal.id}-${NotificationData.sender.id}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
													<p className="text-center">{NotificationData.notification_type}</p>
												</div>
											<div className="col-10">
											<p className="ml-1"><b>{NotificationData.sender.username}</b>さんからダイレクトメッセージを受け取りました</p>
											<p className="ml-1 text-secondary"><PostContent content={NotificationData.content}/></p>
											<p className="ml-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
											
											</div>
										</div>
										</Link>
										</>
									)}
									{NotificationData.notification_type === "reply" && (
										<>
											<Link className="no-link-style" to={`/postter/post/${NotificationData.parent}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
													<p className="text-center">{NotificationData.notification_type}</p>
												</div>
											<div className="col-10">
											<p className="ml-1"><b>{NotificationData.sender.username}</b>さんにリプライされました</p>
											<p className="ml-1 text-secondary"><PostContent content={NotificationData.content}/></p>
											<p className="ml-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
											
											</div>
										</div>
										</Link>
										</>
									)}

								</div>
						))}
						</InfiniteScroll>
					</div>
				</div>
			</div>
		</div>
	  );
}

export default Message;