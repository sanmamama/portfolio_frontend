
import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

function sanitizeHtml(html) {
	return DOMPurify.sanitize(html);
}

const BlogDetail = () => {
	const { id } = useParams();
	const [data, setData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
		try {
			const url = `${apiUrl}/blog/${id}/`;
			const response = await fetch(url);
			const jsonData = await response.json();
			setData(jsonData);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
		};
		fetchData();
	}, [id]);


	const handleLike = async () => {
        const response = await fetch(`${apiUrl}/blog/${id}/like/`, {
            method: 'PATCH'
        });
        const res = await response.json();
        setData({ ...data, likes: res.likes });
    };
	


	if (!data) {
		return <div>Loading...</div>;
	}

	const sanitizedContent = sanitizeHtml(data.content_html);
	
	const formatDateToJapanese = (dateString) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
	
		return `${year}年${month}月${day}日`;
	};

	return (
		<>
		<div className="col-sm-9 order-1 order-sm-1">
			<div className="mb-3">
				<Link to="/">トップ </Link>
				<Link to={`/?category=${data.category.name}`}>＞ {data.category.name} </Link>
				＞ {data.title}
				

			</div>
			<div className="mb-1">
				<span>
					<img
						className="mr-2 align-baseline"
						src={`${process.env.REACT_APP_BASE_URL}/media/icon/calendar.svg`}
						width="16"
						height="16"
						alt="calendar"
                    />
				</span>
					<span className="mt-0 mb-0 text-secondary align-text-bottom">
							{formatDateToJapanese(data.created_at)}</span>
					<span className="ml-2 text-secondary mark align-text-bottom"><Link to={`/?category=${data.category.id}`}>{data.category.name}</Link></span>
				{data.tag.map(
				tag => (
					<span className="ml-2 text-secondary custom-mark align-text-bottom" key={tag.id}><Link to={`/?tag=${tag.id}`}>{tag.name}</Link></span>
				))}
			</div>

			<div>
				<h4 className="mb-3"><b>{data.title}</b></h4>
			</div>

			<div className="text-center">
				<img className="img-fluid" src = {data.img} width="400" height="150" alt="data"/>
			</div>

			<div>
				<h4 className="mt-2 mb-2">目次</h4>
				<div className="pt-2 border" dangerouslySetInnerHTML={{ __html: data.toc_html }} />			
			</div>

			<div className="markdownx">
					<div className="markdownx-preview" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
					<div className="text-center mb-3">
						<button className="btn btn-outline-primary" onClick={handleLike}>いいね！ ({data.likes})</button>
					</div>
			</div>
		</div>


		<div className="col-sm-3 order-2 order-sm-1 mb-3  d-none d-sm-block">
			<div className="stick">
				<h4 className="mb-3">目次</h4>
				<div className="pt-2 border" dangerouslySetInnerHTML={{ __html: data.toc_html }} />
			</div>
		</div>
				
		</>
	);
	};
	
	export default BlogDetail;