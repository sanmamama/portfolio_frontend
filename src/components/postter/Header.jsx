
import { NavLink,Link } from 'react-router-dom';
import {useContext,useEffect } from 'react';
import {UserDataContext} from "./providers/UserDataProvider"
import { getUserData } from "./GetUserData"

const apiUrl = process.env.REACT_APP_API_URL;

function Header() {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext)

	useEffect(()=>{
		getUserData(setMyUserDataGlobal)
	},[])

	const closeMenu = () => {
		const navBar = document.getElementById('navbarsExampleDefault');
		if (navBar.classList.contains('show')) {
		  navBar.classList.remove('show');
		}
	  };

	return (
		<header>
			<nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
				<a className="navbar-brand" href="/postter/home">postter</a>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarsExampleDefault">
					<ul className="navbar-nav mr-auto">
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
									<Link className="nav-link" to={`/postter/${myUserDataGlobal.uid}/`}>
										{myUserDataGlobal.username}としてログイン中
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/postter/logout">ログアウト</Link>
								</li>
							</>
						) : (
							<>
								<li className="nav-item">
									<Link className="nav-link" to="/postter/login">ログイン</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/postter/signup">会員登録</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</nav>
		</header>
	);
}

export default Header;