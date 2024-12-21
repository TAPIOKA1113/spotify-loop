import { useState, useEffect } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'
import { spotifyApi } from 'react-spotify-web-playback'
import {
    Button,
    VStack,
    Box,
} from '@yamada-ui/react'
import { PlaylistView } from '../components/PlaylistView'
import { PlaylistModal } from '../components/Modal/PlaylistModal'

interface PlayerProps {
    access_token: string
}

interface Track {
    id: string;
    artist: string;
    name: string;
    cover: string;
    defaultEndTime: number;
    startTime?: number;
    endTime?: number;
}

interface Playlist {
    id: string;
    name: string;
    tracks: Track[];
}

const Player: React.FC<PlayerProps> = ({ access_token }) => {
    const token = access_token
    const [spotifyUrl, setSpotifyUrl] = useState<string>('spotify:track:2s0xdai1hn2yRLAliZMLRV')
    const [loopEndA, setLoopEndA] = useState<number | null>(null)
    const [loopEndB, setLoopEndB] = useState<number | null>(null)
    const [inputStartTime, setInputStartTime] = useState<string>('')
    const [inputEndTime, setInputEndTime] = useState<string>('')
    const [toggleSwitch, setToggleSwitch] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [currentTrack, setCurrentTrack] = useState<string>('')

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

    const handleSavePlaylist = (newPlaylist: Playlist) => {
        setPlaylists([...playlists, newPlaylist])
    }

    const handleDeletePlaylist = (playlistId: string) => {
        setPlaylists(playlists.filter(playlist => playlist.id !== playlistId))
    }

    const handlePlayTrack = (trackId: string, startTime?: number, endTime?: number) => {
        setSpotifyUrl(`spotify:track:${trackId}`)
        setCurrentTrack(trackId)
        if (startTime !== undefined) {
            setLoopEndA(startTime)
            setInputStartTime(formatTime(startTime))
        }
        if (endTime !== undefined) {
            setLoopEndB(endTime)
            setInputEndTime(formatTime(endTime))
        }
        setToggleSwitch(startTime !== undefined && endTime !== undefined)
    }

    const handleUpdateTrackTimes = (playlistId: string, trackId: string, startTime?: number, endTime?: number) => {
        setPlaylists(playlists.map(playlist => {
            if (playlist.id === playlistId) {
                return {
                    ...playlist,
                    tracks: playlist.tracks.map(track => {
                        if (track.id === trackId) {
                            return { ...track, startTime, endTime }
                        }
                        return track
                    })
                }
            }
            return playlist
        }))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
                <VStack align="stretch">
                    <Box className="flex justify-center">
                        <Button colorScheme="blue" onClick={() => setIsModalOpen(true)}>
                            プレイリストを作成
                        </Button>
                    </Box>

                    <PlaylistView
                        playlists={playlists}
                        onPlayTrack={handlePlayTrack}
                        onDeletePlaylist={handleDeletePlaylist}
                        onUpdateTrackTimes={handleUpdateTrackTimes}
                        currentTrack={currentTrack}
                        onSetLoopA={setLoopEndPositionA}
                        onSetLoopB={setLoopEndPositionB}
                        inputStartTime={inputStartTime}
                        inputEndTime={inputEndTime}
                        onStartTimeChange={(value) => setInputStartTime(value)}
                        onEndTimeChange={(value) => setInputEndTime(value)}
                        onStartTimeBlur={setCustomLoopEndA}
                        onEndTimeBlur={setCustomLoopEndB}
                    />

                    <Box>
                        <SpotifyPlayer token={token} uris={spotifyUrl ?? ''} />
                    </Box>
                </VStack>

                <PlaylistModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    token={token}
                    onSavePlaylist={handleSavePlaylist}
                />
            </div>
        </div>
    )
}

export default Player

