import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const Settings = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios.get('/user/profile').then(response => {
      getEmail(response.data.userId);
    });
  }, []);

  const getEmail = (userId) => {
    axios
      .get(`/user/single-user/${userId}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.existingUser.email);
        setEmail(response.data.existingUser.email);
        setUsername(response.data.existingUser.username);
      });
  };

  return (
    <div className="p-4">
      <Navbar />

      <br />

      <div className="text-white">
        <div className="flex flex-col justify-center items-center space-y-4">
          <div className="flex justify-between items-center w-full bg-gray-800 p-4 rounded-lg">
            <div>
              <h2 className="text-lg font-bold">Email:</h2>
              <p>{email}</p>
            </div>
            <button
              className={`px-4 py-2 border border-gray-300 rounded hover:bg-green-900`}
              onClick={() => navigate("/settings/edit-email")}
            >
              Edit Email
            </button>
          </div>

          <div className="flex justify-between items-center w-full bg-gray-800 p-4 rounded-lg">
            <div>
              <h2 className="text-lg font-bold">Username:</h2>
              <p>{username}</p>
            </div>
            <button
              className={`px-4 py-2 border border-gray-300 rounded hover:bg-green-900`}
              onClick={() => navigate("/settings/edit-username")}
            >
              Edit Username
            </button>
          </div>

          <div className="flex justify-between items-center w-full bg-gray-800 p-4 rounded-lg">
            <div>
              <h2 className="text-lg font-bold">Password:</h2>
              <p className="font-bold">ENCRYPTED</p>
            </div>
            <button
              className={`px-4 py-2 border border-gray-300 rounded hover:bg-green-900`}
              onClick={() => navigate("/settings/edit-password")}
            >
              Edit Password
            </button>
          </div>

          <div className="flex justify-center items-center w-full bg-gray-800 p-4 rounded-lg">
            <button
              className={`px-4 py-2 text-black bg-red-400 rounded hover:bg-red-900`}
              onClick={() => navigate("/settings/delete-account")}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
