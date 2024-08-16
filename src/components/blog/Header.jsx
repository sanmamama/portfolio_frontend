import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  const closeMenu = () => {
    const navBar = document.getElementById('navbarsExampleDefault');
    if (navBar.classList.contains('show')) {
      navBar.classList.remove('show');
    }
  };

  
  useEffect(() => {
    const handleDocumentClick = (event) => {
      const navBar = document.getElementById('navbarsExampleDefault');
      const isClickInside = navBar.contains(event.target) || event.target.classList.contains('navbar-toggler');
  
      if (!isClickInside) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a className="navbar-brand" href="/">
          さんままま
        </a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-toggle="collapse" 
          data-target="#navbarsExampleDefault" 
          aria-controls="navbarsExampleDefault" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
                to="/"
                onClick={closeMenu}
              >
                ホーム
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
                to="/profile"
                onClick={closeMenu}
              >
                プロフィール
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
                to="/portfolio"
                onClick={closeMenu}
              >
                ポートフォリオ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
                to="/privacypolicy"
                onClick={closeMenu}
              >
                プライバシーポリシー
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
                to="/contact"
                onClick={closeMenu}
              >
                問い合わせ
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <div className="jumbotron">
        <div className="container">
          <h1 className="display-5"><a className="text-dark text-decoration-none" href="/">さんままま</a></h1>
          <p>ポートフォリオサイトです。</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
