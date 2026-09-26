// src/components/Sidebar.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {BlogDataContext} from "./providers/BlogDataProvider"
//const apiUrl = process.env.REACT_APP_API_URL;

// サイドバーの一覧用スケルトン
const SidebarListSkeleton = ({ rows }) => (
    <ul aria-hidden="true">
        {Array.from({ length: rows }, (_, index) => (
            <li key={index} style={{ lineHeight: '1.5' }}>
                <span
                    style={{
                        display: 'inline-block',
                        width: `${65 + (index % 3) * 10}%`,
                        height: '0.85em',
                        backgroundColor: '#e9ecef',
                        borderRadius: 3
                    }}
                />
            </li>
        ))}
    </ul>
);

const SidebarContent = () => {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [archives, setArchives] = useState([]);
    const [isSidebarReady, setIsSidebarReady] = useState(false);

    const {myBlogDataGlobal} = useContext(BlogDataContext);

    const isLoading = myBlogDataGlobal == null || !isSidebarReady;
    
    

    

    // useEffect(() => {
    //     fetch(`${apiUrl}/blog/all/`)
    //         .then(response => response.json())
    //         .then(data => {
    //             calculateCategories(data);
    //             calculateTags(data);
    //             calculateArchives(data);

    //         })
    //         .catch(error => console.error('Error fetching posts:', error));
    // }, []);

    useEffect(() => {
        if (myBlogDataGlobal == null) {
            setIsSidebarReady(false);
            return;
        }

        calculateCategories(myBlogDataGlobal);
        calculateTags(myBlogDataGlobal);
        calculateArchives(myBlogDataGlobal);
        setIsSidebarReady(true);
    }, [myBlogDataGlobal]);



    const calculateCategories = (posts) => {
        const categoryCount = {};
        posts.forEach(post => {
            const category = post.category;
            if (categoryCount[category.id]) {
                categoryCount[category.id].count++;
            } else {
                categoryCount[category.id] = { name: category.name, count: 1 };
            }
        });
        setCategories(Object.entries(categoryCount));
    };

    const calculateTags = (posts) => {
        const tagCount = {};
        posts.forEach(post => {
            post.tag.forEach(tag => {
                if (tagCount[tag.id]) {
                    tagCount[tag.id].count++;
                } else {
                    tagCount[tag.id] = { name: tag.name, count: 1 };
                }
            });
        });
        setTags(Object.entries(tagCount));
    };

    const calculateArchives = (posts) => {
        const archiveCount = {};
        posts.forEach(post => {
            //const month = new Date(post.created_at).toISOString().slice(0, 7); // "2024-06" の形式
            const month = new Date(post.created_at);
            const formattedMonth = month.getFullYear().toString() + ('0' + (month.getMonth() + 1)).slice(-2); // "202406" の形式
            if (archiveCount[formattedMonth]) {
                archiveCount[formattedMonth]++;
            } else {
                archiveCount[formattedMonth] = 1;
            }
        });
        setArchives(Object.entries(archiveCount));
    };

    const formatMonth = (month) => {
        const year = month.slice(0, 4);
        const monthNumber = month.slice(4, 6);
        return `${year}年${parseInt(monthNumber)}月`;
    };

    return (
        <div className="col-sm-3 ps-4 pe-4">
                <div className="sidebar-profile">
                    <h4>プロフィール</h4>

                    <img
                        className="img-fluid sidebar-profile-image"
                        src={`${process.env.REACT_APP_BASE_URL}/media/profile.jpg`}
                        width="282"
                        height="282"
                        alt="プロフィール"
                    />

                    <h5 className="mt-3 fw-bold">
                        さんま
                    </h5>

                    <p className="sidebar-profile-description">
                        元地方公務員のITエンジニア。
                        業務システム開発から、Windows Server・Linux・AWSなどの
                        インフラまで幅広く携わっています。
                    </p>

                    <Link
                        to="/profile"
                        className="btn btn-outline-dark btn-sm w-100 mb-3"
                    >
                        プロフィールを見る
                    </Link>

                    <div className="sidebar-profile-links">
                        <a
                            href="https://x.com/sanmamama_"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X"
                        >
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}/media/icon/x_logo.png`}
                                width="30"
                                height="30"
                                alt="X"
                            />
                        </a>

                        <a
                            href="https://github.com/sanmamama/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}/media/icon/github_logo.png`}
                                width="30"
                                height="30"
                                alt="GitHub"
                            />
                        </a>
                    </div>
                </div>
                <hr/>
                <div aria-busy={isLoading}>
                    {isLoading && (
                        <span role="status" className="visually-hidden">
                            カテゴリー・タグ・アーカイブを読み込んでいます。
                        </span>
                    )}

                    <h4>カテゴリー</h4>
                    {isLoading ? (
                        <SidebarListSkeleton rows={7} />
                    ) : (
                        <ul>
                            {categories.map(([id, { name, count }]) => (
                                <li key={id}>
                                    <Link to={`/?category=${name}`}>
                                        {name} ({count})
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    <h4>タグ</h4>
                    {isLoading ? (
                        <SidebarListSkeleton rows={27} />
                    ) : (
                        <ul>
                            {tags.map(([id, { name, count }]) => (
                                <li key={id}>
                                    <Link to={`/?tag=${name}`}>
                                        {name} ({count})
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    <h4>アーカイブ</h4>
                    {isLoading ? (
                        <SidebarListSkeleton rows={17} />
                    ) : (
                        <ul>
                            {archives.map(([month, count]) => (
                                <li key={month}>
                                    <Link to={`/?date=${month}`}>
                                        {formatMonth(month)} ({count})
                                    </Link>
                                </li>
                            )).reverse()}
                        </ul>
                    )}
                </div>
        </div>
    );
};


export default SidebarContent;