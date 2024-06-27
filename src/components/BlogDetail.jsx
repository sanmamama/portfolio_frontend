
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';

function sanitizeHtml(html) {
	return DOMPurify.sanitize(html);
}

function replaceHTag(content) {
    let idCounter = 1;
    let toc = '';

    const updatedContent = content.replace(/<(h[4-6])>(.*?)<\/\1>/g, (match, p1, p2) => {
        const tocEntry = `<p class="ml-${p1.charAt(1)-5}"><a href="#${idCounter}">${p2}</a></p>`;
        toc += tocEntry;
        return `<a style="display: block; margin-top: -60px; padding-top: 60px;" id="${idCounter++}"><${p1}>${p2}</${p1}></a>`;


    });

    return { updatedContent, toc };
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

	const handleLike = async () => {
        const response = await fetch(`http://127.0.0.1:8000/api/blog/${id}/like/`, {
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
		<div className="col-sm-9">
			<div className="container container-m">
						{data.detail}
						<span class="mt-0 mb-0 text-secondary">投稿日 {formatDateToJapanese(data.created_at)}　編集日 {formatDateToJapanese(data.updated_at)}</span>
						<span class="ml-2 text-secondary mark small"><Link to={`/?category=${data.category.id}`}>{data.category.name}</Link></span>
						{data.tag.map(
						tag => (
							<span class="ml-2 text-secondary small" key={tag.id}><Link to={`/?tag=${tag.id}`}>{tag.name}</Link></span>
							))}
						<h4 class="mt-1 mb-4">
						<img class="mr-2" src = {data.img} width="50" height="50"></img>
						<span class="align-text-bottom">{data.title}</span>
						</h4>
					<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
					<button class="btn btn-outline-primary" onClick={handleLike}>いいね！ ({data.likes})</button>
			</div>
		</div>
		

		<div className="col-sm-3">
			<div>
				<h3>目次</h3>
				<div dangerouslySetInnerHTML={{ __html: toc }} />
			</div>
		</div>
		</>
	);
	};
	
	export default BlogDetail;