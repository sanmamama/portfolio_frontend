import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { BrowserRouter as Router, Route, Switch, useLocation, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    // URLパラメータからフィルタ状態を取得
	const query = useQuery();
	const selectedCategory = query.get('category') || '';
	const selectedTag = query.get('tag') || '';
	const selectedYearMonth = query.get('date') || '';

	//月別アーカイブ取得のため
	const year = parseInt(selectedYearMonth.slice(0, 4), 10);
	const monthNum = parseInt(selectedYearMonth.slice(4), 10);

    
    const fetchItems = async (currentPage) => {
        const response = await fetch(`http://127.0.0.1:8000/api/blog/?page=${currentPage + 1}&category=${selectedCategory}&tag=${selectedTag}&date=${selectedYearMonth}`);
        
        const data = await response.json();
        setBlog(data.results);
        setPageCount(Math.ceil(data.count / 6)); // Adjust according to the page size
    };

    useEffect(() => {
        fetchItems(currentPage);
    }, [currentPage, selectedCategory, selectedTag, selectedYearMonth]);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    if (!blog) {
		return <div>Loading...</div>;
	}




    return (
		<>
			<div className="row">
			{blog.map(item => (
				<div class="col-md-6">
					<div class="d-flex flex-column bd-highlight mb-5">
						<div key={item.id}>
							<span class="mt-0 mb-0 text-secondary">{formatDateToJapanese(item.created_at)}</span>
							<span class="ml-2 text-secondary mark small"><Link to={`/?category=${item.category.id}`}>{item.category.name}</Link></span>
							{item.tag.map(
								tag => (
									<span class="ml-2 text-secondary small" key={tag.id}><Link to={`/?tag=${tag.id}`}>{tag.name}</Link></span>
									))}
							<h5>
								<img class="mr-2" src = {item.img} width="50" height="50"></img>
								<span class="align-text-bottom"><Link to={`/detail/${item.id}`}>{item.title}</Link></span>
							</h5>
							<span>
							{truncateTo100Chars(item.content)}
							</span>
							<span class="ml-3">
								<Link to={`/detail/${item.id}`}>続きを見る
								</Link>
							</span>
							
						</div>
					</div>
				</div>	
			))}	
			</div>
			<div>
			<ReactPaginate
						previousLabel={'previous'}
						nextLabel={'next'}
						breakLabel={'...'}
						breakClassName={'break-me'}
						pageCount={pageCount}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						onPageChange={handlePageClick}
						containerClassName={'pagination'}
						subContainerClassName={'pages pagination'}
						activeClassName={'active'}
						pageClassName='page-item'
						pageLinkClassName='page-link'
						previousClassName='page-item'
						nextClassName='page-item'
						previousLinkClassName='page-link'
						nextLinkClassName='page-link'
						disabledClassName='disabled'
						breakLinkClassName='page-link'
					/>
			</div>
	</>
    );
};

export default App;
