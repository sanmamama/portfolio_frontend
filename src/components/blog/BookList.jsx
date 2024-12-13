
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
const apiUrl = process.env.REACT_APP_API_URL;

const BookList = () => {
	const [books, setBooks] = useState([]);
	const [error, setError] = useState(null);
	const [hasMore, setHasMore] = useState(true);


		const fetchBooks = async (page) => {
			try {
				// 0.2秒待機
				await new Promise((resolve) => setTimeout(resolve, 200));

				const response = await fetch(`${apiUrl}/book/?page=${page}`, 
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
				const books2 = data["results"];

				// それぞれの本から書影を取得し、thumbnailを追加する
				const updatedBooks = await Promise.all(
					books2.map(async (book) => {
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
						const infoLink = googleData.items[0]?.volumeInfo?.infoLink.replace("http://","https://");
					return { ...book, thumbnail: thumbnail || null, infoLink: infoLink || null };
					} else {
						return { ...book, thumbnail: null, infoLink: null }; 
					}
					})
				);

				//setBooks(updatedBooks);
				
				setBooks([...books, ...updatedBooks]);
				setHasMore(data.next)

			} catch (error) {
				setError(error.message);
			}
		};


  

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
    <div className="d-flex align-items-center justify-content-center">
				<InfiniteScroll
					loadMore={fetchBooks}
					loader={<div key={0}>Loading ...</div>}
					hasMore={hasMore}
					useWindow={true}
					threshold={5} >
								
				
					{books.map((book,ix) => (
						<div className="row border" key={ix}>
							<div className="col-3 d-flex align-items-center justify-content-center">
								<p className="text-center lh-1 mb-0">{book.thumbnail ? 
									<>
									<a href={book.infoLink}>
										<img src={book.thumbnail} alt={book.title} height={100} />
									</a>
									<br/>
									<span style={{fontSize:"10px"}}>Powered by Google Books</span>
									</>

									:
									<span className="" style={{fontSize:"10px"}}>No Image</span>}<br/>
								</p>

							</div>
							<div className="col-9">
								<BookRating rating={book.rating}/>
								<p><a href={book.infoLink}><b>{book.title}</b></a></p>
								{book.author} / {book.publisher}<br/>
								<span className="custom-mark">{book.status}</span>{book.read_date}  <br/>
								{book.review}
							</div>
						</div>
					))}
				</InfiniteScroll>
	</div>
  );
};

export default BookList;
