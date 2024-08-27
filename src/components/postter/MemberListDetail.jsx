import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from 'react-router-dom';
import ModalEditListButton from './ModalEditListButton';
import { loginCheck } from './LoginCheck';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const apiUrl = process.env.REACT_APP_API_URL;

const Message = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams();
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [messages, setMessages] = useState("");
	const [userList, setUserList] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [targetListData, setTargetListData] = useState(null);

	//ログインチェック
	useEffect(()=>{
		loginCheck(myUserDataGlobal,setMyUserDataGlobal,navigate)
	},[myUserDataGlobal,setMyUserDataGlobal,navigate])

	//toast
	useEffect(()=>{
		if(messages !== ""){
			const toastBootstrap = window.bootstrap.Toast.getOrCreateInstance(document.getElementById('liveToast'))
			toastBootstrap.show()
		}
	},[messages])

	//リストをモーダルウインドウで削除後のナビゲート
	const navigateListView = () =>{
		navigate("/postter/memberlist/")
	}
	
	//リストからユーザー削除ハンドル
	const handleDelete = async (list_id,user_id) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        const response = await fetch(`${apiUrl}/postter/listdetail/delete/?list_id=${list_id}&user_id=${user_id}`, {
            method: 'DELETE',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            },
        });
		if(response.ok){
			setMessages(`deleted`);
			refreshMemberList()
			
		}else{
			setMessages(`delete failed`);
		}
        
    };

	//フォローハンドル
	const handleFollow = async (user_id) => {
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
			body: JSON.stringify({"following":user_id}),
        });
		const res = await response.json();
		if(response.ok){
			setMessages(`userId:${user_id}${res.message}`);
			getUserData(setMyUserDataGlobal)
			refreshMemberList()
			
		}else{
			setMessages(`userId:${user_id}${res}`);
		}
        
    };

	const refreshMemberList = async() => {
		setUserList([])
		setPageCount(1)
		setHasMore(true)
	}
	

	const loadMessageList = async(page) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		

		const response = await fetch(`${apiUrl}/postter/listdetail/${id}/`,
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
			fetch(`${apiUrl}/postter/memberlist/?id=${id}`,
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
	},[id])
	

	if(!myUserDataGlobal || !userList || !targetListData){
		return("loading...")
	}

	return (
			<div className="card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
					
					<div class="toast-container position-fixed">
						<div id="liveToast" class="toast position-fixed top-0 start-50 translate-middle-x m-1" role="alert" aria-live="assertive" aria-atomic="true">
							<div class="toast-body">
								{messages}
							</div>
						</div>
					</div>

					<Link to="/postter/memberlist">←{t("message_list")}</Link>
					<p className="mt-3">{targetListData.name}</p>
					<p>{targetListData.description}</p>

					<ModalEditListButton  t={t} id={id} name={targetListData.name} description={targetListData.description} setTargetListData={setTargetListData} navigateListView={navigateListView}/>
					
					<div className="table table-responsive mt-3">
					<table id='post_list' className="table-sm" style={{width: "100%"}}>
						<tbody>
							<InfiniteScroll
								loadMore={loadMessageList}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{userList.map((ListData,ix) => (
								<tr className="text" key={ix}>
								<td className="text" style={{width: "15%"}}>
									<img className="rounded img-fluid mx-auto d-block" src={ListData.user.avatar_imgurl} id="avatar-image" width="40" height="40" alt="avatarimage"/>
								</td>
								<td className="text" style={{width: "80%"}}>
									<h6>
										<Link to={`/postter/${ListData.user.uid}/`}><b>{ListData.user.username}</b></Link>
										<span className="ms-1 text-secondary">@{ListData.user.uid}</span>
									</h6>
									<p>{ListData.user.profile_statement}</p>
								</td>
								<td className='text' style={{width: "5%"}}>
									<div className="dropdown">
										<button type="button" className="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">︙</button>
										<div className="dropdown-menu">
										{ListData.user.id === myUserDataGlobal.id && (
											<>
												<button className="dropdown-item" style={{cursor:"pointer"}} onClick={() => handleDelete(id,ListData.user.id)}>このユーザーをリストから削除</button>
											</>
										)}
										{ListData.user.id !== myUserDataGlobal.id && (
											<>
												<button className="dropdown-item" style={{cursor:"pointer"}} onClick={() => handleDelete(id,ListData.user.id)}>このユーザーをリストから削除</button>
												<button className="dropdown-item" style={{cursor:"pointer"}} onClick={() => handleFollow(ListData.user.id)}>
													{myUserDataGlobal.following.includes(ListData.user.id) ? t("unfollow") : t("follow")}
												</button>
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
	  );
}

export default Message;