
import React, { useState, useEffect, useContext } from 'react';
import { useParams} from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import {BlogDataContext} from "./providers/BlogDataProvider"
import NotFound from '../NotFound'
const apiUrl = process.env.REACT_APP_API_URL;


const BlogDetail = () => {
	const { id } = useParams();
	const [data, setData] = useState(null);
	const {myBlogDataGlobal,setMyBlogDataGlobal} = useContext(BlogDataContext);

	useEffect(() => {
		try{
			const index = myBlogDataGlobal.findIndex(obj => obj.id === Number(id));
			setData(myBlogDataGlobal[index])
		}catch{
			return
		}
		
	}, [myBlogDataGlobal,id]);

	useEffect(() => {
		if(data){
			window.hljs.highlightAll();
		}
	}, [data]);

	const formatDateToJapanese = (dateString) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
	
		return `${year}年${month}月${day}日`;
	};

	const handleLike = async () => {
        const response = await fetch(`${apiUrl}/blog/${id}/like/`, {
            method: 'PATCH'
        });
        const res = await response.json();
        //setData({ ...data, likes: res.likes });
		
		const index = myBlogDataGlobal.findIndex(obj => obj.id === Number(id));
		setMyBlogDataGlobal((prevData) => 
			prevData.map((item, idx) => 
				idx === index ? { ...item, likes: res.likes } : item
			)
		);
	}

	if (data === null) {
		return <div>記事を読み込んでいます。しばらくお待ち下さい。</div>;
	}

	if (!data) {
		return <NotFound />;
	}


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
						className="me-2 align-baseline"
						src={`${process.env.REACT_APP_BASE_URL}/media/icon/calendar.svg`}
						width="16"
						height="16"
						alt="calendar"
                    />
				</span>
					<span className="mt-0 mb-0 text-secondary align-text-bottom">
							{formatDateToJapanese(data.created_at)}</span>
					<span className="ms-2 text-secondary mark align-text-bottom"><Link to={`/?category=${data.category.name}`}>{data.category.name}</Link></span>
				{data.tag.map(
				tag => (
					<span className="ms-2 text-secondary custom-mark align-text-bottom" key={tag.id}><Link to={`/?tag=${tag.name}`}>{tag.name}</Link></span>
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
				<div className="pt-2 border body-toc" dangerouslySetInnerHTML={{ __html: data.toc_html }} />			
			</div>

			<div className="markdownx">
					<div className="markdownx-preview" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content_html) }} />
					<div className="text-center mb-3">
						<button className="btn btn-outline-primary  mt-3" onClick={handleLike}>いいね！ ({data.likes})</button>
						
					</div>
			</div>
		</div>


		<div className="col-sm-3 order-2 order-sm-1 mb-3  d-none d-sm-block">
			<div className="stick">
				<h4 className="mb-3">目次</h4>
				<div className="pt-2 border right-sidebar-toc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.toc_html) }} />
			</div>
		</div>
				
		</>
	);
	};
	
	export default BlogDetail;