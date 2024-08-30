const apiUrl = process.env.REACT_APP_API_URL;

//リポストハンドル
export const handleRepost = async (posts,postId,postIx,getUserData,setPosts,setMyUserDataGlobal,locale,setMessages,t) => {
	const token = document.cookie.split('; ').reduce((acc, row) => {
		const [key, value] = row.split('=');
		if (key === 'token') {
		acc = value;
		}
		return acc;
	}, null);
	try {
		const response = await fetch(`${apiUrl}/postter/repost/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
				'accept-language':locale,
				
			},
			body: JSON.stringify({ post: postId })
		});

		if (response.ok) {
			const res = await response.json();

		if(posts){
			setPosts((posts)=>{posts[postIx].repost_count=res.repost_count;return posts;})
			//setMessages(t("repost_success"))
		}else{
			setPosts((posts)=>{posts.repost_count=res.repost_count;return posts;})
			setMessages(t("repost_fail"))
		}
				
		getUserData(setMyUserDataGlobal)

		}else{

		}
	} catch (error) {

	}
};