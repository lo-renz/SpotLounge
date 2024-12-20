import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Post from "./pages/Post";
import Settings from "./pages/Settings";
import EditEmail from "./pages/EditEmail";
import EditUsername from "./pages/EditUsername";
import EditPassword from "./pages/EditPassword";
import DeleteAccount from "./pages/DeleteAccount";
import SpotifyAuthorization from "./pages/SpotifyVisualization/SpotifyAuthorization";
import DataViz from "./pages/SpotifyVisualization/DataViz";
import Profile from './pages/Profile';
import axios from 'axios';
import { Spotify } from "react-spotify-embed";

const App = () => {
  axios.defaults.baseURL = 'https://spotlounge-backend.onrender.com';
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  var accessToken = localStorage.getItem("accessToken");
  const [tracks, setTracks] = useState('');
  const [recommended, setRecommended] = useState('');
  const [hidden, setHidden] = useState('hidden');

  useEffect(() => {
    const handleBeforeUnload = (event) => {
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  function changeHidden() {
    if (hidden === '') {
      setHidden('hidden')
    } else {
      setHidden('')
    }
  }

  async function getTopTracks() {
    fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const tracks = data.items.map((track, index) => {
          return {
            id: track.id,
          };
        });
        setTracks(tracks);
        var topTracksIds = [];
        for (let i = 0; i < tracks.length; i++) {
          topTracksIds.push(tracks[i].id);
        }
        getRecommendations(topTracksIds)
      });
  };

  async function getRecommendations(topTracksIds) {
    fetch(
      `https://api.spotify.com/v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setRecommended(data.tracks[0].external_urls.spotify);
      });
  };

  const currentUrl = window.location.href;
  if (currentUrl.slice(-1) === '/') {
    accessToken = 'undefined'
  }

  if (currentUrl.slice(21, 30) === '/register') {
    accessToken = 'undefined'
  }

  return (
    <div>
      {accessToken !== 'undefined' && (
        <div className='flex z-10 sticky top-1/2 overflow-visible h-0'>
          <button onClick={() => { changeHidden() }} className="p-4 py-2 m-2 cursor-pointer text-green-500 sticky overflow-hidden h-12">
            <span className=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
            </span>
          </button>
          <div className={'flex ' + hidden}>
            {recommended && (
              <Spotify className='flex w-1/' wide link={recommended} />
            )}
            <button className='p-4 py-2 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 text-white hover:text-black h-12' onClick={getTopTracks}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
            </svg>
            </button>
          </div>
        </div>
      )}
      <Routes >
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/create/post" element={<Post />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/edit-email" element={<EditEmail />} />
        <Route path="/settings/edit-username" element={<EditUsername />} />
        <Route path="/settings/edit-password" element={<EditPassword />} />
        <Route path="/settings/delete-account" element={<DeleteAccount />} />
        <Route path="/authorization" element={<SpotifyAuthorization />} />
        <Route path="/dataviz" element={<DataViz />} />
      </Routes>
    </div>
  );
};

export default App;
