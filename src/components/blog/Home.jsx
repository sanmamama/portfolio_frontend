import React, { useEffect, useState ,useContext } from 'react';
import { Link,useLocation } from 'react-router-dom';
import SidebarContent from './HomeSidebar';
import {BlogDataContext} from "./providers/BlogDataProvider"

const baseUrl = process.env.REACT_APP_BASE_URL;
const PAGE_SIZE = 12; // ★ 1ページあたりの記事数

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
    value = (value || '').replace(clean, '').replace(/&[A-Za-z0-9#]+;/g, '');
    return value.length > 100 ? `${value.slice(0, 100)}.....` : value;
};

// カスタムフック: URLクエリパラメータを取得
const useQuery = () => new URLSearchParams(window.location.search);

// ページネーションリンクの作成
const Pagination = ({ currentPage, pageCount, addUrl }) => (
    pageCount > 1 && (
        <>
            
            <div className="text-center">
                {currentPage > 1 ? (
                    <span className="ms-2"><Link to={`/?page=${currentPage - 1}${addUrl}`}>prev</Link></span>
                ) : (
                    <span className="ms-2">prev</span>
                )}

                {Array.from({ length: pageCount }).map((_, i) => (
                    <span className="ms-2" key={i}>
                        {currentPage !== i + 1 ? (
                            <Link to={`/?page=${i + 1}${addUrl}`}>{i + 1}</Link>
                        ) : (
                            <span>{i + 1}</span>
                        )}
                    </span>
                ))}

                {currentPage < pageCount ? (
                    <span className="ms-2"><Link to={`/?page=${currentPage + 1}${addUrl}`}>next</Link></span>
                ) : (
                    <span className="ms-2">next</span>
                )}

                <hr/>
            </div>
        </>
    )
);

// ブログアイテムの表示
const BlogItem = ({ item,isSmallScreen }) => (
    <div className="col-md-6 pl-2 pr-2">
        <div className="d-flex flex-column bd-highlight">
			<div>
                <Link className="custom-link-style" to={`/detail/${item.id}`}>
                    <div className="card text-bg-dark border-0">
                        <div className="image-container">
                            <img src={item.img} alt={item.title} className="card-img"/>
                        </div>
                        <div className="card-img-overlay pl-2 pr-2">
                            <span className="text-secondary mark small">
                                <Link to={`/?category=${item.category.name}`}>{item.category.name}</Link>
                            </span>
                            {item.tag.map(tag => (
                                <span className="ms-2 text-secondary custom-mark small" key={tag.id}>
                                    <Link to={`/?tag=${tag.name}`}>{tag.name}</Link>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <span>
                            <img
                                className="me-2 align-baseline"
                                src={`${process.env.REACT_APP_BASE_URL}/media/icon/calendar.svg`}
                                width="16"
                                height="16"
                                alt="calendar"
                            />
                        </span>
                        <span className="text-secondary align-text-bottom">
                            {formatDateToJapanese(item.created_at)}
                        </span>
                        <span className="ms-2 align-text-bottom">
                            <img src={`${baseUrl}/media/icon/heart_active.svg`} width="18" height="18" alt="like"/>{item.likes}
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

const formatDate = (dateString) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    return `${year}年${parseInt(month, 10)}月`;
};

const App = () => {
    const {myBlogDataGlobal} = useContext(BlogDataContext);
    const [blog, setBlog] = useState(null);              // 表示用（スライス済み）
    const [pageCount, setPageCount] = useState(0);       // 総ページ数
    const [currentPage, setCurrentPage] = useState(1);   // 現在ページ（補正後）
    const [articleCount,setArticleCount] = useState("");

    const isSmallScreen = useIsSmallScreen();

	//ページ遷移
	const location = useLocation();

    // URLパラメータからフィルタ状態を取得
    const query = useQuery();
    const selectedPage = parseInt(query.get('page') || 1, 10);
    const selectedCategory = query.get('category') || '';
    const selectedTag = query.get('tag') || '';
    const selectedYearMonth = query.get('date') || '';
    const q = query.get('q') || '';

    useEffect(() => {
        try{
            // まずは「全件のフィルタ結果」を作る
            const filteredBlogsAll = myBlogDataGlobal.filter((item) => {
                const createdAtDate = new Date(item.created_at);
                const year = createdAtDate.getFullYear();
                const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); 
                const yearMonth = `${year}${month}`;

                // ★ 検索（q）：本文/タイトル/カテゴリ/タグ名
                if(q){
                    return (
                        (item.content_html || '').includes(q) ||
                        (item.title || '').includes(q) ||
                        (item.category?.name || '').includes(q) ||
                        (item.tag || []).some(t => (t.name || '').includes(q))
                    );
                }

                // ★ 絞り込み（カテゴリ/タグ/年月）
                if(selectedCategory || selectedTag || selectedYearMonth){
                    return (
                        item.category?.name === selectedCategory ||
                        (item.tag || []).some((tag) => selectedTag.includes(tag.name)) ||
                        yearMonth === selectedYearMonth
                    );
                }

                return true;
            });

            const total = filteredBlogsAll.length;

            if(total){
                // ★ 総ページ数と現在ページを確定（範囲外なら補正）
                const pages = Math.ceil(total / PAGE_SIZE);
                const safePage = Math.min(Math.max(selectedPage, 1), pages);

                // ★ 表示用スライス
                const start = (safePage - 1) * PAGE_SIZE;
                const end = start + PAGE_SIZE;
                const pageSlice = filteredBlogsAll.slice(start, end);

                setBlog(pageSlice);
                setArticleCount(total);
                setPageCount(pages);
                setCurrentPage(safePage);
            }else{
                setBlog(null);
                setArticleCount(0);
                setPageCount(0);
                setCurrentPage(1);
            }
        }catch{
            return;
        }
    // 依存：検索条件・元データ・URLの変化
    }, [location.search, selectedPage, selectedCategory, selectedTag, selectedYearMonth, myBlogDataGlobal, q]);

    if (!blog) {
        if (articleCount === "") {
            return(
                <>
                    <div className="col-sm-9">
                        <div className="container container-m">
                            <div className="row">
                            記事を読み込んでいます。しばらくお待ち下さい。
                            </div>
                        </div>
                    </div>
                    <SidebarContent />
                </>
            );
        }
        else{
            return(
                <>
                    <div className="col-sm-9">
                        <div className="container container-m">
                            <div className="row">
                            「{q}」記事が見つかりません
                            <hr className="mt-3 mb-3 d-sm-none d-block"/>
                            </div>
                        </div>
                    </div>
                    <SidebarContent />
                </>
            );
        }
    }

    let addUrl = `${selectedCategory ? `&category=${selectedCategory}` : ''}${selectedTag ? `&tag=${selectedTag}` : ''}${selectedYearMonth ? `&date=${selectedYearMonth}` : ''}`;

    return (
        <>
            <div className="col-sm-9">
					{currentPage > 1 || selectedCategory || selectedTag || selectedYearMonth ?
						<div className="mb-2">
							<Link to="/">トップ</Link>
							{selectedCategory ? (<> ＞ {selectedCategory}(カテゴリ)</>):""}
							{selectedTag ? (<> ＞ {selectedTag}(タグ)</>):""}
							{selectedYearMonth ? (<> ＞ {formatDate(selectedYearMonth)}(アーカイブ)</>):""}
						</div>
					:""}
                    {q ? 
                        <p>
                        「{q}」{articleCount}件の記事が見つかりました
                        </p>
                    : ""}

                <div className="container container-m">
                    <div className="row">
                        {blog.map(item => (
                            <BlogItem key={item.id} item={item} isSmallScreen={isSmallScreen} />
                        ))}
                    </div>

                    {/* ★ ページネーション */}
                    <Pagination currentPage={currentPage} pageCount={pageCount} addUrl={addUrl} />
                </div>
            </div>

            <SidebarContent />
        </>
    );
};

export default App;
