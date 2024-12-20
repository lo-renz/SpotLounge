import React, { useEffect, Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import axios from 'axios';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [userId, setId] = useState(null);

  useEffect(() => {
    axios.get('/user/profile').then(response => {
      setId(response.data.userId);
      setUsername(response.data.username);
    });
  }, []);
  
  return (
    <div className='w-full h-20 flex justify-between items-center text-white'>
      <Link to="/home" className='text-3xl font-bold text-[#1db954]'>SpotLounge</Link>
      <ul className='flex items-center'>
        <Link to="/home"><li key='home' className='p-4 py-2 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-9">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg></li></Link>
        <Link to="/messages"><li key='messages' className='p-4 py-2 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-9">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
        </svg></li></Link>
        <Link to="/dataviz"><li key='dataviz' className='p-4 py-2 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-9">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg></li></Link>
        <Link to="/create/post"><li key='post' className='p-4 py-2 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-9">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg></li></Link>
        <li key='settings' className='p-4 py-2'>
          <Menu as="div" className="relative inline-block rounded-xl text-left hover:text-black hover:bg-[#00df9a]">
            <div>
              <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-xl cursor-pointer duration-300 bg-#191414 p-4 py-2 font-semibold shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-9">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

                <ChevronDownIcon className="mr-1 h-9 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={"/profile/" + username}
                        className={classNames(
                          active ? 'bg-gray-100 text-greay-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        My Profile
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={"/settings"}
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={"/"}
                        onClick={() => { localStorage.clear() }}
                        className={classNames(
                          active ? 'bg-gray-100 text-red-400' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Sign Out
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </li>
      </ul>
    </div>
  )
}

export default Navbar