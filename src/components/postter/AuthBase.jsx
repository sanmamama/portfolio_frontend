import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import {ScrollRestoration } from 'react-router-dom';

const PostterBase = () => {
		return(
			<div>
				<ScrollRestoration/>
					<Header />
					<br/><br/><br/>	
					<Outlet />
					<Footer />
			</div>
			);
}

export default PostterBase;