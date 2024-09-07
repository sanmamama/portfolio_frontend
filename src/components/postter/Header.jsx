import { NavLink} from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserDataContext } from "./providers/UserDataProvider";
import {NotificationContext} from "./providers/NotificationProvider"
import { useTranslation } from 'react-i18next';
import { loginCheck } from './LoginCheck';
import { notificationCheck } from './NotificationCheck';
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { myUserDataGlobal, setMyUserDataGlobal } = useContext(UserDataContext);
  const {setMyNotificationGlobal} = useContext(NotificationContext);


  //ログインチェック
	useEffect(()=>{
		loginCheck(setMyUserDataGlobal,navigate,i18n.changeLanguage)
		notificationCheck(setMyNotificationGlobal)
	},[setMyUserDataGlobal,setMyNotificationGlobal,navigate,i18n.changeLanguage])

  useEffect(() => {

    // メニュー外をクリックした際にメニューを閉じる
    const handleOutsideClick = (event) => {
      const navBar = document.getElementById('navbarsExampleDefault');
      if (navBar.classList.contains('show') && !navBar.contains(event.target)) {
        navBar.classList.remove('show');
      }
    };

    document.addEventListener('click', handleOutsideClick);

    // コンポーネントがアンマウントされたときにイベントリスナーを削除
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [setMyUserDataGlobal]);

  const closeMenu = () => {
    const navBar = document.getElementById('navbarsExampleDefault');
    if (navBar.classList.contains('show')) {
      navBar.classList.remove('show');
    }
  };

  const handleChange = (locale) => {
    i18n.changeLanguage(locale)
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);

    const formDataObj = new FormData();
        formDataObj.append("locale", locale);

    fetch(`${apiUrl}/postter/user/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formDataObj,
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
      closeMenu()
    })
  }

  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/postter/home">postter</a>
          
          <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="ナビゲーションの切替">
          <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-md-none">
              {myUserDataGlobal && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                      to="/postter/home"
                      onClick={closeMenu}
                    >
                      {t('home')}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                      to="/postter/notification/"
                      onClick={closeMenu}
                    >
                      {t('notification')}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                      to="/postter/message"
                      onClick={closeMenu}
                    >
                      {t('message')}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                      to="/postter/memberlist"
                      onClick={closeMenu}
                    >
                      {t('list')}
                    </NavLink>
                  </li>

                </>
              )}
            </ul>

            
            
            

            <ul className="navbar-nav ms-auto">
              {myUserDataGlobal ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to={`/postter/${myUserDataGlobal.uid}/`} onClick={closeMenu}>
                    {t("aka1")}{myUserDataGlobal.username}{t("aka2")}
                    </NavLink>
                  </li>
                  
                  <li className="nav-item dropdown">
                    <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      {t("language_change")}
                    </button>
                    <ul className="dropdown-menu  dropdown-menu-dark">
                    <button className="btn dropdown-item" onClick={() => handleChange('en')}>English</button>
                    <button className="btn dropdown-item" onClick={() => handleChange('ja')}>日本語</button>
                    </ul>
                  </li>
                  <hr/>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/postter/logout" onClick={closeMenu}>{t('logout')}</NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/postter/login" onClick={closeMenu}>{t('login')}</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/postter/signup" onClick={closeMenu}>{t('signup')}</NavLink>
                  </li>
                  <li className="nav-item dropdown">
                    <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      {t("language_change")}
                    </button>
                    <ul className="dropdown-menu  dropdown-menu-dark">
                    <button className="btn dropdown-item" onClick={() => i18n.changeLanguage('en')}>English</button>
                    <button className="btn dropdown-item" onClick={() => i18n.changeLanguage('ja')}>日本語</button>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
