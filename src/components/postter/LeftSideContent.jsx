import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"

const LeftSideContent = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);

	if(myUserDataGlobal==null){
		return("loading")
	}

	return (
		<div class="col-sm-3 pl-1 pr-1">
			<div class="card mb-1">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					<h5 class="mb-4"><Link to="/postter/">ホーム</Link></h5>
					<h5 class="mb-4"><Link to="/postter/message/">メッセージ</Link></h5>
					<h5 class="mb-4"><Link to="/postter/memberlist/">リスト</Link></h5>
					<p><Link to="/postter/logout">ログアウト</Link></p>
					<p><Link to="/postter/signup">会員登録</Link></p>
					<p><Link to="/postter/login">ログイン</Link></p>
					<p><Link to="/postter/editprofile/">プロフィール編集</Link></p>
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