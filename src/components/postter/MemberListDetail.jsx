import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"
import InfiniteScroll from 'react-infinite-scroller';
import PostContent from './PostContent';
import { useParams } from 'react-router-dom';

const Message = () => {
	const { id } = useParams();
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [formData, setFormData] = useState({
        content: ''
    });
	const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");
	const [userList, setUserList] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [targetListData, setTargetListData] = useState(null);
	
	//フォローハンドル
	const handleFollow = async (user_id) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        const response = await fetch(`http://127.0.0.1:8000/api/postter/follow/`, {
            method: 'POST',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            },
			body: JSON.stringify({"following":user_id}),
        });
		const res = await response.json();
		if(response.ok){
			setMessages(`userId:${user_id}${res.message}`);
			getUserData(setMyUserDataGlobal)
			refreshMessageList()
			
		}else{
			setMessages(`userId:${user_id}${res}`);
		}
        
    };

	const refreshMessageList = async() => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);

		const response = await fetch(`http://localhost:8000/api/postter/listdetail/${id}/`,
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
		

		const response = await fetch(`http://localhost:8000/api/postter/listdetail/${id}/`,
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

	useEffect(()=>{
		const getTargetListData = () => {
			const token = document.cookie.split('; ').reduce((acc, row) => {
				const [key, value] = row.split('=');
				if (key === 'token') {
				acc = value;
				}
				return acc;
			}, null);
			fetch(`http://localhost:8000/api/postter/memberlist/?id=${id}`,
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
				setTargetListData(data.results[0])
				})
			.catch(error => {
			});
		}
		getTargetListData()
	},[])
	

	if(!myUserDataGlobal || !userList || !targetListData){
		return("loading...")
	}

	return (
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
				
					<p>{targetListData.name}</p>
					<p>{targetListData.description}</p>
				<div class="table table-responsive">
					<table id='post_list' class="table-sm" style={{width: "100%"}}>
						<tbody>
							<InfiniteScroll
								loadMore={loadMessageList}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{userList.map((ListData,ix) => (
								<tr class="text" key={ix}>
								<td class="text" style={{width: "15%"}}>
									<img class="rounded img-fluid mx-auto d-block" src={ListData.user.avatar_imgurl} id="avatar-image" width="40" height="40"/>
								</td>
								<td class="text" style={{width: "80%"}}>
									<h6>
										<Link to={`/postter/${ListData.user.uid}/`}><b>{ListData.user.username}</b></Link>
										<span class="ml-1 text-secondary">@{ListData.user.uid}</span>
									</h6>
									<p>{ListData.user.profile_statement}</p>
								</td>
								<td class='text' style={{width: "5%"}}>
									<div class="dropdown">
										<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">︙</button>
										<div class="dropdown-menu">
										{ListData.user.id == myUserDataGlobal.id && (
											<>

											</>
										)}
										{ListData.user.id !== myUserDataGlobal.id && (
											<>
												<a class="dropdown-item" style={{cursor:"pointer"}}>このユーザーをリストから削除</a>
												<a class="dropdown-item" style={{cursor:"pointer"}} onClick={() => handleFollow(ListData.id)}>
													{myUserDataGlobal.following.includes(ListData.user.id) ? "このユーザーのフォローを解除する" : "このユーザーをフォローする"}
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

export default Message;