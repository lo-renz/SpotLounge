import React, { useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSnackbar } from "notistack";

const DeleteAccount = () => {
  const [currentUsername, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleCheckUser = () => {
    const data = {
      currentUsername,
      password,
      confirmationMessage,
    };
    setLoading(true);
    axios
      .delete("/user/settings/delete-account", { data })
      .then(() => {
        localStorage.clear();
        setLoading(false);
        enqueueSnackbar(`Account deleted!`, { variant: "success" });
        enqueueSnackbar(`Sad to see you go!`, { variant: "info" });
        navigate("/"); // should redirect the user to success page then to register page
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        enqueueSnackbar(`Error, something went wrong`, { variant: "error" });
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
          <label className="text-xl mr-4 text-white">Enter Username</label>
          <input
            type="text"
            value={currentUsername}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full text-black"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCheckUser();
            }}
          />
        </div>

        <div className="my-4">
          <label className="text-xl mr-4 text-white">Enter Password</label>
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

        <div className="my-4">
          <label className="text-xl mr-4 text-white">Enter the message: I AM SURE, DELETE MY ACCOUNT</label>
          <input
            type="text"
            value={confirmationMessage}
            onChange={(e) => setConfirmationMessage(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full text-black"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCheckUser();
            }}
          />
        </div>

        <button
          className="p-2 bg-red-400 m-8 hover:bg-red-500"
          onClick={handleCheckUser}
        >
          DELETE ACCOUNT
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
