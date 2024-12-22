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

export function PlaylistView({
    token,
    playlists,
    spotifyUrl,
    onUpdateTrackTimes,
    onDeletePlaylist,

}: PlaylistViewProps) {

    const [loopEndA, setLoopEndA] = useState<number | null>(null)
    const [loopEndB, setLoopEndB] = useState<number | null>(null)
    const [inputStartTime, setInputStartTime] = useState<string>('')
    const [inputEndTime, setInputEndTime] = useState<string>('')
    const [toggleSwitch, setToggleSwitch] = useState(true)
    const [currentTrack, setCurrentTrack] = useState<string>('')
    const [currentlyPlayingTrack, setCurrentlyPlayingTrack] = useState<string>('')


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

    // Previous functions remain the same
    const formatTime = (ms: number) => {
        const totalSeconds = ms / 1000
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = (totalSeconds % 60).toFixed(3)
        const formattedSeconds = parseFloat(seconds) < 10 ? `0${seconds}` : seconds

        return `${minutes}:${formattedSeconds}`
    }


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

    const handleEditButton = (trackId: string) => {
        setCurrentTrack(currentTrack === trackId ? '' : trackId)
    }

    const handlePlayButton = async (uri: string, trackId: string) => {
        setCurrentlyPlayingTrack(currentlyPlayingTrack === trackId ? '' : trackId);
        const devices = await spotifyApi.getDevices(token)
        console.log(uri)
        console.log(devices)
        if (currentlyPlayingTrack === trackId) {
            await spotifyApi.pause(token);
        } else {
            await spotifyApi.play(token, { deviceId: "5ccb304f0655d8412e648ba55225034d1caec96d", uris: [uri] });
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
                                                {loopEndA ? formatTime(loopEndA) : '00:00'} - {loopEndB ? formatTime(loopEndB) : '00:00'}
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
                                                <Button size="sm" onClick={setLoopEndPositionA}>Now</Button>
                                                <Input
                                                    size="sm"
                                                    value={inputStartTime}
                                                    onChange={(e) => setInputStartTime(e.target.value)}
                                                    onBlur={setCustomLoopEndA}
                                                    placeholder="00:00"
                                                />
                                            </HStack>
                                            <HStack>
                                                <Text w="24">終了位置</Text>
                                                <Button size="sm" onClick={setLoopEndPositionB}>Now</Button>
                                                <Input
                                                    size="sm"
                                                    value={inputEndTime}
                                                    onChange={(e) => setInputEndTime(e.target.value)}
                                                    onBlur={setCustomLoopEndB}
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

