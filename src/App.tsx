import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'


import { ACCESS_TOKEN } from '../env'
import Login from './pages/Login';
import Player from './pages/Player';

// ... 既存のインポート ...

function App() {
  const token = ACCESS_TOKEN; // トークンを取得
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token); // ログイン状態を管理

  useEffect(() => {
    // トークンが存在しない場合はログイン状態をfalseに設定
    if (!token) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={isLoggedIn ? <Player /> : <Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;