
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
	const formatDateToJapanese = (dateString) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = date.getMonth() + 1; // getMonth() は0から11までの値を返すため、+1する必要があります
		const day = date.getDate();
	
		return `${year}年${month}月${day}日`;
	};

	return (
		<div className="blog-detail-container">
			{data.detail}
			{formatDateToJapanese(data.created_at)}
			<h4>{data.title}</h4>
			<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
		</div>
	);
	};
	
	export default BlogDetail;