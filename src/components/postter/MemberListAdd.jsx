import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ModalCreateListButton from './ModalCreateListButton';

const apiUrl = process.env.REACT_APP_API_URL;

const Message = () => {
	const { t } = useTranslation();
	const id = parseInt(useParams().id, 10);

	const {myUserDataGlobal} = useContext(UserDataContext);
	const [messages, setMessages] = useState("");
	const [userList, setUserList] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);



	//toast
	useEffect(()=>{
		if(messages !== ""){
			const toastBootstrap = window.bootstrap.Toast.getOrCreateInstance(document.getElementById('liveToast'))
			toastBootstrap.show()
		}
	},[messages])
	
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
			<div className="card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
					
					<div className="toast-container position-fixed">
						<div id="liveToast" className="toast position-fixed top-0 start-50 translate-middle-x m-1" role="alert" aria-live="assertive" aria-atomic="true">
							<div className="toast-body">
								{messages}
							</div>
						</div>
					</div>

					<h4>{t("select_list")}</h4>
					<ModalCreateListButton t={t} userList={userList} setUserList={setUserList}/>					
					<div className="table table-responsive">

					<table className="table">
						<tbody>
							<InfiniteScroll
								loadMore={loadMessageList}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{userList.map((ListData,ix) => (
								<tr className="text" key={ix}>
									<td>
										<div>
											<h6>
												<p><span><b><Link to={`/postter/memberlist/${ListData.id}/`}>{ListData.name}</Link></b></span><span className="ms-3 text-secondary">{ListData.user_ids.length}{t("member_count")}</span></p>
												<p><span className="ms-1 text-secondary">{ListData.description}</span></p>
												<p className="mt-2 text-secondary">{}</p>
											</h6>
										</div>
									</td>
									<td>
										<button style={{cursor:"pointer"}} onClick={() => handleAddMember(id,ListData.id)}>
											{ListData.user_ids.includes(id) ? t("unregister") : t("register")}
														
										</button>
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

export default Message;