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
    Box,
    Slide
} from '@yamada-ui/react'
import { Edit, Play, Pause, Edit2, PlayCircle, Trash } from 'lucide-react'
import { spotifyApi } from 'react-spotify-web-playback'
import { useState, useEffect } from 'react'
import { PlaylistEditModal } from './Modal/PlaylistEditModal'
import { PlaylistDeleteModal } from './Modal/PlaylistDeleteModal'
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
    onDeleteSuccess: () => void;
}


export function PlaylistView({
    token,
    playlists,
    onUpdateTrackTimes,
    deviceName,
    onSavePlaylist,
    onDeletePlaylist,
}: PlaylistViewProps) {

    const [toggleSwitch, setToggleSwitch] = useState(true)
    const [currentTrack, setCurrentTrack] = useState<string>('')
    const [currentlyPlayingTrack, setCurrentlyPlayingTrack] = useState<string>('')
    const [isEditPlaylistModalOpen, setIsEditPlaylistModalOpen] = useState(false)
    const [isDeletePlaylistModalOpen, setIsDeletePlaylistModalOpen] = useState(false)
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
    const [showNotification, setShowNotification] = useState(false)
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')
    const [notificationMessage, setNotificationMessage] = useState('')


    useEffect(() => {
        const interval = setInterval(async () => {
            const state = await spotifyApi.getPlaybackState(token)
            const ms: number = state?.progress_ms ?? 0
            const currentTrackId = state?.item?.id
            const duration_ms = state?.item?.duration_ms ?? 0
            const devices = await spotifyApi.getDevices(token)
            const activeDeviceId = devices.devices.find(device => device.is_active)?.id
            const spotifyLoopDevice = devices.devices.find(device => device.name === deviceName);
            const device_id = spotifyLoopDevice?.id;

            if (ms >= duration_ms && currentlyPlayingTrack !== '') {
                await spotifyApi.pause(token)
                return
            }

            if (currentTrackId && toggleSwitch && currentlyPlayingTrack !== '' && ms > playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.endTime! && activeDeviceId === device_id) {
                await spotifyApi.seek(token, playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.startTime ?? 0)
                console.log(`Bループを超えたため、Aに戻ります: ${playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.startTime}ms`)
            }
        }, 500)

        return () => clearInterval(interval)
    }, [currentlyPlayingTrack, token, toggleSwitch, deviceName])

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
            setNotificationType('error')
            setNotificationMessage('開始位置は終了位置より前に設定する必要があります')
            setShowNotification(true)
            setTimeout(() => setShowNotification(false), 3000)
            return
        }

        setCurrentlyPlayingTrack(id)
        console.log(`Aループの終了位置を設定しました: ${ms}ms`)
        onUpdateTrackTimes(playlistId, id, ms, currentEndTime)
        setNotificationType('success')
        setNotificationMessage('ループ位置を更新しました')
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000) // 3秒後に非表示
    }

    // 終了位置を設定
    const setLoopEndPositionB = async (id: string, playlistId: string) => {
        const state = await spotifyApi.getPlaybackState(token)
        const ms: number = state?.progress_ms ?? 0

        const currentTrack = playlists.flatMap(p => p.tracks).find(t => t.id === id)
        const currentStartTime = currentTrack?.startTime ?? 0

        if (currentStartTime && ms <= currentStartTime) {
            setNotificationType('error')
            setNotificationMessage('終了位置は開始位置より後に設定する必要があります')
            setShowNotification(true)
            setTimeout(() => setShowNotification(false), 3000)
            return
        }

        setCurrentlyPlayingTrack(id)
        console.log(`Bループの終了位置を設定しました: ${ms}ms`)
        onUpdateTrackTimes(playlistId, id, currentStartTime, ms)
        setNotificationType('success')
        setNotificationMessage('ループ位置を更新しました')
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000)
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

    const handleDeletePlaylist = async (playlistId: string) => {
        setIsDeletePlaylistModalOpen(true)
        setSelectedPlaylist(playlists.find(p => p.id === playlistId)!)
    }

    const handleDeleteSuccess = () => {
        onDeletePlaylist(selectedPlaylist?.id ?? '')
        setIsDeletePlaylistModalOpen(false)
        setSelectedPlaylist(null)
    }


    return (
        <VStack align="stretch" className="bg-gray-800 rounded-lg p-4">
            <Accordion isToggle variant="card">
                {playlists.map((playlist) => (
                    <AccordionItem label={playlist.name} key={playlist.id} className="border-b border-gray-700 ">
                        <AccordionPanel >
                            <HStack justify="flex-end" mt={1} mb={2}>
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
                                    <Tooltip label="プレイリストを削除">
                                        <IconButton
                                            aria-label="プレイリストを削除"
                                            icon={<Trash />}
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDeletePlaylist(playlist.id)}
                                        />
                                    </Tooltip>
                                </HStack>
                            </HStack>
                            <VStack align="stretch" >
                                {playlist.tracks.map((track) => (
                                    <Box key={track.id} className={`p-2 rounded-md ${currentlyPlayingTrack === track.id ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}`}>
                                        <HStack justify="space-between">
                                            <HStack >
                                                <Image src={track.cover} alt={track.name} width={50} height={50} className="rounded-md" />
                                                <VStack align="start" >
                                                    <Text fontWeight="semibold" className="text-sm">{track.name}</Text>
                                                    <Text fontSize="xs" className="text-gray-400">{track.artist}</Text>
                                                </VStack>
                                            </HStack>
                                            <HStack >
                                                <Text fontSize="xs" className="text-gray-400">
                                                    {formatTime(track.startTime)} - {formatTime(track.endTime)}
                                                </Text>
                                                <IconButton
                                                    aria-label={currentlyPlayingTrack === track.id ? "Pause" : "Play"}
                                                    icon={currentlyPlayingTrack === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handlePlayButton(`spotify:track:${track.trackId}`, track.id)}
                                                    className="text-gray-400 hover:text-spotify-green"
                                                />
                                                <IconButton
                                                    aria-label="Edit"
                                                    icon={<Edit className="w-4 h-4" />}
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleEditButton(track.id)}
                                                    className="text-gray-400 hover:text-spotify-green"
                                                />
                                            </HStack>
                                        </HStack>
                                        {currentTrack === track.id && (
                                            <VStack justify="space-between" mt={2}>
                                                <HStack>
                                                    <Text fontSize="sm" className="text-gray-400">ループ位置の編集画面を開いているときは、ループは一時中断されます。</Text>
                                                </HStack>
                                                <VStack>
                                                    <Button size="xs" onClick={() => setLoopEndPositionA(track.id, playlist.id)} className="bg-spotify-green hover:bg-spotify-green-dark text-white">
                                                        ループの開始位置を設定
                                                    </Button>
                                                </VStack>
                                                <VStack>
                                                    <Button size="xs" onClick={() => setLoopEndPositionB(track.id, playlist.id)} className="bg-spotify-green hover:bg-spotify-green-dark text-white">
                                                        ループの終了位置を設定
                                                    </Button>
                                                </VStack>
                                            </VStack>
                                        )}
                                    </Box>
                                ))}
                            </VStack>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
            {selectedPlaylist && (
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
            )}
            {isDeletePlaylistModalOpen && (
                <PlaylistDeleteModal
                    isOpen={isDeletePlaylistModalOpen}
                    onClose={() => {
                        setIsDeletePlaylistModalOpen(false)
                    }}
                    playlistId={selectedPlaylist?.id ?? ''}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            )}
            {showNotification && (
                <Slide
                    isOpen={showNotification}
                    style={{ zIndex: 10 }}
                    placement="bottom"
                >
                    <Box
                        p={4}
                        bg={notificationType === 'success' ? "green.500" : "red.500"}
                        rounded="md"
                        shadow="md"
                        color="white"
                        textAlign="center"
                    >
                        {notificationMessage}
                    </Box>
                </Slide>
            )}
        </VStack>
    )
}