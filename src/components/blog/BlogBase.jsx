import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';


const BlogBase = () => {
	return(
	<div>
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