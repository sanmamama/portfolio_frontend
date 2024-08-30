import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



export const RightSideContent = () => {
	const [query, setQuery] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();
		if (query.trim()) {
		  navigate(`/postter/search?q=${query}`);
		}
	  };

	

	return (
		<div className="col-sm-3 pl-1 pr-1 d-none d-sm-block">
			<div className="mb-1 card">
				<div className="card-body pt-3 pb-3 pl-3 pr-3">
					<form onSubmit={handleSubmit}>
						<div className="form-group">
						<input type="text" className="form-control" name="q" placeholder="検索" value={query} onChange={(e) => setQuery(e.target.value)}/>
						</div>
						<button type="submit" className="btn btn-primary">検索</button>
					</form>
				</div>
			</div>
			
		</div>
	  );
}

export default RightSideContent;