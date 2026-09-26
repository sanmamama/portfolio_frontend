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
const Pagination = ({
  currentPage,
  pageCount,
  size,
  maxButtons = 4,
  isSmallScreen
}) => {
  const location = useLocation();

  if (pageCount <= 1) return null;

  // 検索・カテゴリー・タグなどを保持してページ番号だけ変更
  const q = (p) => {
    const params = new URLSearchParams(location.search);
    params.set("page", String(p));

    return `${location.pathname}?${params.toString()}`;
  };

  // 表示ウィンドウ計算（先頭/末尾は常に出し、間は省略可）
  const start = Math.max(2, currentPage - maxButtons);
  const end   = Math.min(pageCount - 1, currentPage + maxButtons);

  const pages = [];
  pages.push(1);
  if (start > 2) pages.push("left-ellipsis");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < pageCount - 1) pages.push("right-ellipsis");
  if (pageCount > 1) pages.push(pageCount);

  const sizeClass = size ? ` pagination-${size}` : "";

  return (
    <>
    <nav aria-label="Pagination">
      <ul className={`pagination justify-content-center${sizeClass} my-3`}>
        {/* Prev */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          {currentPage === 1 ? (
            <span className="page-link" aria-hidden="true">‹</span>
          ) : (
            <Link className="page-link" to={q(currentPage - 1)} aria-label="Previous">‹</Link>
          )}
        </li>

        {/* 数字 & 省略 */}
        {pages.map((p, idx) => {
          if (p === "left-ellipsis" || p === "right-ellipsis") {
            return (
              <li key={p + idx} className="page-item disabled">
                <span className="page-link">…</span>
              </li>
            );
          }
          const active = p === currentPage;
          return (
            <li key={p} className={`page-item ${active ? "active" : ""}`}>
              {active ? (
                <span className="page-link">
                  {p} <span className="visually-hidden">(current)</span>
                </span>
              ) : (
                <Link className="page-link" to={q(p)}>{p}</Link>
              )}
            </li>
          );
        })}

        {/* Next */}
        <li className={`page-item ${currentPage === pageCount ? "disabled" : ""}`}>
          {currentPage === pageCount ? (
            <span className="page-link" aria-hidden="true">›</span>
          ) : (
            <Link className="page-link" to={q(currentPage + 1)} aria-label="Next">›</Link>
          )}
        </li>
      </ul>
    </nav>
    {isSmallScreen && <hr />}
    </>
  );
};

// ブログアイテムの表示
const BlogItem = ({ item, isSmallScreen }) => (
    <div className="col-md-6 pl-2 pr-2 d-flex">
        <article className="blog-list-item">
            <div className="mb-3">
                <div className="card text-bg-dark border-0">
                    <div className="image-container">
                        <img
                            src={item.thumbnail || item.img}
                            alt={item.title}
                            className="card-img"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>

            <h2 className="blog-card-title mb-2">
                <Link
                    className="text-dark text-decoration-none stretched-link"
                    to={`/detail/${item.id}`}
                >
                    {item.title}
                </Link>
            </h2>

            <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small mb-2">
                <span className="d-inline-flex align-items-center">
                    <img
                        className="me-2"
                        src={`${baseUrl}/media/icon/calendar.svg`}
                        width="16"
                        height="16"
                        alt=""
                    />
                    <time dateTime={item.created_at}>
                        {formatDateToJapanese(item.created_at)}
                    </time>
                </span>

                <span className="d-inline-flex align-items-center">
                    <img
                        className="me-1"
                        src={`${baseUrl}/media/icon/heart_active.svg`}
                        width="18"
                        height="18"
                        alt="いいね"
                    />
                    {item.likes}
                </span>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-3 blog-card-labels">
                <Link
                    className="article-label article-category"
                    to={`/?category=${encodeURIComponent(item.category.name)}`}
                >
                    {item.category.name}
                </Link>

                {item.tag.map((tag) => (
                    <Link
                        key={tag.id}
                        className="article-label article-tag"
                        to={`/?tag=${encodeURIComponent(tag.name)}`}
                    >
                        {tag.name}
                    </Link>
                ))}
            </div>

            <p className="text-secondary mb-0 blog-card-excerpt">
                {truncateTo100Chars(item.content_html)}
            </p>
        </article>

    </div>
);

const formatDate = (dateString) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    return `${year}年${parseInt(month, 10)}月`;
};

// 読み込み中の記事一覧
const BlogListSkeleton = ({ isSmallScreen }) => (
    <>
        <div role="status" className="visually-hidden">
            記事を読み込んでいます。
        </div>

        <div className="row" aria-hidden="true">
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
                <div className="col-md-6 pl-2 pr-2" key={index}>
                    <div className="mb-4">
                        {/* サムネイル */}
                        <div
                            className="mb-3"
                            style={{
                                height: 150,
                                backgroundColor: '#e9ecef',
                                borderRadius: 4
                            }}
                        />

                        {/* タイトル：2行分 */}
                        <div
                            className="mb-2"
                            style={{
                                height: 60,
                                backgroundColor: '#e9ecef',
                                borderRadius: 4
                            }}
                        />

                        {/* 公開日・いいね数 */}
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <div
                                style={{
                                    width: 140,
                                    height: 21,
                                    backgroundColor: '#e9ecef',
                                    borderRadius: 4
                                }}
                            />
                            <div
                                style={{
                                    width: 40,
                                    height: 21,
                                    backgroundColor: '#e9ecef',
                                    borderRadius: 4
                                }}
                            />
                        </div>

                        {/* カテゴリー・タグ */}
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            {[100, 90, 60].map((width, labelIndex) => (
                                <div
                                    key={labelIndex}
                                    style={{
                                        width,
                                        height: 33,
                                        backgroundColor: '#e9ecef',
                                        borderRadius: 5
                                    }}
                                />
                            ))}
                        </div>

                        {/* 本文の抜粋 */}
                        <div
                            style={{
                                height: 120,
                                backgroundColor: '#f1f3f5',
                                borderRadius: 4
                            }}
                        />
                    </div>

                    {isSmallScreen && <hr />}
                </div>
            ))}
        </div>
    </>
);

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
                    <div className="col-sm-9" aria-busy="true">
                        <div className="container container-m">
                            <BlogListSkeleton isSmallScreen={isSmallScreen} />
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
                    <Pagination currentPage={currentPage} pageCount={pageCount} addUrl={addUrl} isSmallScreen={isSmallScreen} />
                </div>
            </div>

            <SidebarContent />
        </>
    );
};

export default App;
