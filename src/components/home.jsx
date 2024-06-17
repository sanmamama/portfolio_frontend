import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function truncateTo100Chars(value) {
	// HTMLタグを削除
	const clean = /<.*?>/g;
	value = value.replace(clean, '');

	// エスケープ文字を削除
	value = value.replace(/&[A-Za-z0-9#]+;/g, '');

	// 100文字まで
	if (value.length > 100) {
		return value.slice(0, 100) + '...';
	}
	return value;
}

function App() {
	const [data, setData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
		try {
			const response = await fetch('http://127.0.0.1:8000/api/blog/');
			const jsonData = await response.json();
			setData(jsonData);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

    fetchData();
	}, []);

	if (!data) {
		return <div>Loading...</div>;
	}

	return (
	<>
	{data.map(item => (
		<div class="col-md-6">
			<div class="d-flex flex-column bd-highlight mb-5">
				<div key={item.id}>
				<Link to={`/detail/${item.id}`}>{item.title}</Link>
				<p>{truncateTo100Chars(item.content)}</p>
				</div>
			</div>
		</div>	
	))}		
	</>
	);
	
}

export default App;