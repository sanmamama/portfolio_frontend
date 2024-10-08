import React, { useEffect , useState, useContext } from 'react';
import { NavLink ,Link } from 'react-router-dom';
import {BlogDataContext} from "./providers/BlogDataProvider"
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

function Header() {
  const {myBlogDataGlobal,setMyBlogDataGlobal} = useContext(BlogDataContext);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

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

const handleSubmit = (event) => {
  event.preventDefault();
  if (query.trim()) {
      navigate(`/?q=${query}`);
  }
  setQuery("")
  closeMenu()
};

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
          <Link className="navbar-brand" to="/">
            さんまブログ
          </Link>
          
          <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="ナビゲーションの切替">
          <span class="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => "nav-link " + (isActive ? " active" : "")} 
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

            <div class="ms-auto">
                <form class="d-flex" role="search" onSubmit={handleSubmit}>
                  <input type="text" className="form-control me-2" name="q" placeholder="記事を検索" value={query} onChange={(e) => setQuery(e.target.value)}/>
                  <button type="submit" className="btn btn-success no-wrap-button">検索</button>
                </form>
            </div>

            
          </div>
        </div>
        
      </nav>

      <div className="jumbotron">
        <div className="container">
          <h1 className="display-5"><Link className="text-dark text-decoration-none" to="/">さんまブログ</Link></h1>
          <p>さんまままのポートフォリオサイトです。<br/>このブログでは私のプロフィールや学習記録・技術的な記事の発信をしています。</p>
          <p></p>
        </div>
      </div>
    </header>
  );
}

export default Header;
