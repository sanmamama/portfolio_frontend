import { Outlet } from 'react-router-dom';
import {UserDataProvider} from "./providers/UserDataProvider"
import Header from './Header';
import Footer from './Footer';
import LeftSideContent from './LeftSideContent';
import RightSideContent from './RightSideContent';

const PostterBase = () => {
		return(
		<div>
			<UserDataProvider>
				<Header />
				<br/><br/><br/>
				<div class="container mt-3">
					<div class="content-wrapper">
						<div class="container-fluid">
							<div class="row">
								<LeftSideContent/>		
								<Outlet />
								<RightSideContent/>
								
							</div>
						</div>
					</div>       
				</div>
				<Footer />
			</UserDataProvider>
		</div>
		);
}

export default PostterBase;