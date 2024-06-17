import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/blog/');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
	<>
	{data.map(item => (
		<div class="col-md-6">
			<div class="d-flex flex-column bd-highlight mb-5">
				<div key={item.id}>
				<Link to={`/detail/${item.id}`}>{item.title}</Link>
				<p>{item.content}</p>
				</div>
			</div>
		</div>	
	))}		
	</>
	);
	
}

export default App;