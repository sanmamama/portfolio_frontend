import { NavLink} from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserDataContext } from "./providers/UserDataProvider";

function Header() {
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
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
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
                      ホーム
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                      to="/postter/notification/"
                      onClick={closeMenu}
                    >
                      通知
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                      to="/postter/message"
                      onClick={closeMenu}
                    >
                      メッセージ
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                      to="/postter/memberlist"
                      onClick={closeMenu}
                    >
                      リスト
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
            <ul className="navbar-nav">
              {myUserDataGlobal ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to={`/postter/${myUserDataGlobal.uid}/`} onClick={closeMenu}>
                      {myUserDataGlobal.username}としてログイン中
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/postter/logout" onClick={closeMenu}>ログアウト</NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/postter/login" onClick={closeMenu}>ログイン</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/postter/signup" onClick={closeMenu}>会員登録</NavLink>
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
