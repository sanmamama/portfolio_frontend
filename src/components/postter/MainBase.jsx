import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LeftSideContent from './LeftSideContent';

import {ScrollRestoration } from 'react-router-dom';

const PostterBase = () => {
		return(
		<div>
			<ScrollRestoration/>
				<Header />
				<div className="container container-body">
					<div className="content-wrapper">
						<div className="container-fluid">
							<div className="row">
									<LeftSideContent/>
									<div className="col-sm-9 pl-0 pr-0">
										<Outlet />
									</div>
									
							</div>
						</div>
					</div>       
				</div>
				<Footer />
		</div>
		);
}

export default PostterBase;