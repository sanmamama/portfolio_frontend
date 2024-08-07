
import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

function sanitizeHtml(html) {
	return DOMPurify.sanitize(html);
}

function replaceHTag(content) {
    let idCounter = 1;
    let toc = '';

    const updatedContent = content.replace(/<(h[4-6])>(.*?)<\/\1>/g, (match, p1, p2) => {
        const tocEntry = `<p className="ml-${p1.charAt(1)-5}"><a href="#${idCounter}">${p2}</a></p>`;
        toc += tocEntry;
        return `<a style="display: block; margin-top: -60px; padding-top: 60px;" id="${idCounter++}"><${p1}>${p2}</${p1}></a>`;


    });

    return { updatedContent, toc };
}

const BlogDetail = () => {
	const { id } = useParams();
	const [data, setData] = useState(null);
	const navigate = useNavigate();

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
	}, []);

	const handleBack = () => {
		navigate(-1);  // 1つ前のページに戻る
	  };

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

	const {updatedContent,toc} = replaceHTag(data.content);
	const sanitizedContent = sanitizeHtml(updatedContent);
	
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
			<div className="mb-2">
				<Link onClick={handleBack}>← もどる</Link>
			</div>
			<div className="mb-3">
				<span>
					<img
						className="mr-2 align-baseline"
						src={`${process.env.REACT_APP_BASE_URL}/media/icon/calendar.svg`}
						width="16"
						height="16"
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
				<h4 className="mb-3">{data.title}</h4>
			</div>

			<div className="text-center mb-3">
				<img className="img-fluid" src = {data.img} width="100" height="100"/>
			</div>
		</div>


		<div className="col-sm-9 order-3 order-sm-2">
				<div>
					<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
					<div className="text-center mb-3">
						<button className="btn btn-outline-primary" onClick={handleLike}>いいね！ ({data.likes})</button>
					</div>
				</div>
		</div>
		

		<div className="col-sm-3 order-2 order-sm-1 mb-5">
			<div>
				{toc && (
					<div>
					<h3 className="mb-3">この記事の目次</h3>
					<div className="pt-2 border" dangerouslySetInnerHTML={{ __html: toc }} />
					</div>
				)}
				
			</div>
		</div>
		</>
	);
	};
	
	export default BlogDetail;