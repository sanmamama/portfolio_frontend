import React, { useEffect, useState ,useContext } from 'react';
import { Link,useLocation } from 'react-router-dom';
import SidebarContent from './HomeSidebar';
import {BlogDataContext} from "./providers/BlogDataProvider"

// カスタムフック: ウィンドウサイズが `576px` 以下かどうかをチェック
const useIsSmallScreen = () => {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 576);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 576);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return isSmallScreen;
};

// 日付表記yyyy年mm月へ
const formatDateToJapanese = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}年${month}月${day}日`;
};

// テキストを100文字までトリム
const truncateTo100Chars = (value) => {
    const clean = /<.*?>/g;
    value = value.replace(clean, '').replace(/&[A-Za-z0-9#]+;/g, '');

    return value.length > 100 ? `${value.slice(0, 100)}.....` : value;
};

// カスタムフック: URLクエリパラメータを取得
const useQuery = () => new URLSearchParams(window.location.search);

// ページネーションリンクの作成
const Pagination = ({ currentPage, pageCount, addUrl }) => (
    pageCount > 1 && (
        <div className="text-center">
            {currentPage > 1 ? (
                <span className="ml-2"><Link to={`/?page=${currentPage - 1}${addUrl}`}>prev</Link></span>
            ) : (
                <span className="ml-2">prev</span>
            )}

            {Array.from({ length: pageCount }).map((_, i) => (
                <span className="ml-2" key={i}>
                    {currentPage !== i + 1 ? (
                        <Link to={`/?page=${i + 1}${addUrl}`}>{i + 1}</Link>
                    ) : (
                        <span>{i + 1}</span>
                    )}
                </span>
            ))}

            {currentPage < pageCount ? (
                <span className="ml-2"><Link to={`/?page=${currentPage + 1}${addUrl}`}>next</Link></span>
            ) : (
                <span className="ml-2">next</span>
            )}
        </div>
    )
);

// ブログアイテムの表示
const BlogItem = ({ item,isSmallScreen }) => (
    <div className="col-md-6 pl-2 pr-2">
        <div className="d-flex flex-column bd-highlight">
			<div>
                <Link className="custom-link-style" to={`/detail/${item.id}`}>
                    <div className="card-img-overlay pl-2 pr-2">
                        <span className="text-secondary mark small">
                            <Link to={`/?category=${item.category.name}`}>{item.category.name}</Link>
                        </span>

                        {item.tag.map(tag => (
                            <span className="ml-2 text-secondary custom-mark small" key={tag.id}>
                                <Link to={`/?tag=${tag.name}`}>{tag.name}</Link>
                            </span>
                        ))}
                    </div>

                    <div className="image-container">
                        <img src={item.img} alt={item.title} />
                    </div>

                    <div>
                        <span>
                            <img
                                className="mr-2 align-baseline"
                                src={`${process.env.REACT_APP_BASE_URL}/media/icon/calendar.svg`}
                                width="16"
                                height="16"
                                alt="calendar"
                            />
                        </span>
                        <span className="text-secondary align-text-bottom">
                            {formatDateToJapanese(item.created_at)}
                        </span>
                    </div>

                    <div>
                        <h5>
                            <p className="mt-3 mb-3">
                                <b>{item.title}</b>
                            </p>
                        </h5>
                    </div>

                    <div className="mb-4">
                        <span className="text-secondary">
                            {truncateTo100Chars(item.content_html)}
                        </span>
                    </div>
                </Link>
				{isSmallScreen && <hr />}
            </div>
        </div>
    </div>
);

const App = () => {
    const {myBlogDataGlobal,setMyBlogDataGlobal} = useContext(BlogDataContext);
    const [blog, setBlog] = useState(null);
    const [pageCount, setPageCount] = useState(null);
    const [currentPage, setCurrentPage] = useState(null);

    const isSmallScreen = useIsSmallScreen();

	//ページ遷移
	const location = useLocation();

    // URLパラメータからフィルタ状態を取得
    const query = useQuery();
    const selectedPage = parseInt(query.get('page') || 1, 10);
    const selectedCategory = query.get('category') || '';
    const selectedTag = query.get('tag') || '';
    const selectedYearMonth = query.get('date') || '';


    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/blog/?page=${selectedPage}&category=${selectedCategory}&tag=${selectedTag}&date=${selectedYearMonth}`
            );
            const data = await response.json();
            //setBlog(data.results);
            setCurrentPage(selectedPage);
            setPageCount(Math.ceil(data.count / 6));
        };

        const filteredBlogs = myBlogDataGlobal.filter((item) => {
            const createdAtDate = new Date(item.created_at);
            const year = createdAtDate.getFullYear();
            const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); // 月は 0 ベースなので +1 する
            const yearMonth = `${year}${month}`;

            return (
                item.category.name === selectedCategory ||
                item.tag.some((tag) => selectedTag.includes(tag.name)) ||
                yearMonth === selectedYearMonth
            );
        })
        if(filteredBlogs.length){
            setBlog(filteredBlogs);
        }else{
            setBlog(myBlogDataGlobal);
        }

        //fetchItems();
    }, [location.search,selectedPage,selectedCategory,selectedTag,selectedYearMonth,myBlogDataGlobal]);


    if (!blog) {
        return <div>Loading...</div>;
    }

    let addUrl = `${selectedCategory ? `&category=${selectedCategory}` : ''}${selectedTag ? `&tag=${selectedTag}` : ''}${selectedYearMonth ? `&date=${selectedYearMonth}` : ''}`;

    return (
        <>
        
            <div className="col-sm-9">
					{selectedPage > 1 || selectedCategory || selectedTag || selectedYearMonth ?
						<div className="mb-2">
							<Link to="/">トップ</Link>
							{selectedCategory ? (<> ＞ {selectedCategory}(カテゴリ)</>):""}
							{selectedTag ? (<> ＞ {selectedTag}(タグ)</>):""}
							{selectedYearMonth ? (<> ＞ {selectedYearMonth}(アーカイブ)</>):""}
						</div>
					:""}

                <div className="container container-m">
                    <div className="row">
                        {blog.map(item => (
                            <BlogItem key={item.id} item={item} isSmallScreen={isSmallScreen} />
                        ))}
                    </div>



                    <Pagination currentPage={currentPage} pageCount={pageCount} addUrl={addUrl} />
                </div>
            </div>
            <SidebarContent />
        </>
    );
};

export default App;
