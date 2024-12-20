import React, { useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSnackbar } from "notistack";

const EditEmail = () => {
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleCheckUser = () => {
    const data = {
      oldEmail,
      newEmail,
      password,
    };
    setLoading(true);
    axios
      .put("/user/settings/edit-email", data, {
        headers: {
          'authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar(`Changes saved!`, { variant: 'success' });
        navigate("/home");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        enqueueSnackbar(`Error, something went wrong`, { variant: 'error' });
      });
  };

  return (
    <div className="p-4">
      <Navbar />

      <br />
      <br />
      <br />

      {loading ? <Spinner /> : ""}
      <div className="flex flex-col border-2 border-green-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-white">Enter Old Email</label>
          <input
            type="text"
            value={oldEmail}
            onChange={(e) => setOldEmail(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full text-black"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCheckUser();
            }}
          />
        </div>

        <div className="my-4">
          <label className="text-xl mr-4 text-white">Enter New Email</label>
          <input
            type="text"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full text-black"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCheckUser();
            }}
          />
        </div>

        <div className="my-4">
          <label className="text-xl mr-4 text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full text-black"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCheckUser();
            }}
          />
        </div>

        <button
          className="p-2 bg-green-400 m-8 hover:bg-green-500"
          onClick={handleCheckUser}
        >
          Confirm Changes
        </button>
      </div>
    </div>
  );
};

export default EditEmail;
