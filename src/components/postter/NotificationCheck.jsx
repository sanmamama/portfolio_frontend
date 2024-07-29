const apiUrl = process.env.REACT_APP_API_URL;

export const notificationCheck = (setMyNotificationGlobal) => {
	const token = document.cookie.split('; ').reduce((acc, row) => {
		const [key, value] = row.split('=');
		if (key === 'token') {
		acc = value;
		}
		return acc;
	}, null);
	fetch(`${apiUrl}/postter/notification/unread_count/`,
		{
		method: 'GET',
		headers: {
			'Authorization': `Token ${token}`,
			},
		})
	.then(response => {
		if(!response.ok){

		}
		return response.json()
		})
	.then(data => {
		setMyNotificationGlobal(data)
		});
}