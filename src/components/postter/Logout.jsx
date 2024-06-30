import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
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

        // ログインページにリダイレクト
        navigate('/postter/login');
      } catch (error) {
        console.error('ログアウト時にエラーが発生しました:', error);
      }
    };

    handleLogout();
  }, [navigate]);

  return null;
};

export default Logout;
