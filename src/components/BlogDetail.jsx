
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

function sanitizeHtml(html) {
	return DOMPurify.sanitize(html);
}

const BlogDetail = () => {
	const { id } = useParams();
	const [data, setData] = useState(null);

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


	if (!data) {
		return <div>Loading...</div>;
	}

	const sanitizedContent = sanitizeHtml(data.content);

	return (
		<div className="blog-detail-container">
			{data.detail}
			{data.title}
			<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
		</div>
	);
	};
	
	export default BlogDetail;