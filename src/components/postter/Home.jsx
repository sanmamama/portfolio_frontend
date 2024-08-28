import React, { useEffect, useState ,useContext } from 'react';
//import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"
import InfiniteScroll from 'react-infinite-scroller';
import PostContainer from './PostContainer';
import { useTranslation } from 'react-i18next';

const apiUrl = process.env.REACT_APP_API_URL;
//const baseUrl = process.env.REACT_APP_BASE_URL;

const Home = () => {
	const { t } = useTranslation();
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);
	const [formData, setFormData] = useState({
        content: ''
    });
	const [messages, setMessages] = useState("");
	const [posts, setPosts] = useState([]);
	const [pageCount, setPageCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	//toast
	useEffect(()=>{
		if(messages !== ""){
			const toastBootstrap = window.bootstrap.Toast.getOrCreateInstance(document.getElementById('liveToast'))
			toastBootstrap.show()
		}
	},[messages])

	//ポストフォーム
	const handlePostChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

	//ポストsubmit
    const handlePostSubmit = (e) => {
        e.preventDefault();
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        fetch(`${apiUrl}/postter/post/`, {
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
                setMessages("ポストに失敗しました")
            }
            return response.json();
        })
        .then(data => {
            setFormData(() => ({
                'content':''
            }));
			if(data.id){
				setMessages(`ポストしました`)
				refreshPost()
			}
        })
        .catch(error => {
            setMessages("ポストに失敗しました");
        });
    };
	

	const refreshPost = async() => {
		setPosts([])
		setPageCount(1)
		setHasMore(true)
	}

	const loadPost = async() => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
		
		const response = await fetch(`${apiUrl}/postter/post/?page=${pageCount}`,
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
	

	if(!myUserDataGlobal || !posts){
		return("loading...")
	}

	
	

	return (
		
			<div className="card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
				
					<div className="toast-container position-fixed">
						<div id="liveToast" className="toast position-fixed top-0 start-50 translate-middle-x m-1" role="alert" aria-live="assertive" aria-atomic="true">
							<div className="toast-body">
								{messages}
							</div>
						</div>
					</div>

					
					
					<form method="post" onSubmit={handlePostSubmit}>
						<textarea className="form-control" type="textarea" name="content" value={formData.content} onChange={handlePostChange} placeholder={t('post_area_placeholder')}/>
						<div className="d-grid gap-2">
							<button type="submit" className="mb-2 mt-2 btn btn-outline-primary">{t('do_post')}</button>
						</div>
					</form>

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
	  );
}

export default Home;