import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"
import InfiniteScroll from 'react-infinite-scroller';
import PostContent from './PostContent';

const Message = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [formData, setFormData] = useState({
        content: ''
    });
	const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");
	const [userList, setUserList] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	

	const refreshMessageList = async() => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);

		const response = await fetch(`http://localhost:8000/api/postter/message/?page=1`,
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
		

		const response = await fetch(`http://localhost:8000/api/postter/message/?page=${pageCount}`,
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
					
				<div class="table table-responsive">
					<table id='post_list' class="table-sm" style={{width: "100%"}}>
						<tbody>
							<InfiniteScroll
								loadMore={loadMessageList}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{userList.map((MessageData,ix) => (
								<tr class="text" key={ix} style={{width: "100%"}}>
									{MessageData.user_from.id == myUserDataGlobal.id && (
									<>
	
										
										<td class="text" style={{width: "15%"}}>
											<img class="rounded img-fluid mx-auto d-block" src={`${MessageData.user_to.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
										</td>
										<td class="text" style={{width: "80%"}}>
										<Link to={`/postter/message/${myUserDataGlobal.id}-${MessageData.user_to.id}/`}>
											<div>
											<h6>
												<b>{MessageData.user_to.username}</b>
												<span class="ml-1 text-secondary">@{MessageData.user_to.uid}</span>
												<p class="mt-2 text-secondary">{MessageData.content}</p>
											</h6>
											</div>
											</Link>
										</td>
										<td class='text' style={{width: "5%"}}>

										</td>
										
										
									</>
									)}
									
									{MessageData.user_to.id == myUserDataGlobal.id && (
									<>
										
										
										<td class="text" style={{width: "15%"}}>
											<img class="rounded img-fluid mx-auto d-block" src={`${MessageData.user_from.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
										</td>
										<td class="text" style={{width: "80%"}}>
										<Link to={`/postter/message/${myUserDataGlobal.id}-${MessageData.user_from.id}/`}>
										<div>
											<h6>
												<b>{MessageData.user_from.username}</b>
												<span class="ml-1 text-secondary">@{MessageData.user_from.uid}</span>
												<p class="mt-2 text-secondary">{MessageData.content}</p>
											</h6>
											</div>
											</Link>
										</td>
										<td class='text' style={{width: "5%"}}>

										</td>
										
										
									</>
									)}
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

export default Message;