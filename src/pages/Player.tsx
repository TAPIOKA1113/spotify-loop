import SpotifyPlayer from 'react-spotify-web-playback';
import { spotifyApi } from 'react-spotify-web-playback';
// import Login from './components/Login';
import { useState, useEffect } from 'react'
import { Button, ToggleSwitch } from "flowbite-react";

interface PlayerProps {
    access_token: string;
}

const Player: React.FC<PlayerProps> = ({ access_token }) => {

    const token = access_token;

    const [spotifyUrl, setSpotifyUrl] = useState<string>('spotify:track:2s0xdai1hn2yRLAliZMLRV');

    const [loopEndA, setLoopEndA] = useState<number | null>(null); // Aループの終了位置を保存するための状態
    const [loopEndB, setLoopEndB] = useState<number | null>(null); // Bループの終了位置を保存するための状態

    const [inputStartTime, setInputStartTime] = useState<string>(''); // 開始位置の入力
    const [inputEndTime, setInputEndTime] = useState<string>(''); // 終了位置の入力

    const [toggleSwitch, setToggleSwitch] = useState(false);

    const formatTime = (ms: number) => {
        const totalSeconds = ms / 1000; // ミリ秒を秒に変換
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = (totalSeconds % 60).toFixed(3); // 小数点以下3桁まで表示
        const formattedSeconds = parseFloat(seconds) < 10 ? `0${seconds}` : seconds;

        return `${minutes}:${formattedSeconds}`;
    }

    useEffect(() => {
        const interval = setInterval(async () => {
            const state = await spotifyApi.getPlaybackState(token);
            const ms: number = state?.progress_ms ?? 0;  //現在の秒数

            if (toggleSwitch && loopEndB !== null && ms > loopEndB) {
                spotifyApi.seek(token, loopEndA ?? 0); // Aに戻る
                console.log(`Bループを超えたため、Aに戻ります: ${loopEndA}ms`);
            }
        }, 500); // 1秒ごとに実行

        return () => clearInterval(interval);
    }, [loopEndA, loopEndB, token, toggleSwitch]);

    const setLoopEndPositionA = async () => {
        const state = await spotifyApi.getPlaybackState(token);
        const ms: number = state?.progress_ms ?? 0;
        setLoopEndA(ms); // 現在の再生位置をAループの終了位置として保存
        setInputStartTime(formatTime(ms)); // 秒数に変換して表示
        console.log(`Aループの終了位置を設定しました: ${ms}ms`);
    }

    const setLoopEndPositionB = async () => {
        const state = await spotifyApi.getPlaybackState(token);
        const ms: number = state?.progress_ms ?? 0;
        setLoopEndB(ms); // 現在の再生位置をBループの終了位置として保存
        setInputEndTime(formatTime(ms)); // 秒数に変換して表示
        console.log(`Bループの終了位置を設定しました: ${ms}ms`);
    }

    const setCustomLoopEndA = () => {
        const timeInSeconds = parseFloat(inputStartTime);
        console.log(timeInSeconds)
        if (!isNaN(timeInSeconds)) {
            setLoopEndA(timeInSeconds * 1000); // ミリ秒に変換
        }
    }

    const setCustomLoopEndB = () => {
        const timeInSeconds = parseFloat(inputEndTime);
        console.log(timeInSeconds)
        if (!isNaN(timeInSeconds)) {
            setLoopEndB(timeInSeconds * 1000); // ミリ秒に変換
        }
    }

    const handleToggle = async () => {
        setToggleSwitch(!toggleSwitch);
    }

    return (
        <>
            <div className='flex mb-4 items-center'>
                <div className='mr-4'>SpotifyのトラックURL</div>
                <input
                    className='ml-2'
                    type="text"
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                    onBlur={() => setSpotifyUrl(spotifyUrl)} // フォーカスが外れたときに更新
                />
            </div>
            <SpotifyPlayer
                token={token}
                uris={spotifyUrl ?? ''}
            />
            <div className='mb-10'></div>
            <div className='flex flex-col items-center'>
                <div className='flex mb-4 items-center'>
                    <div className='mr-4'>開始位置</div>
                    <Button onClick={setLoopEndPositionA}>Now</Button>
                    <input
                        className='ml-2'
                        type="text"
                        value={inputStartTime}
                        onChange={(e) => setInputStartTime(e.target.value)}
                        onBlur={setCustomLoopEndA} // フォーカスが外れたときに更新
                        placeholder="秒数を入力"
                    />
                </div>
                <div className='flex mb-4 items-center'>
                    <div className='mr-4'>終了位置</div>
                    <Button onClick={setLoopEndPositionB}>Now</Button>
                    <input
                        className='ml-2'
                        type="text"
                        value={inputEndTime}
                        onChange={(e) => setInputEndTime(e.target.value)}
                        onBlur={setCustomLoopEndB} // フォーカスが外れたときに更新
                        placeholder="秒数を入力"
                    />
                </div>

                <ToggleSwitch checked={toggleSwitch} label="指定範囲をループ" onChange={handleToggle} />
            </div>
        </>
    )
}

export default Player
