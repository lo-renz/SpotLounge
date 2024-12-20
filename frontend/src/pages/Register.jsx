import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "notistack";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveUser = () => {
    if (!username || !email || !password || !confirmPassword) {
      enqueueSnackbar("All fields are required", { variant: "error" });
      return;
    }
    const data = {
      username,
      email,
      password,
      confirmPassword,
    };

    setLoading(true);

    axios
      .post("/user/register", data)
      .then((data) => {
        setLoading(false);
        enqueueSnackbar(
          `Account Created, Welcome ${data.data.result.username}`,
          { variant: "success" }
        );
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(`Error, user already exists`, { variant: "error" });
        //alert('An error happened. Please check the console');
      });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-[#1db954]">
          Register an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-white"
          >
            Username
          </label>
          <div className="mt-2">
            <input
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveUser();
              }}
              type="text"
              autoComplete="username"
              placeholder=""
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-white"
          >
            Email
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveUser();
              }}
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-white"
          >
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveUser();
              }}
              type="password"
              autoComplete="password"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium leading-6 text-white"
          >
            Confirm Password
          </label>
          <div className="mt-2">
            <input
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveUser();
              }}
              type="password"
              autoComplete="password"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            onClick={handleSaveUser}
          >
            Register
          </button>
        </div>
        <Link to="/" className="text-green-400 hover:text-green-500">
          <p className="mt-5 text-center">Already Have an Account?</p>
        </Link>
        {loading ? <Spinner /> : ""}
      </div>
    </div>
  );
};

export default Register;
