import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserDataContext } from "./providers/UserDataProvider"

const Logout = () => {
  const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext)
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
		const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
        await fetch('http://localhost:8000/api/auth/logout/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
			'Authorization': `Token ${token}`,
          },
        });

        // トークンをクッキーから削除
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		
		//ヘッダの名前をリセット
		setMyUserDataGlobal("")
        navigate('/postter/login');
      } catch (error) {
		setMyUserDataGlobal("")
		navigate('/postter/login')
      }
    };

    handleLogout();
  }, []);

  return null;
};

export default Logout;
