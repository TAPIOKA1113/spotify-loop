import {
    Accordion,
    AccordionItem,
    AccordionPanel,
    VStack,
    HStack,
    Text,
    Image,
    IconButton,
    Button,
    Tooltip,
} from '@yamada-ui/react'
import { Edit, Trash2, Play, Pause } from 'lucide-react'
import { spotifyApi } from 'react-spotify-web-playback'
import { useState, useEffect } from 'react'
interface Track {
    id: string;
    trackId: string;
    artist: string;
    name: string;
    cover: string;
    startTime: number;
    endTime: number;
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
    onUpdateTrackTimes: (playlistId: string, trackId: string, startTime: number, endTime: number) => void;
    deviceName: string;

}


export function PlaylistView({
    token,
    playlists,
    onDeletePlaylist,
    onUpdateTrackTimes,
    deviceName,
}: PlaylistViewProps) {

    const [toggleSwitch, setToggleSwitch] = useState(true)
    const [currentTrack, setCurrentTrack] = useState<string>('')
    const [currentlyPlayingTrack, setCurrentlyPlayingTrack] = useState<string>('')



    useEffect(() => {
        const interval = setInterval(async () => {
            const state = await spotifyApi.getPlaybackState(token)
            const ms: number = state?.progress_ms ?? 0
            const currentTrackId = state?.item?.id
            const duration_ms = state?.item?.duration_ms ?? 0

            if (ms >= duration_ms) {
                await spotifyApi.pause(token)
                return
            }

            if (currentTrackId && toggleSwitch && currentlyPlayingTrack !== '' && ms > playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.endTime!) {
                await spotifyApi.seek(token, playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.startTime ?? 0)
                console.log(`Bループを超えたため、Aに戻ります: ${playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.startTime}ms`)
            }
        }, 500)

        return () => clearInterval(interval)
    }, [currentlyPlayingTrack, token, toggleSwitch])

    const formatTime = (ms: number) => {
        const totalSeconds = ms / 1000
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = (totalSeconds % 60).toFixed(3)
        const formattedSeconds = parseFloat(seconds) < 10 ? `0${seconds}` : seconds

        return `${minutes}:${formattedSeconds}`
    }

    // 開始位置を設定
    const setLoopEndPositionA = async (id: string, playlistId: string) => {
        const state = await spotifyApi.getPlaybackState(token)
        const ms: number = state?.progress_ms ?? 0
        const duration_ms: number = state?.item?.duration_ms ?? 0

        // 現在のトラックのendTimeを取得
        const currentTrack = playlists.flatMap(p => p.tracks).find(t => t.id === id)
        const currentEndTime = currentTrack?.endTime ?? duration_ms  // endTimeが未設定の場合は曲の長さを使用

        // Bの時間が設定されている場合、Aの時間がBより後にならないようにチェック
        if (currentEndTime && ms >= currentEndTime) {
            console.log('開始位置は終了位置より前に設定する必要があります')
            return
        }

        setCurrentlyPlayingTrack(id)
        console.log(`Aループの終了位置を設定しました: ${ms}ms`)
        onUpdateTrackTimes(playlistId, id, ms, currentEndTime)
    }

    // 終了位置を設定
    const setLoopEndPositionB = async (id: string, playlistId: string) => {
        const state = await spotifyApi.getPlaybackState(token)
        const ms: number = state?.progress_ms ?? 0

        // 現在のトラックのstartTimeを取得
        const currentTrack = playlists.flatMap(p => p.tracks).find(t => t.id === id)
        const currentStartTime = currentTrack?.startTime ?? 0

        // Aの時間が設定されている場合、Bの時間がAより前にならないようにチェック
        if (currentStartTime && ms <= currentStartTime) {
            console.log('終了位置は開始位置より後に設定する必要があります')
            return
        }

        setCurrentlyPlayingTrack(id)
        console.log(`Bループの終了位置を設定しました: ${ms}ms`)
        onUpdateTrackTimes(playlistId, id, currentStartTime, ms)
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
    const handlePlayButton = async (uri: string, id: string) => {
        setCurrentlyPlayingTrack(currentlyPlayingTrack === id ? '' : id);

        if (currentlyPlayingTrack === id) {
            await spotifyApi.pause(token);
        } else {
            const position_ms = playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.startTime ?? 0;
            const devices = await spotifyApi.getDevices(token);
            const spotifyLoopDevice = devices.devices.find(device => device.name === deviceName);
            const device_id = spotifyLoopDevice?.id;
            console.log(devices)
            console.log(device_id)
            console.log(currentlyPlayingTrack)
            console.log(playlists)

            if (!device_id) {
                console.error('spotify-loopデバイスが見つかりません');
                return;
            }

            // spotify-loopデバイスがアクティブでない場合のみ切り替えを実行
            if (!spotifyLoopDevice.is_active) {
                await fetch('https://api.spotify.com/v1/me/player', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        device_ids: [device_id],
                        play: false
                    })
                });
            }

            // 再生
            await fetch('https://api.spotify.com/v1/me/player/play', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uris: [uri],
                    position_ms: position_ms,
                    device_id: device_id
                })
            });


        }
    };


    return (
        <Accordion variant="card" isToggle>
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
                    <AccordionPanel pb={4} mt={2}>
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
                                                {track.startTime ? formatTime(track.startTime ?? 0) : '00:00'} -
                                                {track.endTime ? formatTime(track.endTime ?? 0) : formatTime(track.endTime)}
                                            </Text>
                                            <Tooltip label={currentlyPlayingTrack === track.id ? "Pause" : "Play"}>
                                                <IconButton
                                                    aria-label={currentlyPlayingTrack === track.id ? "Pause track" : "Play track"}
                                                    icon={currentlyPlayingTrack === track.id ? <Pause /> : <Play />}
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handlePlayButton(`spotify:track:${track.trackId}`, track.id)}
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
                                            <Text fontSize="sm" color="gray.600">ループ位置の編集画面を開いているときは、ループ��一時中断されます。</Text>
                                            <HStack>
                                                <Text w="24">開始位置</Text>
                                                <Button size="sm" onClick={() => setLoopEndPositionA(track.id, playlist.id)}>Now</Button>
                                                <Text>{formatTime(track.startTime) ?? '00:00'}</Text>
                                            </HStack>
                                            <HStack>
                                                <Text w="24">終了位置</Text>
                                                <Button size="sm" onClick={() => setLoopEndPositionB(track.id, playlist.id)}>Now</Button>
                                                <Text>{formatTime(track.endTime) ?? formatTime(track.endTime)}</Text>

                                            </HStack>
                                        </VStack>
                                    )}
                                </VStack>
                            ))}
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            ))
            }
        </Accordion >
    )
}

