import './App.css'
import SpotifyPlayer from 'react-spotify-web-playback';
import { spotifyApi } from 'react-spotify-web-playback';
// import Login from './components/Login';
import { useState, useEffect } from 'react'
import { Button, ToggleSwitch } from "flowbite-react";

import { ACCESS_TOKEN } from '../env'

function App() {

  const token = ACCESS_TOKEN;

  const [loopEndA, setLoopEndA] = useState<number | null>(null); // Aループの終了位置を保存するための状態
  const [loopEndB, setLoopEndB] = useState<number | null>(null); // Bループの終了位置を保存するための状態

  const [toggleSwitch, setToggleSwitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const state = await spotifyApi.getPlaybackState(token);
      const ms: number = state?.progress_ms ?? 0;  //現在の秒数

      if (toggleSwitch && loopEndB !== null && ms > loopEndB) {
        spotifyApi.seek(token, loopEndA ?? 0); // Aに戻る
        console.log(`Bループを超えたため、Aに戻ります: ${loopEndA}ms`);
      }
    }, 1000); // 1秒ごとに実行

    return () => clearInterval(interval);
  }, [loopEndA, loopEndB, token, toggleSwitch]);

  const setLoopEndPositionA = async () => {
    const state = await spotifyApi.getPlaybackState(token);
    const ms: number = state?.progress_ms ?? 0;
    setLoopEndA(ms); // 現在の再生位置をAループの終了位置として保存
    console.log(`Aループの終了位置を設定しました: ${ms}ms`);
  }

  const setLoopEndPositionB = async () => {
    const state = await spotifyApi.getPlaybackState(token);
    const ms: number = state?.progress_ms ?? 0;
    setLoopEndB(ms); // 現在の再生位置をBループの終了位置として保存
    console.log(`Bループの終了位置を設定しました: ${ms}ms`);
  }

  const handleToggle = async () => {
    setToggleSwitch(!toggleSwitch);
  }

  return (
    <>
      <SpotifyPlayer
        token={token}
        uris={['spotify:track:2PnlsTsOTLE5jnBnNe2K0A']}
      />
      <div className='flex justify-center'>
        <div className='flex'>
          <div>開始位置</div>
          <Button onClick={setLoopEndPositionA}>Now</Button>
        </div>
        <div className='flex'>
          <div>終了位置</div>
          <Button disabled={loopEndA == null}onClick={setLoopEndPositionB}>Now</Button>
        </div>

        <ToggleSwitch checked={toggleSwitch} label="指定範囲をループ" onChange={handleToggle} />
      </div>
    </>
  )
}

export default App
