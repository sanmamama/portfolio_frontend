import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const PostterBase = () => {
		return(
			<div>
					<Header />
					<br/><br/><br/>	
					<Outlet />
					<Footer />
			</div>
			);
}

export default PostterBase;