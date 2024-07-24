import React, { useEffect, useState ,useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import InfiniteScroll from 'react-infinite-scroller';
const apiUrl = process.env.REACT_APP_API_URL;

const Message = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");
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


	const refreshMessageList = async() => {
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
			setUserList(data.results)
			console.log(data.results)
			setHasMore(data.next)
			setPageCount(2)
		}
	}

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
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					<h4>新規メッセージ</h4>
					<input class="mt-3 mb-3 form-control" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ユーザーを検索"/>
					<div>
						{results.map((result) => (
							<>
							{result.id != myUserDataGlobal.id && query && (
								<Link class="no-link-style" to={`/postter/message/${myUserDataGlobal.id}-${result.id}/`}>
								<div class="row">
									<div class="col-2">
										<img class="rounded img-fluid mx-auto d-block" src={`${result.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
									</div>
									<div class="col-10">
										<b>{result.username}</b>
										<span class="ml-1 text-secondary">@{result.uid}</span>
										<p class="mt-2 text-secondary">{result.profile_statement}</p>
									</div>
								</div>
								</Link>
							)}
							</>
					))}
					</div>
					<h4 class="mt-3 mb-3">過去のメッセージ</h4>
					<div>
						<InfiniteScroll
							loadMore={loadMessageList}
							loader={<div key={0}>Loading ...</div>}
							hasMore={hasMore}
							threshold={5} >
							{userList.map((MessageData,ix) => (
								<div>
									{MessageData.user_from.id == myUserDataGlobal.id && (
										<Link class="no-link-style" to={`/postter/message/${myUserDataGlobal.id}-${MessageData.user_to.id}/`}>
											<div class="row">
												<div class="col-2">
													<img class="rounded img-fluid mx-auto d-block" src={`${MessageData.user_to.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
												</div>
												<div class="col-10">
													<b>{MessageData.user_to.username}</b>
													<span class="ml-1 text-secondary">@{MessageData.user_to.uid}</span>
													<span class="ml-1 text-secondary">{MessageData.created_at.split('.')[0].replace('T',' ')}</span>
													<p class="mt-2 text-secondary">{MessageData.content}</p>
												</div>
											</div>
										</Link>
									)}
									
									{MessageData.user_to.id == myUserDataGlobal.id && (
										<Link class="no-link-style" to={`/postter/message/${myUserDataGlobal.id}-${MessageData.user_from.id}/`}>
										<div class="row">
											<div class="col-2">
												<img class="rounded img-fluid mx-auto d-block" src={`${MessageData.user_from.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
											</div>
											<div class="col-10">
												<b>{MessageData.user_from.username}</b>
												<span class="ml-1 text-secondary">@{MessageData.user_from.uid}</span>
												<span class="ml-1 text-secondary">{MessageData.created_at.split('.')[0].replace('T',' ')}</span>
												<p class="mt-2 text-secondary">{MessageData.content}</p>
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
		</div>
	  );
}

export default Message;