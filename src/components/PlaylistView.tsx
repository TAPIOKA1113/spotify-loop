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
import { Edit, Trash2, Play, Pause, PlayCircle, Edit2 } from 'lucide-react'
import { spotifyApi } from 'react-spotify-web-playback'
import { useState, useEffect } from 'react'
import { PlaylistEditModal } from './Modal/PlaylistEditModal'
import { switchDevice, playSong } from '../utils/spotify'
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
    onSavePlaylist: (playlist: Playlist) => void;


}


export function PlaylistView({
    token,
    playlists,
    onDeletePlaylist,
    onUpdateTrackTimes,
    deviceName,
    onSavePlaylist,
}: PlaylistViewProps) {

    const [toggleSwitch, setToggleSwitch] = useState(true)
    const [currentTrack, setCurrentTrack] = useState<string>('')
    const [currentlyPlayingTrack, setCurrentlyPlayingTrack] = useState<string>('')
    const [isEditPlaylistModalOpen, setIsEditPlaylistModalOpen] = useState(false)
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)


    useEffect(() => {
        const interval = setInterval(async () => {
            const state = await spotifyApi.getPlaybackState(token)
            const ms: number = state?.progress_ms ?? 0
            const currentTrackId = state?.item?.id
            const duration_ms = state?.item?.duration_ms ?? 0

            if (ms >= duration_ms && currentlyPlayingTrack !== '') {
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
        if (currentlyPlayingTrack === id) {
            await spotifyApi.pause(token);
            setCurrentlyPlayingTrack('');
        } else {
            const position_ms = playlists.flatMap(p => p.tracks).find(t => t.id === id)?.startTime ?? 0;
            const devices = await spotifyApi.getDevices(token);
            const spotifyLoopDevice = devices.devices.find(device => device.name === deviceName);
            const device_id = spotifyLoopDevice?.id;

            if (!device_id) {
                console.error('spotify-loopデバイスが見つかりません');
                return;
            }

            // spotify-loopデバイスがアクティブでない場合のみ切り替えを実行
            if (!spotifyLoopDevice.is_active) await switchDevice(token, device_id)

            // 再生
            await playSong(token, device_id, [uri], position_ms)

            setCurrentlyPlayingTrack(id);
        }
    };

    const handlePlayFromBeginning = async (playlist: Playlist) => {
        const devices = await spotifyApi.getDevices(token);
        const spotifyLoopDevice = devices.devices.find(device => device.name === deviceName);
        const device_id = spotifyLoopDevice?.id;
        const playlistTracks = playlist.tracks.map(track => {
            return {
                ...track
            }
        })
        const uris = playlistTracks.map(track => `spotify:track:${track.trackId}`)
        const initialSongPosition = playlistTracks[0].startTime ?? 0

        if (!device_id) {
            console.error('spotify-loopデバイスが見つかりません');
            return;
        }

        // spotify-loopデバイスがアクティブでない場合のみ切り替えを実行
        if (!spotifyLoopDevice.is_active) await switchDevice(token, device_id)


        await playSong(token, device_id, uris, initialSongPosition)

        setCurrentlyPlayingTrack(playlist.tracks[0].id)
    }

    const handleOpenEditPlaylistModal = (playlist: Playlist) => {
        setSelectedPlaylist(playlist)
        setIsEditPlaylistModalOpen(true);
    };

    const handleSaveEditPlaylistModal = (updatedPlaylist: Playlist) => {
        onSavePlaylist(updatedPlaylist)
        setIsEditPlaylistModalOpen(false);
    };


    return (
        <>
            <VStack align="stretch" >
                {playlists.map((playlist) => (
                    <VStack key={playlist.id} align="stretch" >
                        <Accordion variant="card" isToggle>
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
                                    <HStack justify="flex-end" mb={2}>
                                        <HStack>
                                            <Tooltip label="はじめから再生">
                                                <IconButton
                                                    aria-label="はじめから再生"
                                                    icon={<PlayCircle />}
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handlePlayFromBeginning(playlist)}
                                                />
                                            </Tooltip>
                                            <Tooltip label="プレイリストを編集">
                                                <IconButton
                                                    aria-label="プレイリストを編集"
                                                    icon={<Edit2 />}
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleOpenEditPlaylistModal(playlist)}
                                                />
                                            </Tooltip>
                                        </HStack>
                                    </HStack>
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
                                                        <Text fontSize="sm" color="gray.600">ループ位置の編集画面を開いているときは、ループは一時中断されます。</Text>
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
                        </Accordion>
                    </VStack>
                ))}
            </VStack>

            <PlaylistEditModal
                isOpen={isEditPlaylistModalOpen}
                onClose={() => {
                    setIsEditPlaylistModalOpen(false)
                    setSelectedPlaylist({
                        id: '',
                        name: '',
                        tracks: []
                    })
                }}
                token={token}
                onSavePlaylist={handleSaveEditPlaylistModal}
                playlist={selectedPlaylist}
            />
        </>
    )
}

