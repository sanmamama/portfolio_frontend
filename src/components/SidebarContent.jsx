import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SidebarContent() {

    const [category, setCategory] = useState(null);
	const [tag, setTag] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		// カテゴリ一覧を取得
		fetch('http://127.0.0.1:8000/api/category/')
			.then(response => response.json())
			.then(data => setCategory(data))
			.catch(error => setError(error));

		// タグ一覧を取得
		fetch('http://127.0.0.1:8000/api/tag/')
			.then(response => response.json())
			.then(data => setTag(data))
			.catch(error => setError(error));
	}, []);

    if(!category)
        return <div>Loading...</div>;

    if(!tag)
        return <div>Loading...</div>;
    
    return (
        <div>
            <h3>カテゴリー</h3>
            {category.map(item => (
                <p key={item.id}>
                <Link to={`/?category=${item.id}`}>{item.name}</Link>
                </p>
            ))}

            <h3 class="mt-4">タグ</h3>
            {tag.map(item => (
                <p key={item.id}>
                <Link to={`/?tag=${item.id}`}>{item.name}</Link>
                </p>
            ))}

            
        </div>
    );
}

export default SidebarContent;