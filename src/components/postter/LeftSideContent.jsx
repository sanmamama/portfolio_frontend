import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"

const LeftSideContent = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);

	return (
		<div class="col-sm-3 pl-1 pr-1">
			<div class="card mb-1">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					<h5 class="mb-4"><a href="">ホーム</a></h5>
					<h5 class="mb-4"><a href="">リスト</a></h5>
					<h5 class="mb-4"><a href="">メッセージ</a></h5>
					<p><Link to="/postter/logout">ログアウト</Link></p>
					<p><Link to="/postter/signup">会員登録</Link></p>
					<p><Link to="/postter/login">ログイン</Link></p>
					<p><Link to="/postter/">ホーム</Link></p>
					<p><Link to="/postter/editprofile/">プロフィール変更</Link></p>
				</div>
			</div>
			<div class="card mb-1">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					<h4>プロフィール</h4>
					<img src={myUserDataGlobal.avatar_imgurl} width="100%" height="100%"/>
					<p class="mt-0 mb-0"><b><a href="">{myUserDataGlobal.username}</a></b></p>
					<p class="mt-0 mb-0 text-secondary">@{myUserDataGlobal.uid}</p>
					<p class="mt-0 mb-3"> {myUserDataGlobal.profile_statement} </p>
					<p class="mt-0 mb-1"><a href=""><b>posts_count</b>ポスト</a></p>
					<p class="mt-0 mb-1"><a href=""><b>following</b>フォロー</a></p>
					<p class="mt-0 mb-1"><a href=""><b>follower </b>フォロワー</a></p>
				</div>
			</div>
		</div>
	  );
}

export default LeftSideContent;