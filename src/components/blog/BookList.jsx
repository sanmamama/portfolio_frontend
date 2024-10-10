
import React, { useEffect, useState } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;

const BookList = () => {
	const [books, setBooks] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const response = await fetch(`${apiUrl}/book/`, 
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);

				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}

				const data = await response.json();
				const books = data["results"];

				// それぞれの本から書影を取得し、thumbnailを追加する
				const updatedBooks = await Promise.all(
					books.map(async (book) => {
						const googleResponse = await fetch(
							`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`,
							{
							method: 'GET',
							headers: {
							'Content-Type': 'application/json',
							},
						}
					);

					const googleData = await googleResponse.json();

					// Google Books API から書影が取得できた場合、thumbnail を追加
					if (googleData.totalItems) {
						const thumbnail = googleData.items[0]?.volumeInfo?.imageLinks?.thumbnail;
					return { ...book, thumbnail: thumbnail || null };
					} else {
					return { ...book, thumbnail: null }; 
					}
					})
				);

				setBooks(updatedBooks);

			} catch (error) {
				setError(error.message);
			}
		};
		fetchBooks();
	}, []);


  

  if (!books) {
    return <div>Loading...</div>;
  }


  if (error) {
    return <div>Error: {error}</div>;
  }

  //https://www.googleapis.com/books/v1/volumes?q=isbn:9784274228797

  // 本のリストを表示
  return (
    <div className="table-responsive">
		<table className="table table-hover table-bordered text-nowrap">
			<thead>
			<tr key={0} className="text-center">
				<td>書影</td>
				<td>タイトル</td>
				<td>著者</td>
				<td>評価</td>
				<td>ジャンル</td>
				<td>読了日</td>
				<td>進捗</td>
				
			</tr>
			</thead>
			<tbody>
			{books.map((book,ix) => (
				<tr key={ix}>
					<td className="text-center">{book.thumbnail ? <img src={book.thumbnail} alt={book.title} height={100} /> : ""}<span className="fs-6"><br/>Powered by<br/>Google Books</span></td>
					<td><b>{book.title}</b></td>
					<td>{book.author}</td>
					<td>{book.rating ? <span className="mark">{book.rating}</span>:""}</td>
					<td><span className="custom-mark">{book.genre}</span></td>
					<td>{book.read_date}</td>
					<td>{book.status}</td>
				</tr>
			))}
			</tbody>
		</table>
	</div>
  );
};

export default BookList;
