
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
	const { id } = useParams();
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
		try {
			const url = `http://127.0.0.1:8000/api/blog/${id}/`;
			const response = await fetch(url);
			const jsonData = await response.json();
			setData(jsonData);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
		};
		fetchData();
	}, []);


	return (
		<div className="blog-detail-container">
			{data.detail}
			{data.title}  {data.content}
		</div>
	);
	};
	
	export default BlogDetail;