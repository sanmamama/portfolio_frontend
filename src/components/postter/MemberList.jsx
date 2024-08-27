import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import InfiniteScroll from 'react-infinite-scroller';
import ModalCreateListButton from './ModalCreateListButton';
import { loginCheck } from './LoginCheck';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
const apiUrl = process.env.REACT_APP_API_URL;

const Message = () => {
	const { t } = useTranslation();
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [userList, setUserList] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const navigate = useNavigate();

	//ログインチェック
	useEffect(()=>{
		loginCheck(myUserDataGlobal,setMyUserDataGlobal,navigate)
	},[myUserDataGlobal,setMyUserDataGlobal,navigate])


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
					<h4>{t('list')}</h4>
				<ModalCreateListButton t={t} userList={userList} setUserList={setUserList}/>					
				<div>
							<InfiniteScroll
								loadMore={loadMessageList}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{userList.map((ListData,ix) => (
									<div key={ix}>
										<Link className="no-link-style" to={`/postter/memberlist/${ListData.id}/`}>
										<div className="col" key={ix}>
											<div className="row">
														<p><span><b>{ListData.name}</b></span><span className="ms-3 text-secondary">{ListData.user_ids.length}{t("member_count")}</span></p>
											</div>
											<div className="row">
											<p><span className="ms-1 text-secondary">{ListData.description}</span></p>
											</div>
										</div>
										</Link>
									</div>
							))}
							</InfiniteScroll>
				</div>
				</div>
			</div>

	  );
}

export default Message;