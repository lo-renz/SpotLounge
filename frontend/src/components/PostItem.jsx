import { useState } from 'react';
import { Card, Button } from "@material-tailwind/react";
import PostAvatar from './PostAvatar';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PostItem = ({ id, userId, username, createdAt, file, message, currentUser, currentUserId, likes, comments }) => {
  const [like, setLikes] = useState(likes.length);
  const [comment, setComment] = useState(comments);
  const [people, setPeople] = useState(likes);
  const [post, setPost] = useState(id);
  
  const likePost = (id, currentUserId) => {
    const data = {
      postId: id,
      id: currentUserId,
      username: currentUser
    }
    axios.put('/posts/like', data, {
    }).then(data => {
      setLikes(data.data.likes.length)
      setPeople(data.data.likes)
    }).catch(error => {
      console.log(error)
    })
  }

  const unlikePost = (id) => {
    const data = {
      postId: id,
      username: currentUser
    }
    axios.put('/posts/unlike', data, {
    }).then(data => {
      setLikes(data.data.likes.length)
      setPeople(data.data.likes)
    }).catch(err => {
      console.log(err)
    })
  }

  const makeComment = (text, id) => {
    if (text === '') {
      return
    }
    const data = {
      postId: id,
      text: text,
      username: currentUser,
    }
    axios.put('/posts/comment', data, {
    }).then(data => {
      setComment(data.data.comments)
    }).catch(err => {
      console.log(err)
    })
  }

  const deletePost = (postid) => {
    axios.delete(`/posts/${postid}`, {
      headers: { username: currentUser }
    }).then(data => {
      setPost(data)
    })
  }

  return (
    <Card className="max-w-xl mx-auto mt-8 p-4 bg-[#212121] shadow-md rounded-md text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PostAvatar
            userId={id}
            username={username}
            post={true}
            className="mr-4" />
          <div>
            <Link to={"/profile/" + username} className="text-2xl font-bold">{username} </Link>
            <p className="text-sm text-gray-300">{createdAt.replace('T', ' ').slice(0, 10)}</p>
          </div>
        </div>
      </div>
      {file && (
        <img
          alt="Post content"
          className="mt-4 object-cover w-full rounded-md"
          height="500"
          src={file}
          style={{
            aspectRatio: "100/100",
            objectFit: "cover",
          }}
        />
      )}
      <p className="flex mt-4 text-gray-200">
        {message}
      </p>
      <p className="flex text-sm text-gray-300">{createdAt.replace('T', ' ').slice(10, 19)}</p>
      <div className='cursor-pointer w-3 hover:text-red-500'>
        {username === currentUser
          && <svg onClick={() => deletePost(id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        }
      </div>
      <div className="indent-2">
        {people.includes(currentUser)
          ?
          <div className='cursor-pointer w-3'>
            <svg onClick={() => { unlikePost(id, currentUserId) }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill='#00df9a' className="w-7 h-7">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          </div>
          :
          <div className='cursor-pointer w-3'>
            <svg onClick={() => { likePost(id, currentUserId) }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill='currentColor' className="w-7 h-7">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          </div>
        }
        <p className="text-gray-200">
          {like}
        </p>
      </div>
        {comment && (
          comment.slice(0, 3).map(record => {
            return (
              <p className='text-gray-200' key={record._id}>
                <Link key={record._id} className='font-bold mr-2' to={"/profile/" + record.username}>
                  {record.username}
                </Link>
                {record.text}
              </p>
            )
          })
        )}
        <div className="mt-2">
          <form onSubmit={(e) => {
            e.preventDefault()
            makeComment(e.target[0].value, id)
            e.target[0].value = ''
          }}>
            <input className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" type="text" placeholder="add a comment" />
          </form>
        </div>
    </Card>
  )
}

export default PostItem