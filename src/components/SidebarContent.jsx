// src/components/Sidebar.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SidebarContent = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [archives, setArchives] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/blog/')
            .then(response => response.json())
            .then(data => {
                setPosts(data);
                calculateCategories(data);
                calculateTags(data);
                calculateArchives(data);
            })
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

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
        <div>
            <h2>カテゴリー</h2>
            <ul>
                {categories.map(([id, { name, count }]) => (
                    <li key={id}>
                        <Link to={`/?category=${id}`}>{name} ({count})</Link>
                    </li>
                ))}
            </ul>
            <h2>タグ</h2>
            <ul>
                {tags.map(([id, { name, count }]) => (
                    <li key={id}>
                        <Link to={`/?tag=${id}`}>{name} ({count})</Link>
                    </li>
                ))}
            </ul>
            <h2>アーカイブ</h2>
            <ul>
                {archives.map(([month, count]) => (
                    <li key={month}>
                        <Link to={`/?month=${month}`}>{formatMonth(month)} ({count})</Link>
                    </li>
                )).reverse()}
            </ul>
        </div>
    );
};


export default SidebarContent;