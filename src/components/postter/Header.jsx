import { NavLink} from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserDataContext } from "./providers/UserDataProvider";
import { useTranslation } from 'react-i18next';

function Header() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const { myUserDataGlobal, setMyUserDataGlobal } = useContext(UserDataContext);

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

  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/postter/home">postter</a>
          
          <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="ナビゲーションの切替">
          <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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

            <button className="btn btn-primary me-1" onClick={() => changeLanguage('en')}>English</button>
            <button className="btn btn-primary" onClick={() => changeLanguage('ja')}>日本語</button>
            
            

            <ul className="navbar-nav">
              {myUserDataGlobal ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to={`/postter/${myUserDataGlobal.uid}/`} onClick={closeMenu}>
                      {myUserDataGlobal.username}
                    </NavLink>
                  </li>
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
