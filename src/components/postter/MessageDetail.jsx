import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const baseUrl = process.env.REACT_APP_BASE_URL;
const apiUrl = process.env.REACT_APP_API_URL;

const Message = () => {
	const { i18n,t } = useTranslation();
	const { ids } = useParams();
	const [,toId] = ids.split('-');
	const {myUserDataGlobal} = useContext(UserDataContext);
	const [formData, setFormData] = useState({
		user_to: toId,
        content: ''
    });
	const [targetUserData, setTargetUserData] = useState(null);
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
	
	//ポストフォームチェンジ
	const handleMessageChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

	const handleMessageSubmit = (e) => {
        e.preventDefault();
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        fetch(`${apiUrl}/postter/message/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
				'accept-language':i18n.language,
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if(response.ok){
                
            }else{
                setMessages(t("message_failed_send"))
            }
            return response.json();
        })
        .then(data => {
            setFormData((prev) => ({
                ...prev,
				'content':''
            }));
			if(data.id){
				setMessages(t("message_sent"))
				refreshMessage()
			}
        })
        .catch(error => {

        });
    };

	const refreshMessage = async() => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);

		const response = await fetch(`${apiUrl}/postter/message/${toId}/?page=1`,
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
			//console.log(data.results)
			setHasMore(!!data.next)
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

		const response = await fetch(`${apiUrl}/postter/message/${toId}/?page=${pageCount}`,
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
			setHasMore(!!data.next)
			setPageCount(pageCount+1)

		}
	}

	useEffect(()=>{
		const getTargetUserData = () => {
			const token = document.cookie.split('; ').reduce((acc, row) => {
				const [key, value] = row.split('=');
				if (key === 'token') {
				acc = value;
				}
				return acc;
			}, null);
			fetch(`${apiUrl}/postter/user/?id=${toId}`,
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
				setTargetUserData(data[0])
				})
			.catch(error => {
			});
		}
		getTargetUserData()
	},[toId])

	

	

	if(!myUserDataGlobal || !userList || !targetUserData){
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

					<Link to="/postter/message">←{t("message_list")}</Link>
					<img className="rounded img-fluid mx-auto d-block" src={`${baseUrl}${targetUserData.avatar_imgurl}`} id="avatar-image" width="100" height="100" alt="avatarimage"/>
					<p className="text-center">{targetUserData.username} @{targetUserData.uid}</p>
					<p className="text-center">{targetUserData.profile_statement}</p>
					<form method="post" onSubmit={handleMessageSubmit}>
					<textarea className="form-control" type="textarea" name="content" value={formData.content} onChange={handleMessageChange} placeholder={t("enter_message")}/>
					<div class="d-grid gap-2">  
						<button type="submit" className="mb-3 mt-2 btn btn-primary">{t("send")}</button>
					</div>
                	</form>
					<div className="mt-3 mb-3 scrollable-div">
					<InfiniteScroll
						loadMore={loadMessageList}
						loader={<div key={0}>Loading ...</div>}
						hasMore={hasMore}
						threshold={5}
						useWindow={false} >
						{userList.map((MessageData,ix) => (
						<div className="" key={ix}>
							{MessageData.user_from.id === myUserDataGlobal.id && (
							<>
								<div className="row">
									<div className="col-3">
									</div>
									<div className="col-7 bg-custom-1">
										<p className="mt-2 text-end">
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
									<div className="col-2">
										<img className="rounded img-fluid mx-auto d-block" src={`${baseUrl}${MessageData.user_from.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
									</div>
								</div>
								<div className="row">
									<div className="col-3">
									</div>
									<div className="col-7">
										<p className="ms-1 text-end text-secondary">{MessageData.created_at.split('.')[0].replace('T',' ')}</p>
									</div>
									<div className="col-2">
									</div>
								</div>
							</>
							)}
							
							{MessageData.user_to.id === myUserDataGlobal.id && (
							<>
								<div className="row">
									<div className="col-2">
										<img className="rounded img-fluid mx-auto d-block" src={`${baseUrl}${MessageData.user_from.avatar_imgurl}`} id="avatar-image" width="40" height="40" alt="avatarimage"/>
									</div>
									<div className="col-7 bg-custom-2">
										<p className="mt-2">
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
									<div className="col-3">
									</div>
								</div>
								<div className="row">
									<div className="col-2">
									</div>
									<div className="col-7">
										<p className="ms-1 text-secondary">{MessageData.created_at.split('.')[0].replace('T',' ')}</p>
									</div>
									<div className="col-3">
									</div>
								</div>
							</>
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