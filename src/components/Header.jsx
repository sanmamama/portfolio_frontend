import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
	return (
    <header>
		<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
			<a class="navbar-brand" href="">myblog</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarsExampleDefault">
			<ul className="navbar-nav mr-auto">
          		<li className="nav-item">
            		<NavLink exact className="nav-link" to="/" activeClassName="active">ホーム</NavLink>
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
			</div>
		</nav>

		<div class="jumbotron">
				<div class="container">
					<h1 class="display-3"><a class="text-dark text-decoration-none" href="">myblog</a></h1>
					<p>ポートフォリオサイトです。</p>
				</div>
		</div>
    </header>
	);
}

export default Header;