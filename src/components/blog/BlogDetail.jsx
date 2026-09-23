
import React, { useState, useEffect, useContext, useRef, useMemo  } from 'react';
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
	const contentRef = useRef(null);

	useEffect(() => {
		try{
			const index = myBlogDataGlobal.findIndex(obj => obj.id === Number(id));
			setData(myBlogDataGlobal[index])
		}catch{
			return
		}
		
	}, [myBlogDataGlobal,id]);

	useEffect(() => {
		const container = contentRef.current;
		if (!container || !data?.content_html) return;

		let disposed = false;
		const cleanups = [];

		container.querySelectorAll('pre').forEach((pre) => {
			const code = pre.querySelector('code');
			if (!code) return;

			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'code-copy-button';
			button.textContent = 'コピー';
			button.setAttribute('aria-label', 'このコードをコピー');
			button.setAttribute('aria-live', 'polite');

			let resetTimer;

			const handleCopy = async () => {
			button.disabled = true;
			clearTimeout(resetTimer);

			try {
				await navigator.clipboard.writeText(code.textContent || '');

				if (disposed) return;

				button.textContent = 'コピーしました';
			} catch (error) {
				if (disposed) return;

				button.textContent = 'コピーできませんでした';
				console.error('コードのコピーに失敗しました:', error);
			} finally {
				if (!disposed) {
				button.disabled = false;
				resetTimer = setTimeout(() => {
					button.textContent = 'コピー';
				}, 2000);
				}
			}
			};

			// コードが横に長くてもボタンが流れないよう、
			// preの外側に専用の枠を作る
			const wrapper = document.createElement('div');
			wrapper.className = 'code-block-wrapper';

			pre.before(wrapper);
			wrapper.append(button, pre);

			button.addEventListener('click', handleCopy);

			cleanups.push(() => {
			clearTimeout(resetTimer);
			button.removeEventListener('click', handleCopy);
			button.remove();

			// 元のDOM構造に戻す
			if (wrapper.parentNode) {
				wrapper.replaceWith(pre);
			}
			});
		});

		return () => {
			disposed = true;
			cleanups.forEach((cleanup) => cleanup());
		};
		}, [data]);

	useEffect(() => {
		if (!data) return;

		if (data.content_html && window.twttr && window.twttr.widgets) {
			window.twttr.widgets.load();
		}

		const container = contentRef.current;
		if (!container) return;

		const codeBlocks = container.querySelectorAll('pre code');

		// コードがない記事では読み込まない
		if (codeBlocks.length === 0) return;

		let cancelled = false;

		Promise.all([
			import('highlight.js/lib/common'),
			import('highlight.js/styles/atom-one-dark.css'),
		])
			.then(([{ default: hljs }]) => {
				if (cancelled) return;

				codeBlocks.forEach((block) => {
					if (!block.dataset.highlighted) {
						hljs.highlightElement(block);
					}
				});
			})
			.catch((error) => {
				console.error('コードの色付けに失敗しました:', error);
			});

		return () => {
			cancelled = true;
		};
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

	const { previousArticle, nextArticle } = useMemo(() => {
		if (!Array.isArray(myBlogDataGlobal)) {
			return { previousArticle: null, nextArticle: null };
		}

		// 古い記事 → 新しい記事の順。同日時の場合はID順
		const sortedArticles = [...myBlogDataGlobal]
			.filter((article) => !article.is_draft)
			.sort((a, b) => {
			const dateDifference =
				new Date(a.created_at).getTime() -
				new Date(b.created_at).getTime();

			return dateDifference || Number(a.id) - Number(b.id);
			});

		const index = sortedArticles.findIndex(
			(article) => Number(article.id) === Number(id)
		);

		if (index === -1) {
			return { previousArticle: null, nextArticle: null };
		}

		return {
			previousArticle: sortedArticles[index - 1] || null,
			nextArticle: sortedArticles[index + 1] || null,
		};
		}, [myBlogDataGlobal, id]);

	if (data === null) {
		return <div>記事を読み込んでいます。しばらくお待ち下さい。</div>;
	}

	if (!data) {
		return <NotFound />;
	}

	const currentTagIds = new Set(
    	(data.tag || []).map(tag => tag.id)
	);

	const relatedPosts = (myBlogDataGlobal || [])
		.filter(post => post.id !== data.id && !post.is_draft)
		.map(post => ({
			post,
			sharedTagCount: (post.tag || []).filter(
				tag => currentTagIds.has(tag.id)
			).length,
			sameCategory: post.category?.id === data.category?.id,
		}))
		.filter(item => item.sharedTagCount > 0 || item.sameCategory)
		.sort((a, b) =>
			b.sharedTagCount - a.sharedTagCount ||
			Number(b.sameCategory) - Number(a.sameCategory) ||
			new Date(b.post.created_at) - new Date(a.post.created_at)
		)
		.slice(0, 3)
		.map(item => item.post);


	return (
		<>
		
		<div className="col-sm-9 order-1 order-sm-1">
			<h1 className="blog-article-title mb-3">
				{data.title}
			</h1>

			<div className="d-flex align-items-center text-secondary mb-2">
				<img
					className="me-2"
					src={`${process.env.REACT_APP_BASE_URL}/media/icon/calendar.svg`}
					width="16"
					height="16"
					alt=""
				/>
				<time dateTime={data.created_at}>
					{formatDateToJapanese(data.created_at)}
				</time>
			</div>

			<div className="d-flex flex-wrap gap-2 mb-4">
				<Link
					className="article-label article-category"
					to={`/?category=${encodeURIComponent(data.category.name)}`}
				>
					{data.category.name}
				</Link>

				{data.tag.map((tag) => (
					<Link
						key={tag.id}
						className="article-label article-tag"
						to={`/?tag=${encodeURIComponent(tag.name)}`}
					>
						{tag.name}
					</Link>
				))}
			</div>

			<div className="text-center mb-4">
				<img
					className="img-fluid"
					src={data.thumbnail || data.img}
					width="400"
					alt={data.title}
				/>
			</div>


			<div className="d-block d-sm-none">
    			<h4 className="mt-2 mb-2">目次</h4>
    				<div
        				className="pt-2 border body-toc" 
        				dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.toc_html) }}
    				/>
			</div> 

			<div className="markdownx">
					<div ref={contentRef} className="markdownx-preview" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content_html) }} />
					<div className="text-center mb-3">
						<button className="btn btn-outline-primary  mt-3" onClick={handleLike}>いいね！ ({data.likes})</button>
						
					</div>
			</div>

			{(previousArticle || nextArticle) && (
				<nav className="article-pagination" aria-label="前後の記事">
					{previousArticle && (
					<Link
						className="article-pagination-link article-pagination-previous"
						to={`/detail/${previousArticle.id}`}
						rel="prev"
					>
						<span className="article-pagination-label">
						← 前の記事
						</span>
						<span className="article-pagination-title">
						{previousArticle.title}
						</span>
					</Link>
					)}

					{nextArticle && (
					<Link
						className="article-pagination-link article-pagination-next"
						to={`/detail/${nextArticle.id}`}
						rel="next"
					>
						<span className="article-pagination-label">
						次の記事 →
						</span>
						<span className="article-pagination-title">
						{nextArticle.title}
						</span>
					</Link>
					)}
				</nav>
				)}
				
			{relatedPosts.length > 0 && (
				<section className="mt-5" aria-labelledby="related-posts-heading">
					<h2 id="related-posts-heading" className="h4 mb-3">
						関連記事
					</h2>

					<div className="row g-3">
						{relatedPosts.map(post => (
							<div className="col-12 col-md-4" key={post.id}>
								<Link
									to={`/detail/${post.id}`}
									className="card h-100 text-dark text-decoration-none"
								>
									<img
										src={post.thumbnail || post.img}
										alt=""
										loading="lazy"
										width="400"
										height="225"
										className="card-img-top"
										style={{
											aspectRatio: '16 / 9',
											objectFit: 'cover',
											height: 'auto',
										}}
									/>

									<div className="card-body">
										<h3 className="h6 mb-0">
											{post.title}
										</h3>
									</div>
								</Link>
							</div>
						))}
					</div>
				</section>
			)}
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