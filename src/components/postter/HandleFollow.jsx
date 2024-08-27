import { getUserData } from "./GetUserData"
const apiUrl = process.env.REACT_APP_API_URL;

//フォローハンドル
export const handleFollow = async (userId,setMessages,t,setMyUserDataGlobal,userData,setUserData) => {
	const token = document.cookie.split('; ').reduce((acc, row) => {
		const [key, value] = row.split('=');
		if (key === 'token') {
		acc = value;
		}
		return acc;
	}, null);
	const response = await fetch(`${apiUrl}/postter/follow/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Token ${token}`,
		},
		body: JSON.stringify({"following":userId}),
	});
	const res = await response.json();
	if(response.ok){
		if(res.actionType === "follow"){
			setMessages(t('toast_follow'));
		}else{
			setMessages(t('toast_unfollow'));
		}
		
		if(userData && setUserData){
			if(res.actionType === "follow"){
					
				setMyUserDataGlobal(prevData => ({
					...prevData,
					following_count: prevData.following_count + 1,
					following: [...prevData.following, res.id]
				}));

				setUserData(()=>{
					userData.follower_count+=1;
					return userData
				})
				
			}else{

				setMyUserDataGlobal(prevData => ({
					...prevData,
					following_count: prevData.following_count - 1,
					following: prevData.following.filter(id => id !== res.id)
				}));

				setUserData(()=>{
					userData.follower_count-=1;
					return userData
				})
			}
		}
		

		getUserData(setMyUserDataGlobal)
	}  
};