import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LeftSideContent from './LeftSideContent';
import RightSideContent from './RightSideContent';
import {ScrollRestoration } from 'react-router-dom';

const PostterBase = () => {
		return(
		<div>
			<ScrollRestoration/>
				<Header />
				<br/><br/><br/>
				<div className="container mt-3">
					<div className="content-wrapper">
						<div className="container-fluid">
							<div className="row">
									<LeftSideContent/>		
										<Outlet />
									<RightSideContent/>
							</div>
						</div>
					</div>       
				</div>
				<Footer />
		</div>
		);
}

export default PostterBase;