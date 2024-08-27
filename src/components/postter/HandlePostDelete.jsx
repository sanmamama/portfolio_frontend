const apiUrl = process.env.REACT_APP_API_URL;

//ポスト消すハンドル
export const handlePostDelete = async (postId,t,refreshPost,setMessages) => {
	const token = document.cookie.split('; ').reduce((acc, row) => {
		const [key, value] = row.split('=');
		if (key === 'token') {
		acc = value;
		}
		return acc;
	}, null);
	const response = await fetch(`${apiUrl}/postter/post/${postId}/`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Token ${token}`,
		}
	});
	if(response.ok){
		refreshPost()
		setMessages(t('toast_delete_post'));
		
	}else{
		setMessages(t('toast_delete_post_failed'));
	}
};