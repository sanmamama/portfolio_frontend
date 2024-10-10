
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
						const thumbnail = googleData.items[0]?.volumeInfo?.imageLinks?.thumbnail.replace("http://","https://");
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

  const BookRating = ({ rating }) => {
	// ratingがnullまたは未定義の場合の処理
	if (rating === null || rating === undefined) {
	  return "";
	}
  
	// ratingの数だけ★を表示
	const stars = Array(rating).fill('★'); // ratingの数だけ★を配列に入れる
  
	return (
		<>
		<span className="mark">
		{stars.map((star, index) => (
			<>
				{star}
			</>
		))}
		</span><br/>
		</>
	);
  };
  
  return (
    <div className="table-responsive">
		<table className="table table-hover table-bordered">
			<tbody>
			{books.map((book,ix) => (
				<tr key={ix}>
					<td>
						<p className="text-center">{book.thumbnail ? <img src={book.thumbnail} alt={book.title} height={100} /> : ""}<br/>Powered by<br/>Google Books</p>
					</td>
					<td>
						<BookRating rating={book.rating}/>
						<b>{book.title}</b><br/>
						{book.author} / {book.publisher}<br/>
						<span className="custom-mark">{book.status}</span>{book.read_date}  <br/>
						{book.review}
					</td>
				</tr>
			))}
			</tbody>
		</table>
	</div>
  );
};

export default BookList;
