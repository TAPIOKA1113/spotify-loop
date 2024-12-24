import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { refreshToken } from './utils/spotify';

import Login from './pages/Login';
import Player from './pages/Player';

function App() {
  const [token, setToken] = useState<string>(() => {
    // ローカルストレージからトークンを取得
    return localStorage.getItem('spotify_token') || '';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token);

  useEffect(() => {
    const fetchToken = async () => {
      const accessToken = await refreshToken();
      if (accessToken) {
        // トークンをローカルストレージに保存
        localStorage.setItem('spotify_token', accessToken);
        setToken(accessToken);
      }
    }
    fetchToken();
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={isLoggedIn ? <Player access_token={token} /> : <Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;