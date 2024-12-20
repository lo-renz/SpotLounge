import React, { useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  localStorage.clear();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleCheckUser = () => {
    const data = {
      username,
      password,
    };
    setLoading(true);
    axios
      .post('/user/signin', data)
      .then((data) => {
        const token = data.data.token;
        localStorage.setItem('token', token);
        setLoading(false);
        enqueueSnackbar(`Welcome back ${data.data.result.username}`, { variant: 'success' });
        localStorage.setItem("username", `${data.data.result.username}`);
        navigate('/authorization');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(`Username or Password incorrect`, { variant: 'error' });
        // alert('An error happened. Please check the console');
      });
  };

  return (
    <div className = "flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8" >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-[#1db954]">
            Sign In
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
          <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCheckUser(); }}
                  type="text"
                  autoComplete="username"
                  placeholder=""
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCheckUser(); }}
                  type="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                onClick={handleCheckUser}
              >
                Sign in
              </button>
            </div>
          <Link to="/register" className='text-green-400 hover:text-green-500'><p className='mt-5 text-center'>Don't Have an Account?</p></Link>
          {loading?<Spinner /> : ''}
        </div>
      </div >
  )
}

export default SignIn