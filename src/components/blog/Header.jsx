import React, { useEffect ,useContext } from 'react';
import { NavLink ,Link } from 'react-router-dom';
import {BlogDataContext} from "./providers/BlogDataProvider"

const apiUrl = process.env.REACT_APP_API_URL;

function Header() {
  const {myBlogDataGlobal,setMyBlogDataGlobal} = useContext(BlogDataContext);

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

  useEffect(() => {
    if(!myBlogDataGlobal){
      fetch(`${apiUrl}/blog/all/`)
          .then(response => response.json())
          .then(data => {
            setMyBlogDataGlobal(data)

          })
          .catch(error => console.error('Error fetching posts:', error));
      }
}, [myBlogDataGlobal,setMyBlogDataGlobal]);


  const closeMenu = () => {
    const navBar = document.getElementById('navbarsExampleDefault');
    if (navBar.classList.contains('show')) {
      navBar.classList.remove('show');
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <Link className="navbar-brand" href="/">
          さんまブログ
        </Link>
        
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
                ブログ
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
          <h1 className="display-5"><Link className="text-dark text-decoration-none" to="/">さんまブログ</Link></h1>
          <p>私「さんままま」のポートフォリオサイトです</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
