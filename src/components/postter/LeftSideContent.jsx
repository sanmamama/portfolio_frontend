import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
const baseUrl = process.env.REACT_APP_BASE_URL;

const LeftSideContent = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);

	if(myUserDataGlobal==null){
		return("loading")
	}

	return (
		<div class="col-sm-3 pl-1 pr-1 d-none d-sm-block">
			
				<div class="card mb-1">
					<div class="card-body pt-3 pb-3 pl-3 pr-3 ">
						<h5 class="mb-4"><Link to="/postter/home"><img class="mr-3" src={`${baseUrl}/icon/home.svg`} width="16" height="16"/>ホーム</Link></h5>
						<h5 class="mb-4"><Link to="/postter/notify/"><img class="mr-3"src={`${baseUrl}/icon/notify.svg`} width="16" height="16"/>通知</Link></h5>
						<h5 class="mb-4"><Link to="/postter/message/"><img class="mr-3"src={`${baseUrl}/icon/message.svg`} width="16" height="16"/>メッセージ</Link></h5>
						<h5 class="mb-4"><Link to="/postter/memberlist/"><img class="mr-3"src={`${baseUrl}/icon/memberlist.svg`} width="16" height="16"/>リスト</Link></h5>
						
					</div>
				</div>
				<div class="card mb-1">
					<div class="card-body pt-3 pb-3 pl-3 pr-3">
						<h4>プロフィール</h4>						
							
						<img src={myUserDataGlobal.avatar_imgurl} width="100%" height="100%"/>
						<p class="mt-0 mb-0"><b><Link to={`/postter/${myUserDataGlobal.uid}/`}>{myUserDataGlobal.username}</Link></b></p>
						<p class="mt-0 mb-0 text-secondary">@{myUserDataGlobal.uid}</p>
						<p class="mt-0 mb-3"> {myUserDataGlobal.profile_statement}</p>
						<p class="mt-0 mb-1"><Link to={`/postter/${myUserDataGlobal.uid}/`}><b>{myUserDataGlobal.post_count}</b>ポスト</Link></p>
						<p class="mt-0 mb-1"><Link to={`/postter/${myUserDataGlobal.uid}/following/`}><b>{myUserDataGlobal.following_count}</b>フォロー</Link></p>
						<p class="mt-0 mb-1"><Link to={`/postter/${myUserDataGlobal.uid}/follower/`}><b>{myUserDataGlobal.follower_count}</b>フォロワー</Link></p>
						
					</div>
				</div>
		</div>
	  );
}

export default LeftSideContent;