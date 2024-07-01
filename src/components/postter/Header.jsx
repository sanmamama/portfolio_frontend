
import { NavLink,Link } from 'react-router-dom';
import {useContext } from 'react';
import {UserDataContext} from "./providers/UserDataProvider"

function Header() {
	const {email} = useContext(UserDataContext)

	return (
    <header>
		<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
			<a class="navbar-brand" href="/">postter</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarsExampleDefault">
			<ul className="navbar-nav mr-auto">
				<li className="nav-item">
				<NavLink className="nav-link" to="/" activeClassName="active">ホーム</NavLink>
				</li>
				<li className="nav-item">
				<NavLink className="nav-link" to="/profile" activeClassName="active">プロフィール</NavLink>
				</li>
				<li className="nav-item">
				<NavLink className="nav-link" to="/portfolio" activeClassName="active">ポートフォリオ</NavLink>
				</li>
				<li className="nav-item">
				<NavLink className="nav-link" to="/privacypolicy" activeClassName="active">プライバシーポリシー</NavLink>
				</li>
				<li className="nav-item">
				<NavLink className="nav-link" to="/contact" activeClassName="active">問い合わせ</NavLink>
				</li>
        </ul>
		<ul class="navbar-nav">
			<li>
				<Link class="nav-item nav-link" to="">{email ? email+"としてログイン中":""}</Link>
			</li>
			<li>
				<Link class="nav-item nav-link" to="/postter/logout">{email ? "ログアウト":""}</Link>
			</li>
			<li class="nav-item">
				<Link class="nav-item nav-link" to="/postter/login">{email ? "":"ログイン"}</Link>
			</li>
			<li class="nav-item">
				<Link class="nav-item nav-link" to="/postter/signup">{email ? "":"会員登録"}</Link>
			</li>

	  </ul>
			</div>
		</nav>

		
    </header>
	);
}

export default Header;