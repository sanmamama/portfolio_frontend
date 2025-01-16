import React, { useEffect, useState ,useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import InfiniteScroll from 'react-infinite-scroller';
import { useTranslation } from 'react-i18next';
const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;

const Message = () => {
	const { t,i18n } = useTranslation();
	const {myUserDataGlobal} = useContext(UserDataContext);
	const [userList, setUserList] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	
	const [query, setQuery] = useState('');
  	const [results, setResults] = useState([]);


	
	const fetchResults = useCallback(async (searchQuery) => {
	if (searchQuery) {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);

		try {
		const response = await fetch(`${apiUrl}/postter/user/?q=${searchQuery}`,
			{
			method: 'GET',
			headers: {
				'Authorization': `Token ${token}`,
				},
			}
		);
		const data = await response.json();
		setResults(data);
		} catch (error) {
		console.error('Error fetching results:', error);
		}
	} else {
		setResults([]);
	}
	}, []);

	useEffect(() => {
	const debounceTimeout = setTimeout(() => {
		fetchResults(query);
	}, 500);

	return () => {
		clearTimeout(debounceTimeout);
	};
	}, [query, fetchResults]);


	// const refreshMessageList = async() => {
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
	// 		setUserList(data.results)
	// 		console.log(data.results)
	// 		setHasMore(data.next)
	// 		setPageCount(2)
	// 	}
	// }

	const loadMessageList = async(page) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		

		const response = await fetch(`${apiUrl}/postter/message/?page=${pageCount}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Token ${token}`,
				},
			}
		)
		const data = await response.json()
		
		if(response.ok){
			setUserList([...userList, ...data.results])
			setHasMore(data.next)
			setPageCount(pageCount+1)
		}
	}
	

	if(!myUserDataGlobal || !userList){
		return("loading...")
	}

	return (
			<div className="card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
					<h4>{t('new_message')}</h4>
					<input className="mt-3 mb-3 form-control" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search_user")}/>
					<div>
						{results.map((result,ix) => (
							<div key={ix}>
							{result.id !== myUserDataGlobal.id && query && (
								<Link className="no-link-style" to={`/postter/message/${myUserDataGlobal.id}-${result.id}/`}>
								<div className="row">
									<div className="col-2">
										<img className="rounded img-fluid mx-auto d-block" src={`${baseUrl}${result.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
									</div>
									<div className="col-10">
										<b>{result.username}</b>
										<span className="ms-1 text-secondary">@{result.uid}</span>
										<p className="mt-2 text-secondary">{result.profile_statement}</p>
									</div>
								</div>
								</Link>
							)}
							</div>
					))}
					</div>
					{userList.length ? <h4 className="mt-4 mb-3">{t("past_message")}</h4>:t("message_none")}
					<div>
						<InfiniteScroll
							loadMore={loadMessageList}
							loader={<div key={0}>Loading ...</div>}
							hasMore={hasMore}
							threshold={5} >
							{userList.map((MessageData,ix) => (
								<div key={ix}>
									{MessageData.user_from.id === myUserDataGlobal.id && (
										<Link className="no-link-style" to={`/postter/message/${myUserDataGlobal.id}-${MessageData.user_to.id}/`}>
											<div className="row">
												<div className="col-2">
													<img className="rounded img-fluid mx-auto d-block" src={`/${MessageData.user_to.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
												</div>
												<div className="col-10">
													<b>{MessageData.user_to.username}</b>
													<span className="ms-1 text-secondary">@{MessageData.user_to.uid}</span>
													<span className="ms-1 text-secondary">{MessageData.created_at.split('.')[0].replace('T',' ')}</span>
													<p className="mt-2 text-secondary">
														{i18n.language === "ja" ? (
														MessageData.content_JA
														) : i18n.language === "zh" ? (
														MessageData.content_ZH
														) : (
														MessageData.content_EN
														)}

														<a className="ms-1" data-bs-toggle="collapse" href={"#collapse"+ix} aria-expanded="false" aria-controls={"collapse"+ix}>
															<img src={`${baseUrl}/media/icon/original_text.svg`} width="16" height="16" alt="original_text"/>
														</a>
										
														<div className="collapse mt-2 " id={"collapse"+ix}>
															{MessageData.content}
														</div>

													</p>
												</div>
											</div>
										</Link>
									)}
									
									{MessageData.user_to.id === myUserDataGlobal.id && (
										<Link className="no-link-style" to={`/postter/message/${myUserDataGlobal.id}-${MessageData.user_from.id}/`}>
										<div className="row">
											<div className="col-2">
												<img className="rounded img-fluid mx-auto d-block" src={`/${MessageData.user_from.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
											</div>
											<div className="col-10">
												<b>{MessageData.user_from.username}</b>
												<span className="ms-1 text-secondary">@{MessageData.user_from.uid}</span>
												<span className="ms-1 text-secondary">{MessageData.created_at.split('.')[0].replace('T',' ')}</span>
												<p className="mt-2 text-secondary">{MessageData.content}</p>
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