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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token); // tokenが空文字ならfalse

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

  // ログイン時にspotifyのユーザー情報を取得
  useEffect(() => {
    if (isLoggedIn) {
      const fetchUser = async () => {
        const userData = await fetch(`https://api.spotify.com/v1/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => res.json())
        return userData;
      }
      const fetchAndEnrollUser = async () => {
        const userData = await fetchUser();
        console.log(userData);
        // ユーザー情報をAPIに送信して、ユーザが登録済みか検証
        await fetch(`http://localhost:8787/api/user/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            spotify_id: userData.id,
            spotify_display_name: userData.display_name,
            spotify_email: userData.email,
          })
        });
      };
      
      fetchAndEnrollUser();
    }
  }, [isLoggedIn]);
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