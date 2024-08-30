import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserDataContext } from "./providers/UserDataProvider"
import { useTranslation } from 'react-i18next';
const apiUrl = process.env.REACT_APP_API_URL;

const Logout = () => {
  const { i18n } = useTranslation();
  const {setMyUserDataGlobal} = useContext(UserDataContext)
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
		const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
        await fetch(`${apiUrl}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
			      'Authorization': `Token ${token}`,
            'accept-language':i18n.language,
          },
        });

        // トークンをクッキーから削除
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		
		//ヘッダの名前をリセット
		setMyUserDataGlobal(null)
        navigate('/postter/login');
      } catch (error) {
		setMyUserDataGlobal(null)
		navigate('/postter/login')
      }
    };

    handleLogout();
  }, [navigate,setMyUserDataGlobal,i18n]);

  return null;
};

export default Logout;
