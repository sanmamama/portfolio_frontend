import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from 'react-router-dom';
import { loginCheck } from './LoginCheck';
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

const Message = () => {
	const { ids } = useParams();
	const [fromId,toId] = ids.split('-');
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [formData, setFormData] = useState({
		user_to: toId,
        content: ''
    });
	const [targetUserData, setTargetUserData] = useState(null);
	const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");
	const [userList, setUserList] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [recipientUser, setRecipientUser] = useState(null);
	const navigate = useNavigate();

	//ログインチェック
	useEffect(()=>{
		loginCheck(setMyUserDataGlobal,navigate)
	},[])
	
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
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if(response.ok){
                
            }else{
                setMessages("メッセージの送信に失敗しました")
            }
            return response.json();
        })
        .then(data => {
            setFormData((prev) => ({
                ...prev,
				'content':''
            }));
			if(data.id){
				setMessages(`postId:${data.id}メッセージを送信しました`)
				refreshMessage()
			}
        })
        .catch(error => {
            setErrors(error);
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
			setHasMore(data.next)
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
	},[])

	

	

	if(!myUserDataGlobal || !userList || !targetUserData){
		return("loading...")
	}

	return (
		<div class="col-sm-6 pl-0 pr-0">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					{messages}
					
					<Link to="/postter/message">←メッセージ一覧へ</Link>
					<img class="rounded img-fluid mx-auto d-block" src={`${targetUserData.avatar_imgurl}`} id="avatar-image" width="100" height="100"/>
					<p class="text-center">{targetUserData.username} @{targetUserData.uid}</p>
					<p class="text-center">{targetUserData.profile_statement}</p>
					<hr class="mt-4 mb-4"/>
					<div class="mt-3 mb-3 scrollable-div">
					<InfiniteScroll
						loadMore={loadMessageList}
						loader={<div key={0}>Loading ...</div>}
						hasMore={hasMore}
						threshold={5}
						useWindow={false} >
						{userList.map((MessageData,ix) => (
						<div class="" key={ix}>
							{MessageData.user_from.id == myUserDataGlobal.id && (
							<>
								<div class="row">
									<div class="col-3">
									</div>
									<div class="col-7 bg-custom-1">
										<p class="mt-2 text-right">{MessageData.content}</p>
									</div>
									<div class="col-2">
										<img class="rounded img-fluid mx-auto d-block" src={`${MessageData.user_from.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
									</div>
								</div>
								<div class="row">
									<div class="col-3">
									</div>
									<div class="col-7">
										<p class="ml-1 text-right text-secondary">{MessageData.created_at.split('.')[0].replace('T',' ')}</p>
									</div>
									<div class="col-2">
									</div>
								</div>
							</>
							)}
							
							{MessageData.user_to.id == myUserDataGlobal.id && (
							<>
								<div class="row">
									<div class="col-2">
										<img class="rounded img-fluid mx-auto d-block" src={`${MessageData.user_from.avatar_imgurl}`} id="avatar-image" width="40" height="40"/>
									</div>
									<div class="col-7 bg-custom-2">
										<p class="mt-2">{MessageData.content}</p>
									</div>
									<div class="col-3">
									</div>
								</div>
								<div class="row">
									<div class="col-2">
									</div>
									<div class="col-7">
										<p class="ml-1 text-secondary">{MessageData.created_at.split('.')[0].replace('T',' ')}</p>
									</div>
									<div class="col-3">
									</div>
								</div>
							</>
							)}
						</div>
					))}
					</InfiniteScroll>
					</div>
					<form method="post" onSubmit={handleMessageSubmit}>
					<textarea class="form-control" type="textarea" name="content" value={formData.content} onChange={handleMessageChange} placeholder="メッセージを入力"/>   
					<button type="submit" class="mb-3 mt-2 btn btn-outline-primary btn-block">送信</button>
                </form>
				</div>
			</div>
		</div>
	  );
}

export default Message;