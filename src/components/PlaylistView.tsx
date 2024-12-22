import {
    Accordion,
    AccordionItem,
    AccordionPanel,
    VStack,
    HStack,
    Text,
    Image,
    IconButton,
    Input,
    Button,
    Tooltip,
} from '@yamada-ui/react'
import { Edit, Trash2, Play, Pause } from 'lucide-react'
import { spotifyApi } from 'react-spotify-web-playback'
import { useState, useEffect } from 'react'
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

interface PlaylistViewProps {
    token: string;
    playlists: Playlist[];
    spotifyUrl: string;
    onDeletePlaylist: (playlistId: string) => void;
    onUpdateTrackTimes: (playlistId: string, trackId: string, startTime?: number, endTime?: number) => void;


}

interface TrackTimes {
    [trackId: string]: {
        startTime: number | null;
        endTime: number | null;
        inputStartTime: string;
        inputEndTime: string;
    }
}

export function PlaylistView({
    token,
    playlists,
    onDeletePlaylist,

}: PlaylistViewProps) {

    const [toggleSwitch, setToggleSwitch] = useState(true)
    const [currentTrack, setCurrentTrack] = useState<string>('')
    const [currentlyPlayingTrack, setCurrentlyPlayingTrack] = useState<string>('')
    const [trackTimes, setTrackTimes] = useState<TrackTimes>({})

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
                await spotifyApi.seek(token, trackTimes[currentTrack]?.startTime ?? 0)
            }
        }

        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [token, trackTimes, currentTrack])

    useEffect(() => {
        const interval = setInterval(async () => {
            const state = await spotifyApi.getPlaybackState(token)
            const ms: number = state?.progress_ms ?? 0
            const currentTrackId = state?.item?.id

            if (currentTrackId && toggleSwitch && trackTimes[currentTrackId]?.endTime !== null && ms > trackTimes[currentTrackId].endTime!) {
                spotifyApi.seek(token, trackTimes[currentTrackId].startTime ?? 0)
                console.log(`Bループを超えたため、Aに戻ります: ${trackTimes[currentTrackId].startTime}ms`)
            }
        }, 500)

        return () => clearInterval(interval)
    }, [trackTimes, token, toggleSwitch])

    // Previous functions remain the same
    const formatTime = (ms: number) => {
        const totalSeconds = ms / 1000
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = (totalSeconds % 60).toFixed(3)
        const formattedSeconds = parseFloat(seconds) < 10 ? `0${seconds}` : seconds

        return `${minutes}:${formattedSeconds}`
    }


    const setLoopEndPositionA = async (trackId: string) => {
        const state = await spotifyApi.getPlaybackState(token)
        const ms: number = state?.progress_ms ?? 0
        setTrackTimes(prev => ({
            ...prev,
            [trackId]: {
                ...prev[trackId],
                startTime: ms,
                inputStartTime: formatTime(ms)
            }
        }))
        console.log(`Aループの終了位置を設定しました: ${ms}ms`)
    }

    const setLoopEndPositionB = async (trackId: string) => {
        const state = await spotifyApi.getPlaybackState(token)
        const ms: number = state?.progress_ms ?? 0
        setTrackTimes(prev => ({
            ...prev,
            [trackId]: {
                ...prev[trackId],
                endTime: ms,
                inputEndTime: formatTime(ms)
            }
        }))
        console.log(`Bループの終了位置を設定しました: ${ms}ms`)
    }

    const setCustomLoopEndA = (trackId: string) => {
        const timeInSeconds = parseFloat(trackTimes[trackId]?.inputStartTime ?? '0')
        if (!isNaN(timeInSeconds)) {
            setTrackTimes(prev => ({
                ...prev,
                [trackId]: {
                    ...prev[trackId],
                    startTime: timeInSeconds * 1000
                }
            }))
        }
    }

    const setCustomLoopEndB = (trackId: string) => {
        const timeInSeconds = parseFloat(trackTimes[trackId]?.inputEndTime ?? '0')
        if (!isNaN(timeInSeconds)) {
            setTrackTimes(prev => ({
                ...prev,
                [trackId]: {
                    ...prev[trackId],
                    endTime: timeInSeconds * 1000
                }
            }))
        }
    }

    const handleEditButton = (trackId: string) => {
        if (currentTrack === trackId) {
            setToggleSwitch(true)
            setCurrentTrack('')
        } else {
            setToggleSwitch(false)
            setCurrentTrack(trackId)
        }
    }
    const handlePlayButton = async (uri: string, trackId: string) => {
        setCurrentlyPlayingTrack(currentlyPlayingTrack === trackId ? '' : trackId);

        if (currentlyPlayingTrack === trackId) {
            await spotifyApi.pause(token);
        } else {
            const position_ms = trackTimes[trackId]?.startTime ?? 0;
        
            await fetch('https://api.spotify.com/v1/me/player/play', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uris: [uri],
                    position_ms: position_ms
                })
            });
        }
    };


    return (
        <Accordion isToggle>
            {playlists.map((playlist) => (
                <AccordionItem label={playlist.name} key={playlist.id}>
                    <HStack as="header" justify="space-between" p={2}>
                        <Text fontWeight="bold">{playlist.name}</Text>
                        <IconButton
                            aria-label="Delete playlist"
                            icon={<Trash2 />}
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeletePlaylist(playlist.id);
                            }}
                        />
                    </HStack>
                    <AccordionPanel pb={4}>
                        <VStack align="stretch" >
                            {playlist.tracks.map((track) => (
                                <VStack key={track.id} align="stretch" >
                                    <HStack p={2} bg={currentlyPlayingTrack === track.id ? "blue.100" : "gray.50"} rounded="md" justify="space-between">
                                        <HStack>
                                            <Image src={track.cover} alt={track.name} width={50} height={50} rounded="md" />
                                            <VStack align="start" >
                                                <Text fontWeight="semibold">{track.name}</Text>
                                                <Text fontSize="sm" color="gray.600">{track.artist}</Text>
                                            </VStack>
                                        </HStack>
                                        <HStack>
                                            <Text fontSize="sm" color="gray.600">
                                                {trackTimes[track.id]?.startTime ? formatTime(trackTimes[track.id].startTime ?? 0) : '00:00'} -
                                                {trackTimes[track.id]?.endTime ? formatTime(trackTimes[track.id].endTime ?? 0) : '00:00'}
                                            </Text>
                                            <Tooltip label={currentlyPlayingTrack === track.id ? "Pause" : "Play"}>
                                                <IconButton
                                                    aria-label={currentlyPlayingTrack === track.id ? "Pause track" : "Play track"}
                                                    icon={currentlyPlayingTrack === track.id ? <Pause /> : <Play />}
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handlePlayButton(`spotify:track:${track.id}`, track.id)}
                                                />
                                            </Tooltip>
                                            <IconButton
                                                aria-label="Edit track"
                                                icon={<Edit />}
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEditButton(track.id)}
                                            />
                                        </HStack>
                                    </HStack>

                                    {currentTrack === track.id && (
                                        <VStack align="stretch" p={2} bg="gray.100" rounded="md">
                                            <HStack>
                                                <Text w="24">開始位置</Text>
                                                <Button size="sm" onClick={() => setLoopEndPositionA(track.id)}>Now</Button>
                                                <Input
                                                    size="sm"
                                                    value={trackTimes[track.id]?.inputStartTime ?? ''}
                                                    onChange={(e) => setTrackTimes(prev => ({
                                                        ...prev,
                                                        [track.id]: {
                                                            ...prev[track.id],
                                                            inputStartTime: e.target.value
                                                        }
                                                    }))}
                                                    onBlur={() => setCustomLoopEndA(track.id)}
                                                    placeholder="00:00"
                                                />
                                            </HStack>
                                            <HStack>
                                                <Text w="24">終了位置</Text>
                                                <Button size="sm" onClick={() => setLoopEndPositionB(track.id)}>Now</Button>
                                                <Input
                                                    size="sm"
                                                    value={trackTimes[track.id]?.inputEndTime ?? ''}
                                                    onChange={(e) => setTrackTimes(prev => ({
                                                        ...prev,
                                                        [track.id]: {
                                                            ...prev[track.id],
                                                            inputEndTime: e.target.value
                                                        }
                                                    }))}
                                                    onBlur={() => setCustomLoopEndB(track.id)}
                                                    placeholder="00:00"
                                                />
                                            </HStack>
                                        </VStack>
                                    )}
                                </VStack>
                            ))}
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    )
}

