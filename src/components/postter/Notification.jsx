import React, { useState ,useContext} from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import InfiniteScroll from 'react-infinite-scroller';
import { notificationCheck } from './NotificationCheck';
import {NotificationContext} from "./providers/NotificationProvider"
import PostContent from './PostContent';

import { useTranslation } from 'react-i18next';
const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;

const Message = () => {
	const { t,i18n } = useTranslation();
	const {myUserDataGlobal} = useContext(UserDataContext);
	const [NotificationList, setNotificationList] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const {setMyNotificationGlobal} = useContext(NotificationContext);

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
			notificationCheck(setMyNotificationGlobal)
		}
	}
	

	if(!myUserDataGlobal || !NotificationList){
		return("loading...")
	}

	return (
			<div className="card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
					<h4 className="mb-3">{t('notification')}</h4>
					{NotificationList.length ? "":t("notification_none")}
					<div>
						<InfiniteScroll
							loadMore={loadNotificationList}
							loader={<div key={0}>Loading ...</div>}
							hasMore={hasMore}
							threshold={5} >
							{NotificationList.map((NotificationData,ix) => (
								<div key={ix}>
												
									{NotificationData.notification_type === "follow" && (

											<Link className="no-link-style" to={`/postter/${NotificationData.sender.uid}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`${baseUrl}${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
													<p className="text-center">{NotificationData.notification_type}</p>
												</div>
											<div className="col-10">
											
											<p className="ms-1">{t("follow_by")}<b>{NotificationData.sender.username}</b>{t("follow_by2")}</p>
											<p className="ms-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
											
												</div>
											</div>
											</Link>

									)}
									{NotificationData.notification_type === "like" && (

											<Link className="no-link-style" to={`/postter/post/${NotificationData.post.id}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`${baseUrl}${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
													<p className="text-center">{NotificationData.notification_type}</p>
												</div>
											<div className="col-10">
											
											<p className="ms-1">{t("like_by")}<b>{NotificationData.sender.username}</b>{t("like_by2")}</p>
											<p className="ms-1 text-secondary">
												{i18n.language === "ja" ? (
													<PostContent content={NotificationData.post.content_JA} />
													) : i18n.language === "zh" ? (
													<PostContent content={NotificationData.post.content_ZH} />
													) : (
													<PostContent content={NotificationData.post.content_EN} />
												)}

												<a className="ms-1" data-bs-toggle="collapse" href={"#collapse"+ix} aria-expanded="false" aria-controls={"collapse"+ix}>
													<img src={`${baseUrl}/media/icon/original_text.svg`} width="16" height="16" alt="original_text"/>
												</a>

												<div className="collapse mt-2 " id={"collapse"+ix}>
													<div className="card card-body">
														<PostContent content={NotificationData.post.content}/>
													</div>
												</div>

											</p>
											<p className="ms-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
											
											</div>
										</div>
										</Link>

									)}
									{NotificationData.notification_type === "repost" && (

											<Link className="no-link-style" to={`/postter/post/${NotificationData.post.id}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`${baseUrl}${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
													<p className="text-center">{NotificationData.notification_type}</p>
												</div>
											<div className="col-10">
											
											<p className="ms-1">{t("repost_by")}<b>{NotificationData.sender.username}</b>{t("repost_by2")}</p>
											<p className="ms-1 text-secondary">
												{i18n.language === "ja" ? (
													<PostContent content={NotificationData.post.content_JA} />
													) : i18n.language === "zh" ? (
													<PostContent content={NotificationData.post.content_ZH} />
													) : (
													<PostContent content={NotificationData.post.content_EN} />
												)}

												<a className="ms-1" data-bs-toggle="collapse" href={"#collapse"+ix} aria-expanded="false" aria-controls={"collapse"+ix}>
												<img src={`${baseUrl}/media/icon/original_text.svg`} width="16" height="16" alt="original_text"/>
												</a>

												<div className="collapse mt-2 " id={"collapse"+ix}>
													<div className="card card-body">
														<PostContent content={NotificationData.post.content}/>
													</div>
												</div>
											</p>
											<p className="ms-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
											
											</div>
										</div>
										</Link>

									)}
									{NotificationData.notification_type === "mention" && (

											<Link className="no-link-style" to={`/postter/post/${NotificationData.post.id}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`${baseUrl}${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
													<p className="text-center">{NotificationData.notification_type}</p>
												</div>
											<div className="col-10">
											
											<p className="ms-1">{t("mention_by")}<b>{NotificationData.sender.username}</b>{t("mention_by2")}</p>
											<p className="ms-1 text-secondary">
												{i18n.language === "ja" ? (
													<PostContent content={NotificationData.post.content_JA} />
													) : i18n.language === "zh" ? (
													<PostContent content={NotificationData.post.content_ZH} />
													) : (
													<PostContent content={NotificationData.post.content_EN} />
												)}

												<a className="ms-1" data-bs-toggle="collapse" href={"#collapse"+ix} aria-expanded="false" aria-controls={"collapse"+ix}>
												<img src={`${baseUrl}/media/icon/original_text.svg`} width="16" height="16" alt="original_text"/>
												</a>

												<div className="collapse mt-2 " id={"collapse"+ix}>
													<div className="card card-body">
														<PostContent content={NotificationData.post.content}/>
													</div>
												</div>

											</p>
											<p className="ms-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
											
											</div>
										</div>
										</Link>
									)}
									{NotificationData.notification_type === "message" && (

										<Link className="no-link-style" to={`/postter/message/${myUserDataGlobal.id}-${NotificationData.sender.id}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`${baseUrl}${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
													<p className="text-center">{NotificationData.notification_type}</p>
												</div>
											<div className="col-10">
											<p className="ms-1">{t("message_by")}<b>{NotificationData.sender.username}</b>{t("message_by2")}</p>
											<p className="ms-1 text-secondary">
												{i18n.language === "ja" ? (
													<PostContent content={NotificationData.message.content_JA} />
													) : i18n.language === "zh" ? (
													<PostContent content={NotificationData.message.content_ZH} />
													) : (
													<PostContent content={NotificationData.message.content_EN} />
												)}

												<a className="ms-1" data-bs-toggle="collapse" href={"#collapse"+ix} aria-expanded="false" aria-controls={"collapse"+ix}>
													<img src={`${baseUrl}/media/icon/original_text.svg`} width="16" height="16" alt="original_text"/>
												</a>

												<div className="collapse mt-2 " id={"collapse"+ix}>
													<div className="card card-body">
														<PostContent content={NotificationData.message.content}/>
													</div>
												</div>

											</p>
											<p className="ms-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
											
											</div>
										</div>
										</Link>

									)}
									{NotificationData.notification_type === "reply" && (

											<Link className="no-link-style" to={`/postter/post/${NotificationData.parent}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`${baseUrl}${NotificationData.sender.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
													<p className="text-center">{NotificationData.notification_type}</p>
												</div>
											<div className="col-10">
											<p className="ms-1">{t("reply_by")}<b>{NotificationData.sender.username}</b>{t("reply_by2")}</p>
											<p className="ms-1 text-secondary">
												{i18n.language === "ja" ? (
													<PostContent content={NotificationData.post.content_JA} />
													) : i18n.language === "zh" ? (
													<PostContent content={NotificationData.post.content_ZH} />
													) : (
													<PostContent content={NotificationData.post.content_EN} />
												)}

												<a className="ms-1" data-bs-toggle="collapse" href={"#collapse"+ix} aria-expanded="false" aria-controls={"collapse"+ix}>
												<img src={`${baseUrl}/media/icon/original_text.svg`} width="16" height="16" alt="original_text"/>
												</a>

												<div className="collapse mt-2 " id={"collapse"+ix}>
													<div className="card card-body">
														<PostContent content={NotificationData.post.content}/>
													</div>
												</div>
											</p>
											<p className="ms-1 text-secondary">{NotificationData.created_at.split('.')[0].replace('T',' ')}</p>
											
											</div>
										</div>
										</Link>

									)}

								</div>
						))}
						</InfiniteScroll>
					</div>
				</div>
			</div>

	  );
}

export default Message;