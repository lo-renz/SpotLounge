// Importing React library
import React from "react";
import { useNavigate } from "react-router-dom";

// Link to the Spotify API documentation used for the pkce authorization code flow:
// https://developer.spotify.com/documentation/web-api/howtos/web-app-profile

// Client ID for Spotify API App
const clientId = "6805fd05381243ae90ac45c9f410aa48";

// Getting the code parameter from the URL
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

// Storing the code in local storage
localStorage.setItem("code", code);

// Function to redirect user to Spotify's authorization page
async function redirectToAuthCodeFlow(clientId) {
  // Generating a code verifier
  const verifier = generateCodeVerifier(128);

  // Generating a code challenge from the verifier
  const challenge = await generateCodeChallenge(verifier);

  // Storing the verifier in local storage
  localStorage.setItem("verifier", verifier);

  // Setting up the parameters for the authorization request
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:5173/home");
  params.append("scope", "user-read-private user-read-email user-top-read");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  // Redirecting the user to the authorization page
  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Function to generate a random code verifier
function generateCodeVerifier(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Generating a random string of the specified length
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Function to generate a code challenge from a code verifier
async function generateCodeChallenge(codeVerifier) {
  // Encoding the verifier and generating a SHA-256 digest
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  // Converting the digest to a URL-safe base64 string
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Function to get an access token from Spotify's API
async function getAccessToken(clientId, code) {
  // Getting the verifier from local storage
  const verifier = localStorage.getItem("verifier");

  // Setting up the parameters for the token request
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:5173/home");
  params.append("code_verifier", verifier);

  // Sending the token request
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  // Extracting the access token from the response
  const { access_token } = await result.json();
  return access_token;
}

// Getting the access token and storing it in local storage
(async () => {
  let accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    accessToken = await getAccessToken(clientId, code);
    localStorage.setItem("accessToken", accessToken);
  }
})();

// React component for Spotify authorization
const SpotifyAuthorization = () => {
  // Redirecting the user to the authorization page
  redirectToAuthCodeFlow(clientId);
  const navigate = useNavigate();
  navigate("/home/hello");

  // Rendering the component
  return (
    <div>
      <h1>Authorization</h1>
    </div>
  );
};

// Exporting the component
export default SpotifyAuthorization;
