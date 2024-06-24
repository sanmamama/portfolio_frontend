
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';

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
		<div className="row">
		<div className="blog-detail-container">
			{data.detail}
			<span class="mt-0 mb-0 text-secondary">投稿日 {formatDateToJapanese(data.created_at)}　編集日 {formatDateToJapanese(data.updated_at)}</span>
					<span class="ml-2 text-secondary mark small"><Link to={`/?category=${data.category.id}`}>{data.category.name}</Link></span>
					{data.tag.map(
						tag => (
							<span class="ml-2 text-secondary small" key={tag.id}><Link to={`/?tag=${tag.id}`}>{tag.name}</Link></span>
							))}
					<h4 class="mt-3 mb-3">
						<img class="mr-2" src = {data.img} width="50" height="50"></img>
						<span class="align-text-bottom">{data.title}</span>
					</h4>

					<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
		</div>
		</div>
	);
	};
	
	export default BlogDetail;