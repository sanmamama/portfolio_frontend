const apiUrl = process.env.REACT_APP_API_URL;

export const loginCheck = (setMyUserDataGlobal,navigate) => {
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
			navigate("/postter/login")
		}
		return response.json()
		})
	.then(data => {
		setMyUserDataGlobal(data[0])
		});
}