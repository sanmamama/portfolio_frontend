import { Outlet } from 'react-router-dom';
import {UserDataProvider} from "./providers/UserDataProvider"
import Header from './Header';
import Footer from './Footer';

const PostterBase = () => {
		return(
			<div>
				<UserDataProvider>
					<Header />
					<br/><br/><br/>	
					<Outlet />
					<Footer />
				</UserDataProvider>
			</div>
			);
}

export default PostterBase;