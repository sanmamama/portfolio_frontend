const apiUrl = process.env.REACT_APP_API_URL;

export const getFollowData = (setMyFollowDataGlobal) => {
    const token = document.cookie.split('; ').reduce((acc, row) => {
		const [key, value] = row.split('=');
		if (key === 'token') {
		acc = value;
		}
		return acc;
	}, null);
	fetch(`${apiUrl}/postter/follow/me/`,
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
		const followingIds = data.map(item => item.following);
		setMyFollowDataGlobal(followingIds)
		})
	.catch(error => {
		//ログインしていないとき
		setMyFollowDataGlobal("")
	});
}