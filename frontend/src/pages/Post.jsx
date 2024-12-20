import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Textarea } from "@material-tailwind/react";

const Post = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState('');
  const [preview, setPreview] = useState('');

  const token = localStorage.getItem('token');

  const [username, setUsername] = useState('');
  const [id, setId] = useState();

  useEffect(() => {
    axios.get('/user/profile').then(response => {
      setId(response.data.userId);
      setUsername(response.data.username);
    });
  }, []);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  function twoCalls(e) {
    setFile(e.target.files[0])

  }

  const handleImageUpload = async () => {
    if (file) {
      const imageData = new FormData()
      imageData.append('file', file);
      imageData.append('upload_preset', 'SpotLounge');
      imageData.append('cloud_name', 'dcztt9n5q');
      fetch('https://api.cloudinary.com/v1_1/dcztt9n5q/image/upload', {
        method: 'post',
        body: imageData
      })
        .then(response => response.json())
        .then(data => {
          const url = data.url;
          handleCreatePost(url);
        })
        .catch(error => {
          console.log(error);
        })
    } else {
      handleCreatePost('')
    }
  }

  const handleCreatePost = async (url) => {
    const data = JSON.stringify({
      id,
      title,
      message,
      file: url,
      username,
    })

    setLoading(true);
    axios
      .post('/posts/', data, {
        headers: {
          'authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then((data) => {
        setLoading(false);
        enqueueSnackbar(`Post successfully created`, { variant: 'success' });
        navigate('/home');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(`Error`, { variant: 'error' });
        //alert('An error happened. Please check the console');
        console.log(error);
      });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8" >
      <div className='text-2xl font-bold text-[#1db954] flex'>
        <Link className='text-white p-1 bg-[#1db954] rounded-3xl' to='/home'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-[#1db954]">
          Create Post
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium leading-6 text-white">
            Title
          </label>
          <div className="mt-2">
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleImageUpload(); }}
              type="text"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
            Message
          </label>
          <div className="mt-2">
            <Textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleImageUpload(); }}
              type="text"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium leading-6 text-white">
            File
          </label>
          <div className="mt-2">
              <input
                onChange={(e) => twoCalls(e)}
                onKeyDown={(e) => { if (e.key === "Enter") handleImageUpload(); }}
                type="file"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              />
          </div>
          <div>
            {preview && (
              <img src={preview} />
            )}
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            onClick={handleImageUpload}
          >
            Post
          </button>
        </div>

        {loading ? <Spinner /> : ''}
      </div>
    </div >
  )
}

export default Post;