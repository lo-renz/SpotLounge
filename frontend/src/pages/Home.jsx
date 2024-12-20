import React, { useEffect, useState } from 'react';
import PostItem from '../components/PostItem';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Home = () => {
  const [data, setData] = useState([]);

  const [username, setUsername] = useState(null);
  const [userId, setId] = useState(null);

  useEffect(() => {
    axios.get('/user/profile').then(response => {
      setId(response.data.userId);
      setUsername(response.data.username);
    });
  }, []);

  useEffect(() => {
    axios.get('/posts/', {
    }).then(response => setData(response.data.posts))
      .catch(error => console.log(error))
  }, [])

  return (
    <div className="home p-4">
      <Navbar />
      {
        data.map(item => {
          return (
            <div className="card home-card text-white" key={item._id}>
              <PostItem
                key={item._id}
                id={item._id}
                userId={item._id}
                currentUser={username}
                currentUserId={userId}
                username={item.username}
                createdAt={item.createdAt}
                title={item.title}
                file={item.file}
                message={item.message}
                likes={item.likes}
                comments={item.comments}
              />
            </div>
          )
        })
      }</div>
  )
}

export default Home
