const apiUrl = process.env.REACT_APP_API_URL;

export const loginCheck = (myUserDataGlobal,setMyUserDataGlobal,navigate) => {
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
			setMyUserDataGlobal(null)
			navigate("/postter/login")
		}
		return response.json()
		})
	.then(data => {
		if(!myUserDataGlobal){
			setMyUserDataGlobal(data[0])
		}
		});
}