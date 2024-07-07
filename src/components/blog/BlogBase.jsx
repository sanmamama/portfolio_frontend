import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import {ScrollRestoration } from 'react-router-dom';

const BlogBase = () => {
	return(
	<div>
		<ScrollRestoration/>
		<Header />
      		<main>
        		<div className="container">
          			<div className="row">
						<Outlet />
					</div>
        		</div>
      		</main>
      	<Footer />
	</div>
	);
}

export default BlogBase;