import React, { useState, useEffect } from 'react';
import BlogListContent from './BlogListContent';
import SidebarContent from './SidebarContent';

function App() {
    return (
	<>
		<div class="col-sm-9">
			<div class="container container-m">
				<div class="row">
					<BlogListContent />
				</div>
			</div>
		</div>
		<div class="col-sm-3">
			<SidebarContent />
		</div>
	</>
    );
}

export default App;





