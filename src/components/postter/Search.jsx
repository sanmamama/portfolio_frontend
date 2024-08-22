import React, { useEffect, useState ,useContext } from 'react';
//import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"
import InfiniteScroll from 'react-infinite-scroller';
import { loginCheck } from './LoginCheck';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import PostContainer from './PostContainer';
const apiUrl = process.env.REACT_APP_API_URL;
//const baseUrl = process.env.REACT_APP_BASE_URL;


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
	const query = useQuery();
	const q = query.get('q');
	//const { q } = useParams();
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [messages, setMessages] = useState("");
	const [posts, setPosts] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const navigate = useNavigate();

	//ログインチェック
	useEffect(()=>{
		loginCheck(myUserDataGlobal,setMyUserDataGlobal,navigate)
	},[myUserDataGlobal,setMyUserDataGlobal,navigate])

	const refreshPost = async() => {
		setPosts([])
		setPageCount(1)
		setHasMore(true)
	}

	const loadPost = async(page) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		

		const response = await fetch(`${apiUrl}/postter/post/?q=${q}&page=${pageCount}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Token ${token}`,
				},
			}
		)
		const data = await response.json()
		
		if(response.ok){
			setPosts([...posts, ...data.results])
			setHasMore(!!data.next)
			setPageCount(pageCount+1)
		}
	}

	useEffect(()=>{
		refreshPost()
	},[q])
	

	if(!myUserDataGlobal || !posts){
		return("loading...")
	}

	return (
		<div className="col-sm-6 pl-0 pr-0">
			<div className="card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
					<p>「{q}」で検索中</p>
					{messages}
				<div className="table table-responsive">
					<div>
							<InfiniteScroll
								loadMore={loadPost}
								loader={<div key={0}>Loading ...</div>}
								hasMore={hasMore}
								threshold={5} >
								{posts.map((postData,ix) => (
									<div className="container" key={ix}>
										<PostContainer
										postData={postData}
										myUserDataGlobal={myUserDataGlobal}
										posts={posts}
										setPosts={setPosts}
										getUserData={getUserData}
										setMyUserDataGlobal={setMyUserDataGlobal}
										setMessages={setMessages}
										refreshPost={refreshPost}
										ix={ix}
										/>
									</div>
								))}
							</InfiniteScroll>
						</div>
					</div>
				</div>
			</div>
		</div>
	  );
}

export default Home;