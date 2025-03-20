import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const backendUrl = 'https://backend-2b0w.onrender.com';
  // Extract the access token from the URL after authentication
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    if (accessToken && refreshToken) {
      setAccessToken(accessToken); // Store the access token
      // Optionally, store the refresh token if you want to refresh tokens later
      fetchPlaylists(accessToken); // Fetch playlists once the token is set
    }
  }, []);

  const loginToSpotify = () => {
    window.location.href = 'https://backend-2b0w.onrender.com/login';
  };

  const fetchPlaylists = (token) => {
    setLoading(true);
    axios
      .get(`${backendUrl}/playlists?token=${token}`)  // Pass the token as a query parameter
      .then(response => {
        console.log(response);
        console.log('Playlists response:', response.data); // Log the response data to debug
        if (response.data.items) {
          setPlaylists(response.data.items); // Set the playlists from the response
        } else {
          console.error('Error: No playlists found or API call failed');
        } 
        setLoading(false);
      })
      .catch(error => {
        console.log(token);
        console.error('Error fetching playlists:', error);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Spotify Playlist Manager</h1>

      {/* Login Button */}
      {!accessToken ? (<button onClick={loginToSpotify} style={{ marginBottom: "10px", padding: "10px 20px" }}>
        Login with Spotify
      </button> ) : <>
        <button onClick={fetchPlaylists} style={{ padding: "5px 10px" }}>
          Playlists
        </button>
      </>
}

      {/* Playlist Display */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>

        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              margin: "10px",
              borderRadius: "10px",
              width: "250px",
              textAlign: "center",
              backgroundColor: "#f8f8f8"
            }}
          >
            {/* Playlist Image */}
            {playlist.images.length > 0 ? (
              <img
                src={playlist.images[0].url}
                alt={playlist.name}
                style={{ width: "200px", borderRadius: "5px" }}
              />
            ) : (
              <p>No Image</p>
            )}
            
            <h3 style={{ fontSize: "16px", margin: "10px 0" }}>{playlist.name}</h3>
            <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              Open in Spotify
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;