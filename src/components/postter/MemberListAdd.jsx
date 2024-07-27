import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from 'react-router-dom';
import { loginCheck } from './LoginCheck';
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const Message = () => {
	const id = parseInt(useParams().id, 10);

	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [formData, setFormData] = useState({
        content: ''
    });
	const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");
	const [userList, setUserList] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const navigate = useNavigate();

	//ログインチェック
	useEffect(()=>{
		loginCheck(setMyUserDataGlobal,navigate)
	},[])
	
	const handleAddMember = async (user_id,list_id) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        const response = await fetch(`${apiUrl}/postter/addmember/`, {
            method: 'POST',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            },
			body: JSON.stringify({
				"user":user_id,
				"list":list_id,
			}),
        });
		const res = await response.json();
		if(response.ok){
			setMessages(`ok`);
			refreshMessageList()
			
		}else{
			setMessages(`ng`);
			refreshMessageList()
		}
        
    };


	const refreshMessageList = async() => {
			setUserList([])
			setHasMore(true)
			setPageCount(1)
	}

	const loadMessageList = async(page) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		

		const response = await fetch(`${apiUrl}/postter/memberlist/?page=${pageCount}`,
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
					<h4>リストを選択</h4>
					<p><Link class="btn btn-sm btn-outline-primary" to="/postter/memberlist/create">新しいリストを作成</Link></p>					
					<div class="table table-responsive">

					<table class="table">
						<tbody>
							<InfiniteScroll
								loadMore={loadMessageList}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{userList.map((ListData,ix) => (
								<tr class="text" key={ix}>
									<td>
										<div>
											<h6>
												<p><span><b><Link to={`/postter/memberlist/${ListData.id}/`}>{ListData.name}</Link></b></span><span class="ml-3 text-secondary">{ListData.user_ids.length}人のメンバー</span></p>
												<p><span class="ml-1 text-secondary">{ListData.description}</span></p>
												<p class="mt-2 text-secondary">{}</p>
											</h6>
										</div>
									</td>
									<td>
										<a class="" style={{cursor:"pointer"}} onClick={() => handleAddMember(id,ListData.id)}>
											{ListData.user_ids.includes(id) ? "登録を外す" : "登録する"}
														
										</a>
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