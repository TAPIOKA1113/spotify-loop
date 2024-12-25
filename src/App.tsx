import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { refreshToken } from './utils/spotify';
import { apiClient } from './utils/api';

import Login from './pages/Login';
import Player from './pages/Player';

function App() {
  const [token, setToken] = useState<string>(() => {
    // ローカルストレージからトークンを取得
    return localStorage.getItem('spotify_token') || '';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token); // tokenが空文字ならfalse

  // ユーザー情報の状態を追加
  const [userId, setUserId] = useState<string>(() => {
    return localStorage.getItem('spotify_user_id') || '';
  });

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

  // トークンの検証とユーザー情報の取得を一つの useEffect にまとめる
  useEffect(() => {
    const validateAndFetchUser = async () => {
      if (!token) return;

      try {
        // 保存されているユーザー情報があれば、APIコールをスキップ
        if (userId) {
          setIsLoggedIn(true);
          return;
        }

        const userData = await fetch('https://api.spotify.com/v1/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());

        // ユーザー登録とデータの保存
        await apiClient.post('/api/user/register', {
          spotify_id: userData.id,
          spotify_display_name: userData.display_name,
          spotify_email: userData.email,
        });

        // ユーザー情報をローカルストレージに保存
        localStorage.setItem('spotify_user_id', userData.id);
        setUserId(userData.id);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('認証エラー:', error);
        setIsLoggedIn(false);
      }
    };

    validateAndFetchUser();
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