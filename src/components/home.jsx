import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation, useHistory } from 'react-router-dom';

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

// カスタムフック: URLクエリパラメータを取得
function useQuery() {
	return new URLSearchParams(useLocation().search);
}

function App() {
	const [blog, setBlog] = useState(null);
	const [error, setError] = useState(null);
	
	// URLパラメータからフィルタ状態を取得
	const query = useQuery();
	const selectedCategory = query.get('category') || 'all';
	const selectedTag = query.get('tag') || 'all';
	const selectedMonth = query.get('month') || 'all';

	//月別アーカイブ取得のため
	const year = parseInt(selectedMonth.slice(0, 4), 10);
	const monthNum = parseInt(selectedMonth.slice(4), 10);

	useEffect(() => {
		// ブログ記事一覧を取得
		fetch('http://127.0.0.1:8000/api/blog/')
			.then(response => response.json())
			.then(data => setBlog(data))
			.catch(error => setError(error));

	}, []);
	
	if (!blog) {
		return <div>Loading...</div>;
	}

	// カテゴリフィルターの適用
	const filteredblog = blog.filter(item => {
		const categoryMatch = selectedCategory === 'all' || item.category.id === parseInt(selectedCategory);
		const tagMatch = selectedTag === 'all' || item.tag.some(tag => tag.id === parseInt(selectedTag));
		
        const postDate = new Date(item.created_at);
        const monthMatch = selectedMonth === 'all' || postDate.getFullYear() === year && (postDate.getMonth() + 1) === monthNum;
		return categoryMatch && tagMatch && monthMatch;
	});

	return (
	<>
	{filteredblog.map(item => (
		<div class="col-md-6">
			<div class="d-flex flex-column bd-highlight mb-5">
				<div key={item.id}>
				<Link to={`/detail/${item.id}`}>{item.title}</Link>
				<p>{truncateTo100Chars(item.content)}</p>
				<p>{item.category.name}</p>
				{item.tag.map(
					tag => (
						<span class="mr-3" key={tag.id}>
							{tag.name}
						</span>
						))}
				<p>{item.created_at}</p>
				</div>
			</div>
		</div>	
	))}		
	</>
	);
	
}

export default App;