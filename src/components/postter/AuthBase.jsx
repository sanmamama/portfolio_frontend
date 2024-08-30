import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import {ScrollRestoration } from 'react-router-dom';

const PostterBase = () => {
		return(
			<div>
				<ScrollRestoration/>
					<Header />
					<div className="d-flex justify-content-center align-items-center vh-100">
            			<div className="col-10 max-width-400">
							<div className="container container-body">
								<Outlet />
							</div>
							<Footer />
						</div>
					</div>
					
			</div>
			);
}

export default PostterBase;