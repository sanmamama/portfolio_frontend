import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {UserDataContext} from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"

const UpdateForm = () => {
	const navigate = useNavigate();
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [postData,setPostData] = useState([]);
	const [formData, setFormData] = useState({
        content: ''
    });
	const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");

	// if(email==""){
	// 	//未ログインの場合はloginへリダイレクト
	// 	navigate("/postter/login");
	// }

	const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        fetch('http://localhost:8000/api/postter/post/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if(response.ok){
                setMessages("投稿成功")
            }else{
                setMessages("投稿失敗")
            }
            return response.json();
        })
        .then(data => {
            setFormData(() => ({
                'content':''
            }));
  
        })
        .catch(error => {
            setErrors(error);
        });
    };
	

	useEffect(() => {
		const getPostData = () => {
			const token = document.cookie.split('; ').reduce((acc, row) => {
				const [key, value] = row.split('=');
				if (key === 'token') {
				acc = value;
				}
				return acc;
			}, null);
			fetch('http://localhost:8000/api/postter/post/',
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
				//ログインしているとき
				setPostData(data.results)
				})
			.catch(error => {
				//ログインしていないとき
			});
		}
		getPostData()
	},[messages])
	

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
									<p><Link to="/postter/logout">ログアウト</Link></p>
									<p><Link to="/postter/signup">会員登録</Link></p>
									<p><Link to="/postter/login">ログイン</Link></p>
                				</div>
              				</div>
							<div class="card mb-1">
                				<div class="card-body pt-3 pb-3 pl-3 pr-3">
                  					<h4>プロフィール</h4>
									<p class="mt-0 mb-0"><b><a href="">{myUserDataGlobal.username}</a></b></p>
									<p class="mt-0 mb-0 text-secondary">@{myUserDataGlobal.uid}</p>
									<p class="mt-0 mb-3"> {myUserDataGlobal.profile_statement} </p>
									<p class="mt-0 mb-1"><a href=""><b>posts_count</b>ポスト</a></p>
									<p class="mt-0 mb-1"><a href=""><b>following</b>フォロー</a></p>
									<p class="mt-0 mb-1"><a href=""><b>follower </b>フォロワー</a></p>
									<p>{JSON.stringify(myUserDataGlobal)}</p>
                				</div>
              				</div>
            			</div>



						<div class="col-sm-6 pl-0 pr-0">
							<div class="card">
								<div class="card-body pt-3 pb-3 pl-3 pr-3">
									<form method="post" onSubmit={handleSubmit}>
										<textarea class="form-control" type="textarea" name="content" value={formData.content} onChange={handleChange}/>
										<button type="submit" class="mb-2 mt-2 btn btn-outline-primary btn-block">投稿する</button>
									</form>
								<div class="table table-responsive">
									<table id='post_list' class="table-sm">
										<tbody>
											{postData.map((postData) => (
												<tr class="text">
												<td class="text" style={{width: "15%"}}>
													<img class="rounded img-fluid mx-auto d-block" src="{postData.avatar_imgurl}" id="avatar-image" width="40" height="40"/>
												</td>
												<td class="text" style={{width: "80%"}}>
													<h6>
														<a text-dark text-decoration-none href=""><b>{postData.owner.username}</b></a>
														<span class="ml-1 text-secondary">@{postData.owner.uid}</span>
														<span class="ml-1 text-secondary">{postData.created_at}</span>
													</h6>
													<p>{postData.content}</p>
													<form action="" method="post">
														<button class="btn btn-outline-primary btn-sm" type="submit">
															♥
														</button>
													</form>
												</td>
												<td class='text' style={{width: "5%"}}>
													<div class="dropdown">
														<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">︙</button>
														<div class="dropdown-menu">
															<a class="dropdown-item" href="">このユーザーをリストに追加/削除</a>
														</div>
													</div>
												</td>
											</tr>

											))}
											
											
										</tbody>
									</table>
								</div>
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