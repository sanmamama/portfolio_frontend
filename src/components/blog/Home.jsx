import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SidebarContent from './HomeSidebar';
const apiUrl = process.env.REACT_APP_API_URL;



// 日付表記yyyy年mm月へ
function formatDateToJapanese(dateString){
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = date.getMonth() + 1; // getMonth() は0から11までの値を返すため、+1する必要があります
		const day = date.getDate();
	
		return `${year}年${month}月${day}日`;
}

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

const App = () => {
	
    const [blog, setBlog] = useState(null);
	const [pageCount, setPageCount] = useState(null);
    const [currentPage, setCurrentPage] = useState(null);

    // URLパラメータからフィルタ状態を取得
	const query = useQuery();
	const selectedPage = parseInt(query.get('page') || 1,10)
	const selectedCategory = query.get('category') || '';
	const selectedTag = query.get('tag') || '';
	const selectedYearMonth = query.get('date') || '';

    
    const fetchItems = async (currentPage) => {

        const response = await fetch(`${apiUrl}/blog/?page=${selectedPage}&category=${selectedCategory}&tag=${selectedTag}&date=${selectedYearMonth}`);
        const data = await response.json();
        setBlog(data.results);
		setCurrentPage(selectedPage)
		setPageCount(Math.ceil(data.count / 6))
    };

    useEffect(() => {
        fetchItems(currentPage);
    }, [selectedPage, selectedCategory, selectedTag, selectedYearMonth]);


    if (!blog) {
		return <div>Loading...</div>;
	}

	//ページネーション用add URL作成
	let addUrl = []
	if (selectedCategory) {
        addUrl += `&category=${selectedCategory}`
	}
	if (selectedTag) {
        addUrl += `&tag=${selectedTag}`
	}
	if (selectedYearMonth) {
        addUrl += `&date=${selectedYearMonth}`
	}

    return (
		<>
		<div className="col-sm-9">
		<div className="container container-m">
			<div className="row">
			{blog.map(item => (
				<div className="col-md-6" key={item.id}>
					<div className="d-flex flex-column bd-highlight mb-5">
						<div>
							<span className="mt-0 mb-0 text-secondary">{formatDateToJapanese(item.created_at)}</span>
							<span className="ml-2 text-secondary mark small"><Link to={`/?category=${item.category.id}`}>{item.category.name}</Link></span>
							{item.tag.map(
								tag => (
									<span className="ml-2 text-secondary small" key={tag.id}><Link to={`/?tag=${tag.id}`}>{tag.name}</Link></span>
									))}
							<h5>
								<img className="mr-2" src = {item.img} width="50" height="50"></img>
								<span className="align-text-bottom"><Link to={`/detail/${item.id}`}>{item.title}</Link></span>
							</h5>
							<span>
							{truncateTo100Chars(item.content)}
							</span>
							<span className="ml-3">
								<Link to={`/detail/${item.id}`}>続きを見る</Link>
							</span>
							<p>{item.likes}いいね！</p>
						</div>
					</div>
				</div>	
			))}	
			</div>

			<div className="text-center">
				
				{currentPage > 1 ?
				<span className="ml-2"><Link to={`/?page=${currentPage - 1}${addUrl}`}>prev</Link></span>
				:
				<span className="ml-2">prev</span>
				}

				{Array.from({ length: pageCount }).map((_, i) => (
					currentPage != i+1 ?
					<span className="ml-2" key={i}><Link to={`/?page=${i + 1}${addUrl}`}>{i + 1}</Link></span>
					:
					<span className="ml-2" key={i}>{i + 1}</span>
				))}

				{currentPage < pageCount ? 
				<span className="ml-2"><Link to={`/?page=${currentPage + 1}${addUrl}`}>next</Link></span>
				:
				<span className="ml-2">next</span>
				}
			
			</div>
			</div>
			</div>
			<SidebarContent />
	</>
    );
};

export default App;
