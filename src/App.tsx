import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN, CLIENT_ID, CLIENT_SECRET } from '../env';

import Login from './pages/Login';
import Player from './pages/Player';

function App() {
  const [token, setToken] = useState<string>(ACCESS_TOKEN);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token);

  useEffect(() => {
    const refreshToken = async () => {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: REFRESH_TOKEN,
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        setToken(data.access_token);
      }
    };

    refreshToken();

  }, []);

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [token]);


  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={isLoggedIn ? <Player access_token={token} /> : <Navigate replace to="/login" />} />
        </Routes>

      </Router>
    </>
  );
}

export default App;