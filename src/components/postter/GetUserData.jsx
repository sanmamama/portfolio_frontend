const apiUrl = process.env.REACT_APP_API_URL;

export const getUserData = (setMyUserDataGlobal) => {
    const token = document.cookie.split('; ').reduce((acc, row) => {
		const [key, value] = row.split('=');
		if (key === 'token') {
		acc = value;
		}
		return acc;
	}, null);
	fetch(`${apiUrl}/postter/user/`,
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
		setMyUserDataGlobal(data[0])
		})
	.catch(error => {
		//ログインしていないとき
		setMyUserDataGlobal("")
	});
}