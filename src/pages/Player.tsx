import { useState, useEffect } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'
import { spotifyApi } from 'react-spotify-web-playback'
import {
    Button,
    Switch,
    VStack,
    HStack,
    Input,
    Box,
    // Container,
    Text,
} from '@yamada-ui/react'
import { PlaylistCreator } from '../components/PlaylistCreator'

interface PlayerProps {
    access_token: string
}

const Player: React.FC<PlayerProps> = ({ access_token }) => {
    const token = access_token
    const [spotifyUrl, setSpotifyUrl] = useState<string>('spotify:track:2s0xdai1hn2yRLAliZMLRV')
    const [loopEndA, setLoopEndA] = useState<number | null>(null)
    const [loopEndB, setLoopEndB] = useState<number | null>(null)
    const [inputStartTime, setInputStartTime] = useState<string>('')
    const [inputEndTime, setInputEndTime] = useState<string>('')
    const [toggleSwitch, setToggleSwitch] = useState(false)

    // Previous functions remain the same
    const formatTime = (ms: number) => {
        const totalSeconds = ms / 1000
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = (totalSeconds % 60).toFixed(3)
        const formattedSeconds = parseFloat(seconds) < 10 ? `0${seconds}` : seconds

        return `${minutes}:${formattedSeconds}`
    }

    useEffect(() => {
        const handleKeyPress = async (event: KeyboardEvent) => {
            if (event.code === 'Space' && !event.repeat) {
                event.preventDefault()
                const state = await spotifyApi.getPlaybackState(token)
                if (state?.is_playing) {
                    await spotifyApi.pause(token)
                } else {
                    const devices = await spotifyApi.getDevices(token)
                    await spotifyApi.play(token, { deviceId: devices.devices[0].id ?? '' })
                }
            } else if (event.code === 'ArrowLeft' && !event.repeat) {
                await spotifyApi.seek(token, loopEndA ?? 0)
            }
        }

        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [token, loopEndA])

    useEffect(() => {
        const interval = setInterval(async () => {
            const state = await spotifyApi.getPlaybackState(token)
            const ms: number = state?.progress_ms ?? 0

            if (toggleSwitch && loopEndB !== null && ms > loopEndB) {
                spotifyApi.seek(token, loopEndA ?? 0)
                console.log(`Bループを超えたため、Aに戻ります: ${loopEndA}ms`)
            }
        }, 500)

        return () => clearInterval(interval)
    }, [loopEndA, loopEndB, token, toggleSwitch])

    const setLoopEndPositionA = async () => {
        const state = await spotifyApi.getPlaybackState(token)
        const ms: number = state?.progress_ms ?? 0
        setLoopEndA(ms)
        setInputStartTime(formatTime(ms))
        console.log(`Aループの終了位置を設定しました: ${ms}ms`)
    }

    const setLoopEndPositionB = async () => {
        const state = await spotifyApi.getPlaybackState(token)
        const ms: number = state?.progress_ms ?? 0
        setLoopEndB(ms)
        setInputEndTime(formatTime(ms))
        console.log(`Bループの終了位置を設定しました: ${ms}ms`)
    }

    const setCustomLoopEndA = () => {
        const timeInSeconds = parseFloat(inputStartTime)
        if (!isNaN(timeInSeconds)) {
            setLoopEndA(timeInSeconds * 1000)
        }
    }

    const setCustomLoopEndB = () => {
        const timeInSeconds = parseFloat(inputEndTime)
        if (!isNaN(timeInSeconds)) {
            setLoopEndB(timeInSeconds * 1000)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-3xl p-4 bg-white rounded-lg shadow-lg">
                <PlaylistCreator onTrackSelect={setSpotifyUrl} />

                <Box mb={4}>
                    <HStack mb={4}>
                        <Text>現在再生中のトラック</Text>
                        <Input
                            flex={1}
                            value={spotifyUrl}
                            onChange={(e) => setSpotifyUrl(e.target.value)}
                            onBlur={() => setSpotifyUrl(spotifyUrl)}
                        />
                    </HStack>
                    <SpotifyPlayer token={token} uris={spotifyUrl ?? ''} />
                </Box>

                <VStack align="stretch">
                    <HStack >
                        <Text w="24">開始位置</Text>
                        <Button onClick={setLoopEndPositionA}>Now</Button>
                        <Input
                            value={inputStartTime}
                            onChange={(e) => setInputStartTime(e.target.value)}
                            onBlur={setCustomLoopEndA}
                            placeholder="秒数を入力"
                        />
                    </HStack>

                    <HStack >
                        <Text w="24">終了位置</Text>
                        <Button onClick={setLoopEndPositionB}>Now</Button>
                        <Input
                            value={inputEndTime}
                            onChange={(e) => setInputEndTime(e.target.value)}
                            onBlur={setCustomLoopEndB}
                            placeholder="秒数を入力"
                        />
                    </HStack>

                    <HStack>
                        <Switch
                            checked={toggleSwitch}
                            onChange={() => setToggleSwitch(!toggleSwitch)}
                        />
                        <Text>指定範囲をループ</Text>
                    </HStack>
                </VStack>
            </div>
        </div>
    )
}

export default Player

