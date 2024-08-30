const apiUrl = process.env.REACT_APP_API_URL;


export const handleLike = async (posts,postId,postIx,getUserData,setPosts,setMyUserDataGlobal,locale) => {
	const token = document.cookie.split('; ').reduce((acc, row) => {
		const [key, value] = row.split('=');
		if (key === 'token') {
		acc = value;
		}
		return acc;
	}, null);
	const response = await fetch(`${apiUrl}/postter/like/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Token ${token}`,
			'accept-language':locale,
		},
		body: JSON.stringify({"post":postId}),
	});
	const res = await response.json();


	if(response.ok){
		if(posts){
			setPosts((posts)=>{posts[postIx].like_count=res.like_count;return posts;})
		}else{
			setPosts((posts)=>{posts.like_count=res.like_count;return posts;})
		}

		getUserData(setMyUserDataGlobal)

	}else{

	}
	
};