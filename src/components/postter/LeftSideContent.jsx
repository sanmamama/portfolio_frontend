import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import {NotificationContext} from "./providers/NotificationProvider"
const baseUrl = process.env.REACT_APP_BASE_URL;

const LeftSideContent = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const {myNotificationGlobal,setMyNotificationGlobal} = useContext(NotificationContext);

	if(myUserDataGlobal==null){
		return("loading")
	}

	return (
		<div className="col-sm-3 pl-1 pr-1 d-none d-sm-block">
			
				<div className="card mb-1">
					<div className="card-body pt-3 pb-3 pl-3 pr-3 ">
						<h5 className="mb-4"><Link to="/postter/home"><img className="mr-3" src={`${baseUrl}/media/icon/home.svg`} width="16" height="16"/>ホーム</Link></h5>
						<h5 className="mb-4">
							<Link to="/postter/notification/"><img className="mr-3"src={`${baseUrl}/media/icon/notify.svg`} width="16" height="16"/>通知</Link>
							<span className="ml-3">{myNotificationGlobal > 0 && (myNotificationGlobal)}</span>
						</h5>
						<h5 className="mb-4"><Link to="/postter/message/"><img className="mr-3"src={`${baseUrl}/media/icon/message.svg`} width="16" height="16"/>メッセージ</Link></h5>
						<h5 className="mb-4"><Link to="/postter/memberlist/"><img className="mr-3"src={`${baseUrl}/media/icon/memberlist.svg`} width="16" height="16"/>リスト</Link></h5>
						
					</div>
				</div>
				<div className="card mb-1">
					<div className="card-body pt-3 pb-3 pl-3 pr-3">
						<h4>プロフィール</h4>						
							
						<img className="img-fluid" src={myUserDataGlobal.avatar_imgurl}/>
						<p className="mt-0 mb-0"><b><Link to={`/postter/${myUserDataGlobal.uid}/`}>{myUserDataGlobal.username}</Link></b></p>
						<p className="mt-0 mb-0 text-secondary">@{myUserDataGlobal.uid}</p>
						<p className="mt-0 mb-3"> {myUserDataGlobal.profile_statement}</p>
						<p className="mt-0 mb-1"><Link to={`/postter/${myUserDataGlobal.uid}/`}><b>{myUserDataGlobal.post_count}</b>ポスト</Link></p>
						<p className="mt-0 mb-1"><Link to={`/postter/${myUserDataGlobal.uid}/following/`}><b>{myUserDataGlobal.following_count}</b>フォロー</Link></p>
						<p className="mt-0 mb-1"><Link to={`/postter/${myUserDataGlobal.uid}/follower/`}><b>{myUserDataGlobal.follower_count}</b>フォロワー</Link></p>
						
					</div>
				</div>
		</div>
	  );
}

export default LeftSideContent;