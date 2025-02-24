// src/components/Sidebar.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {BlogDataContext} from "./providers/BlogDataProvider"
//const apiUrl = process.env.REACT_APP_API_URL;

const SidebarContent = () => {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [archives, setArchives] = useState([]);
    const {myBlogDataGlobal} = useContext(BlogDataContext);

    

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
        if(myBlogDataGlobal){
            calculateCategories(myBlogDataGlobal);
            calculateTags(myBlogDataGlobal);
            calculateArchives(myBlogDataGlobal);
        }
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
                <div>
                    <h4>プロフィール</h4>
                    <img
                        className="img-fluid"
                        src={`${process.env.REACT_APP_BASE_URL}/media/profile.jpg`}
                        alt="profile"
                    />
                    <p>さんまままといいます。1988年生まれ、北海道在住。大学を卒業後、地方公務員として10年間勤務し、1年半ほど主夫を経て今後エンジニアとして活動予定です。</p>
                    <p>
                        <Link to="https://x.com/sanmamama_">
                            <img
                                    className="me-2 align-baseline"
                                    src={`${process.env.REACT_APP_BASE_URL}/media/icon/x_logo.png`}
                                    width="32"
                                    height="32"
                                    alt="X_logo"
                            />
                        </Link>

                        <Link to="https://github.com/sanmamama/">
                            <img
                                    className="me-2 align-baseline"
                                    src={`${process.env.REACT_APP_BASE_URL}/media/icon/github_logo.png`}
                                    width="32"
                                    height="32"
                                    alt="GitHub_logo"
                            />
                        </Link>
                    </p>
                </div>
                    <hr/>
                <div>
                    <h4>カテゴリー</h4>
                    <ul>
                        {categories.map(([id, { name, count }]) => (
                            <li key={id}>
                                <Link to={`/?category=${name}`}>{name} ({count})</Link>
                            </li>
                        ))}
                    </ul>
                    <h4>タグ</h4>
                    <ul>
                        {tags.map(([id, { name, count }]) => (
                            <li key={id}>
                                <Link to={`/?tag=${name}`}>{name} ({count})</Link>
                            </li>
                        ))}
                    </ul>
                    <h4>アーカイブ</h4>
                    <ul>
                        {archives.map(([month, count]) => (
                            <li key={month}>
                                <Link to={`/?date=${month}`}>{formatMonth(month)} ({count})</Link>
                            </li>
                        )).reverse()}
                    </ul>
                </div>
        </div>
    );
};


export default SidebarContent;