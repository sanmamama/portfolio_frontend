import React, { useEffect, useState ,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"

export const RightSideContent = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [query, setQuery] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault(); // ページ遷移を防ぐ
		if (query.trim()) {
		  navigate(`/postter/search?q=${query}`);
		}
	  };

	// //ポストフォームチェンジ
	// const handlePostChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevFormData) => ({
    //         ...prevFormData,
    //         [name]: value
    //     }));
    // };

	return (
		<div class="col-sm-3 pl-1 pr-1">
			<div class="mb-1 card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					<form onSubmit={handleSubmit}>
						<div class="form-group">
							<input type="text" class="form-control" name="q" placeholder="検索" value={query} onChange={(e) => setQuery(e.target.value)}/>
						</div>
						<button type="submit" class="btn btn-primary">検索</button>
					</form>
				</div>
			</div>
			<div class="mb-1 card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					<h4>おすすめのユーザー</h4>
						<p>あああああ</p>
				</div>
			</div>
		</div>
	  );
}

export default RightSideContent;