
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

	return (
    <header>
		<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
			<a class="navbar-brand" href="/postter/home">postter</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarsExampleDefault">
			<ul className="navbar-nav mr-auto">
				{myUserDataGlobal ? 
					<li className="nav-item">
					<NavLink className="nav-link" to="/postter/home" activeClassName="active">ホーム</NavLink>
					</li>
				:""}

				{myUserDataGlobal ? 
					<li className="nav-item">
					<NavLink className="nav-link" to="/postter/message" activeClassName="active">メッセージ</NavLink>
					</li>
				:""}

				{myUserDataGlobal ? 
					<li className="nav-item">
					<NavLink className="nav-link" to="/postter/memberlist" activeClassName="active">リスト</NavLink>
					</li>
				:""}
				

			</ul>
			<ul class="navbar-nav">
				{myUserDataGlobal ? 
					<li className="nav-item">
					<Link className="nav-link" to={`/postter/${myUserDataGlobal.uid}/`}>{myUserDataGlobal.username}としてログイン中</Link>
					</li>
				:""}

				{myUserDataGlobal ? 
					<li className="nav-item">
					<Link className="nav-link" to="/postter/logout">ログアウト</Link>
					</li>
				:""}

				{!myUserDataGlobal ? 
					<li className="nav-item">
					<Link className="nav-link" to="/postter/login">ログイン</Link>
					</li>
				:""}

				{!myUserDataGlobal ? 
					<li className="nav-item">
					<Link className="nav-link" to="/postter/signup">会員登録</Link>
					</li>
				:""}

			</ul>
			</div>
		</nav>

		
    </header>
	);
}

export default Header;