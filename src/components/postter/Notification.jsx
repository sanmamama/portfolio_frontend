import React, { useEffect, useState ,useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import InfiniteScroll from 'react-infinite-scroller';
import { loginCheck } from './LoginCheck';
import PostContent from './PostContent';
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

const Message = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");
	const [NotificationList, setNotificationList] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const navigate = useNavigate();

	//ログインチェック
	useEffect(()=>{
		loginCheck(setMyUserDataGlobal,navigate)
	},[])


	const refreshNotificationList = async() => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);

		const response = await fetch(`${apiUrl}/postter/message/?page=1`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Token ${token}`,
				},
			}
		)
		const data = await response.json()
		
		if(response.ok){
			setNotificationList(data.results)
			console.log(data.results)
			setHasMore(data.next)
			setPageCount(2)
		}
	}

	const loadNotificationList = async(page) => {
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
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					<h4>通知</h4>
					<div>
						<InfiniteScroll
							loadMore={loadNotificationList}
							loader={<div key={0}>Loading ...</div>}
							hasMore={hasMore}
							threshold={5} >
							{NotificationList.map((NotificationData,ix) => (
								<div>
										
											<div class="row">
												<div class="col-2">
													<img class="rounded img-fluid mx-auto d-block" src={`${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
													<p class="text-center">{NotificationData.notification_type}</p>
												</div>
												<div class="col-10">
													{NotificationData.is_read && (
														<>
															<Link class="no-link-style" to={`/postter/message/${myUserDataGlobal.id}-${NotificationData.sender.id}/`}>
															<span class="ml-1 text-secondary">{NotificationData.sender.username}</span>
															<p class="ml-1 text-secondary"><PostContent content={NotificationData.content}/></p>
															<p class="ml-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
															</Link>
														</>
													)}

													{!NotificationData.is_read && (
														<b>
															<Link class="no-link-style" to={`/postter/message/${myUserDataGlobal.id}-${NotificationData.sender.id}/`}>
															<span class="ml-1 text-secondary">{NotificationData.sender.username}</span>												
															<p class="ml-1 text-secondary">{NotificationData.content}</p>
															<p class="ml-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
															</Link>
														</b>
													)}
													

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

export default Message;