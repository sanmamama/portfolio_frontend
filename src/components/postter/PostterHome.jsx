import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {UserDataContext} from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"

const UpdateForm = () => {
  const navigate = useNavigate();
  const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext)
  
	// if(email==""){
	// 	//未ログインの場合はloginへリダイレクト
	// 	navigate("/postter/login");
	// }



	return (
		<div class="container mt-3">
			<div class="content-wrapper">
				<div class="container-fluid">
					<div class="row">

						<div class="col-sm-3 pl-1 pr-1">
							<div class="card mb-1">
                				<div class="card-body pt-3 pb-3 pl-3 pr-3">
                    				<h5 class="mb-4"><a href="">ホーム</a></h5>
                    				<h5 class="mb-4"><a href="">リスト</a></h5>
                    				<h5 class="mb-4"><a href="">メッセージ</a></h5>
                				</div>
              				</div>
							<div class="card mb-1">
                				<div class="card-body pt-3 pb-3 pl-3 pr-3">
                  					<h4>プロフィール</h4>
									<p class="mt-0 mb-0"><b><a href="">{myUserDataGlobal.username}</a></b></p>
									<p class="mt-0 mb-0 text-secondary">@{myUserDataGlobal.uid}</p>
									<p class="mt-0 mb-3"> user.profile_statement </p>
									<p class="mt-0 mb-1"><a href=""><b>posts_count</b>ポスト</a></p>
									<p class="mt-0 mb-1"><a href=""><b>following</b>フォロー</a></p>
									<p class="mt-0 mb-1"><a href=""><b>follower </b>フォロワー</a></p>
                				</div>
              				</div>
            			</div>



						<div class="col-sm-6 pl-0 pr-0">
							<div class="card">
								<div class="card-body pt-3 pb-3 pl-3 pr-3">
									<p>{JSON.stringify(myUserDataGlobal)}</p>

									<p><Link to="/postter/logout">ログアウト</Link></p>
									<p><Link to="/postter/signup">会員登録</Link></p>
									<p><Link to="/postter/login">ログイン</Link></p>
								</div>
							</div>
						</div>




            			<div class="col-sm-3 pl-1 pr-1">
              				<div class="card">
                				<div class="card-body pt-3 pb-3 pl-3 pr-3">
              						<form action="" method="GET">
                						<div class="form-group">
                  							<input type="text" class="form-control" name="q" placeholder="検索" value=""/>
                						</div>
                						<button type="submit" class="btn btn-primary">検索</button>
              						</form>
            					</div>
          					</div>
              			</div>

            		</div>
          		</div>
        	</div>       
      	</div>
	  );
}

export default UpdateForm;