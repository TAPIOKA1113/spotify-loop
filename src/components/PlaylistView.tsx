import {
    Accordion,
    AccordionItem,
    AccordionPanel,
    AccordionLabel,
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
import { Edit, Play, Pause, PlayCircle, Trash, Shuffle } from 'lucide-react'
import { spotifyApi } from 'react-spotify-web-playback'
import { useState, useEffect } from 'react'
import { PlaylistEditModal } from './Modal/PlaylistEditModal'
import { PlaylistDeleteModal } from './Modal/PlaylistDeleteModal'
import { switchDevice, playSong } from '../utils/spotify'
import { Playlist } from '../types/Playlist'
import { apiClient } from '../utils/api'

interface PlaylistViewProps {
    token: string;
    playlists: Playlist[];
    spotifyUrl: string;
    onDeletePlaylist: (playlistId: string) => void;
    onUpdateTrackTimes: (playlistId: string, trackId: string, start_time: number, end_time: number) => void;
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

    const [isPlaylistMode, setIsPlaylistMode] = useState(false);
    const [isShuffleMode, setIsShuffleMode] = useState(false);
    const [shuffledTracks, setShuffledTracks] = useState<any[]>([]);


    const updateTracksSendApi = async (playlistId: string, updatedPlaylist: Playlist) => {
        const userId = localStorage.getItem('spotify_user_id')
        const response = await apiClient.put(`/api/playlists/${userId}/${playlistId}`, {
            updatedPlaylist
        })
        console.log(updatedPlaylist)
        console.log(response)
        return response
    }


    // useEffectを修正
    useEffect(() => {
        const interval = setInterval(async () => {
            const state = await spotifyApi.getPlaybackState(token)
            const ms: number = state?.progress_ms ?? 0 // 再生位置
            const currentTrackId = state?.item?.id
            const duration_ms = state?.item?.duration_ms ?? 0 // 曲の長さ
            const devices = await spotifyApi.getDevices(token)
            const activeDeviceId = devices.devices.find(device => device.is_active)?.id
            const spotifyLoopDevice = devices.devices.find(device => device.name === deviceName);
            const device_id = spotifyLoopDevice?.id;

            console.log(isPlaylistMode, isShuffleMode)
            console.log(currentlyPlayingTrack)

            // プレイリストモードまたはシャッフルモードの時のみ、次の曲への自動遷移を行う
            if (isPlaylistMode || isShuffleMode) {
                const currentPlaylist = playlists.find(p =>
                    p.tracks.some(t => t.id === currentlyPlayingTrack)
                );
                const currentTrackIndex = currentPlaylist?.tracks.findIndex(t =>
                    t.id === currentlyPlayingTrack
                );

                const currentTrack = isShuffleMode
                    ? shuffledTracks.find(t => t.id === currentlyPlayingTrack)
                    : playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack);

                if (currentTrack && ms >= currentTrack.end_time) {
                    if (isShuffleMode) {
                        const currentIndex = shuffledTracks.findIndex(t => t.id === currentlyPlayingTrack);
                        if (currentIndex < shuffledTracks.length - 1) {
                            const nextTrack = shuffledTracks[currentIndex + 1];
                            await playSong(
                                token,
                                device_id!,
                                [`spotify:track:${nextTrack.spotify_track_id}`],
                                nextTrack.start_time
                            );
                            setCurrentlyPlayingTrack(nextTrack.id);
                        } else {
                            // シャッフル再生が終わったら、再度シャッフルして最初から再生
                            const reshuffledTracks = [...shuffledTracks].sort(() => Math.random() - 0.5);
                            setShuffledTracks(reshuffledTracks);
                            await playSong(
                                token,
                                device_id!,
                                [`spotify:track:${reshuffledTracks[0].spotify_track_id}`],
                                reshuffledTracks[0].start_time
                            );
                            setCurrentlyPlayingTrack(reshuffledTracks[0].id);
                        }
                    } else {
                        // 通常の順番再生の処理
                        if (currentPlaylist && currentTrackIndex !== undefined) {
                            if (currentTrackIndex < currentPlaylist.tracks.length - 1) {
                                const nextTrack = currentPlaylist.tracks[currentTrackIndex + 1];
                                await playSong(
                                    token,
                                    device_id!,
                                    [`spotify:track:${nextTrack.spotify_track_id}`],
                                    nextTrack.start_time
                                );
                                setCurrentlyPlayingTrack(nextTrack.id);
                            } else {
                                // プレイリストの最後まで来たら最初から再生
                                const firstTrack = currentPlaylist.tracks[0];
                                await playSong(
                                    token,
                                    device_id!,
                                    [`spotify:track:${firstTrack.spotify_track_id}`],
                                    firstTrack.start_time
                                );
                                setCurrentlyPlayingTrack(firstTrack.id);
                            }
                        }
                    }
                    return;
                }
            }

            if (ms >= duration_ms && currentlyPlayingTrack !== '') {
                await spotifyApi.pause(token)
                return
            }

            if (currentTrackId && toggleSwitch && currentlyPlayingTrack !== '' && ms > playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.end_time! && activeDeviceId === device_id) {
                await spotifyApi.seek(token, playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.start_time ?? 0)
                console.log(`Bループを超えたため、Aに戻ります: ${playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.start_time}ms`)
            }
        }, 500)

        return () => clearInterval(interval)
    }, [currentlyPlayingTrack, token, toggleSwitch, deviceName, playlists, isPlaylistMode, isShuffleMode, shuffledTracks])

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
        const currentEndTime = currentTrack?.end_time ?? duration_ms

        if (currentEndTime && ms >= currentEndTime) {
            setNotificationType('error')
            setNotificationMessage('開始位置は終了位置より前に設定する必要があります')
            setShowNotification(true)
            setTimeout(() => setShowNotification(false), 3000)
            return
        }

        // ローカルステートの更新
        onUpdateTrackTimes(playlistId, id, ms, currentEndTime)

        // APIを呼び出してサーバー側も更新
        try {
            const playlist = playlists.find(p => p.id === playlistId)
            if (!playlist) return

            const updatedPlaylist = {
                ...playlist,
                tracks: playlist.tracks.map(t =>
                    t.id === id ? { ...t, start_time: ms } : t
                )
            }


            await updateTracksSendApi(playlistId, updatedPlaylist)

            setNotificationType('success')
            setNotificationMessage('ループ位置を更新しました')
        } catch (error) {
            setNotificationType('error')
            setNotificationMessage('ループ位置の保存に失敗しました')
        }

        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000)
        setCurrentlyPlayingTrack(id)
    }

    // 終了位置を設定
    const setLoopEndPositionB = async (id: string, playlistId: string) => {
        const state = await spotifyApi.getPlaybackState(token)
        const ms: number = state?.progress_ms ?? 0

        const currentTrack = playlists.flatMap(p => p.tracks).find(t => t.id === id)
        const currentStartTime = currentTrack?.start_time ?? 0

        if (currentStartTime && ms <= currentStartTime) {
            setNotificationType('error')
            setNotificationMessage('終了位置は開始位置より後に設定する必要があります')
            setShowNotification(true)
            setTimeout(() => setShowNotification(false), 3000)
            return
        }

        // ローカルステートの更新
        onUpdateTrackTimes(playlistId, id, currentStartTime, ms)

        // APIを呼び出してサーバー側も更新
        try {
            const playlist = playlists.find(p => p.id === playlistId)
            if (!playlist) return

            const updatedPlaylist = {
                ...playlist,
                tracks: playlist.tracks.map(t => t.id === id ? { ...t, end_time: ms } : t)
            }
            console.log(updatedPlaylist)
            await updateTracksSendApi(playlistId, updatedPlaylist)

            setNotificationType('success')
            setNotificationMessage('ループ位置を更新しました')
            setShowNotification(true)
            setTimeout(() => setShowNotification(false), 3000)
        } catch (error) {
            setNotificationType('error')
            setNotificationMessage('ループ位置の保存に失敗しました')
            setShowNotification(true)
            setTimeout(() => setShowNotification(false), 3000)
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
    const handlePlayButton = async (uri: string, id: string) => {
        // プレイリストモードとシャッフルモードをリセット
        setIsPlaylistMode(false);
        setIsShuffleMode(false);
        setShuffledTracks([]); // シャッフルされたトラックもリセット

        try {
            const devices = await spotifyApi.getDevices(token);
            const spotifyLoopDevice = devices.devices.find(device => device.name === deviceName);
            const device_id = spotifyLoopDevice?.id;

            if (!device_id) {
                console.error('spotify-loopデバイスが見つかりません');
                return;
            }

            if (currentlyPlayingTrack === id) {
                // 現在再生中の曲と同じ場合は一時停止
                await spotifyApi.pause(token);
                setCurrentlyPlayingTrack('');
            } else {
                // 新しい曲を再生
                const position_ms = playlists.flatMap(p => p.tracks).find(t => t.id === id)?.start_time ?? 0;

                // spotify-loopデバイスがアクティブでない場合のみ切り替えを実行
                if (!spotifyLoopDevice.is_active) {
                    await switchDevice(token, device_id);
                    // デバイス切り替え後の短い待機時間を設定
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // 再生前に再度デバイスの状態を確認
                const updatedDevices = await spotifyApi.getDevices(token);
                const isDeviceActive = updatedDevices.devices.find(d => d.id === device_id)?.is_active;

                if (!isDeviceActive) {
                    console.error('デバイスがまだアクティブになっていません');
                    return;
                }

                // 再生
                await playSong(token, device_id, [uri], position_ms);
                setCurrentlyPlayingTrack(id);
            }
        } catch (error) {
            console.error('再生中にエラーが発生しました:', error);
            // エラー通知を表示する場合はここに追加
        }
    };

    const handlePlayFromBeginning = async (playlist: Playlist) => {
        setIsPlaylistMode(true)
        const devices = await spotifyApi.getDevices(token);
        const spotifyLoopDevice = devices.devices.find(device => device.name === deviceName);
        const device_id = spotifyLoopDevice?.id;
        const playlistTracks = playlist.tracks.map(track => {
            return {
                ...track
            }
        })
        const uris = playlistTracks.map(track => `spotify:track:${track.spotify_track_id}`)
        const initialSongPosition = playlistTracks[0].start_time ?? 0

        if (!device_id) {
            console.error('spotify-loopデバイスが見つかりません');
            return;
        }

        // spotify-loopデバイスがアクティブでない場合のみ切り替えを実行
        if (!spotifyLoopDevice.is_active) await switchDevice(token, device_id)


        await playSong(token, device_id, uris, initialSongPosition)

        setCurrentlyPlayingTrack(playlist.tracks[0].id)
    }

    const handleShufflePlaylist = async (playlist: Playlist) => {
        setIsPlaylistMode(true);
        setIsShuffleMode(true);

        // トラックをシャッフル
        const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
        setShuffledTracks(shuffled);
        console.log(shuffled)

        const devices = await spotifyApi.getDevices(token);
        const spotifyLoopDevice = devices.devices.find(device => device.name === deviceName);
        const device_id = spotifyLoopDevice?.id;
        const shuffledTracks = shuffled.map(track => {
            return {
                ...track
            }
        })
        const uris = shuffledTracks.map(track => `spotify:track:${track.spotify_track_id}`)
        const initialSongPosition = shuffledTracks[0].start_time ?? 0

        if (!device_id) {
            console.error('spotify-loopデバイスが見つかりません');
            return;
        }

        // spotify-loopデバイスがアクティブでない場合のみ切り替えを実行
        if (!spotifyLoopDevice.is_active) await switchDevice(token, device_id)

        await playSong(token, device_id, uris, initialSongPosition)

        setCurrentlyPlayingTrack(shuffledTracks[0].id)
    };

    const handleOpenEditPlaylistModal = (playlist: Playlist) => {
        setSelectedPlaylist(playlist)
        setIsEditPlaylistModalOpen(true);
    };

    const handleSaveEditPlaylistModal = async (updatedPlaylist: Playlist) => {
        try {
            const response = await updateTracksSendApi(updatedPlaylist.id, updatedPlaylist)

            if (!response.ok) {
                throw new Error('プレイリストの更新に失敗しました');
            }

            onSavePlaylist(updatedPlaylist);
            setIsEditPlaylistModalOpen(false);

            // 成功通知を表示
            setNotificationType('success');
            setNotificationMessage('プレイリストを更新しました');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        } catch (error) {
            // エラー通知を表示
            setNotificationType('error');
            setNotificationMessage('プレイリストの更新に失敗しました');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        }
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

    const handlePlaylistSelect = async () => {
        try {
            const playButton = document.querySelector('.ButtonRSWP.rswp__toggle._ControlsButtonRSWP.__3hmsj') as HTMLButtonElement;
            console.log(playButton)
            if (playButton) {
                playButton.click();
                await spotifyApi.pause(token);
            }
        } catch (error) {
            console.error('初期化中にエラーが発生しました:', error);
        }
    };

    return (
        <VStack align="stretch" className="bg-gray-800 rounded-lg p-4">
            <Accordion 
                isToggle 
                variant="card"
                onChange={(expandedIndex) => {
                    if (typeof expandedIndex === 'number' && expandedIndex !== -1) {
                        handlePlaylistSelect();
                    }
                }}
            >
                {playlists.map((playlist) => (
                    <AccordionItem key={playlist.id} className="border-b border-gray-700 ">
                        <AccordionLabel _expanded={{ bg: "green.400", color: "white" }}>
                            {playlist.name}
                        </AccordionLabel>
                        <AccordionPanel pt={3} bg={["gray.900", "gray.900"]}>
                            <HStack justify="space-between" mt={1} mb={2}>
                                <HStack>
                                    <Tooltip label="はじめから再生">
                                        <IconButton
                                            aria-label="はじめから再生"
                                            icon={<PlayCircle />}
                                            size="sm"
                                            variant="unstyled"
                                            onClick={() => handlePlayFromBeginning(playlist)}
                                        />
                                    </Tooltip>
                                    <Tooltip label="シャッフル再生">
                                        <IconButton
                                            aria-label="シャッフル再生"
                                            icon={<Shuffle />}
                                            size="sm"
                                            variant="unstyled"
                                            onClick={() => handleShufflePlaylist(playlist)}
                                        />
                                    </Tooltip>
                                </HStack>
                                <HStack>
                                    <Tooltip label="プレイリストを編集">
                                        <IconButton
                                            aria-label="プレイリストを編集"
                                            icon={<Edit />}
                                            size="sm"
                                            variant="unstyled"
                                            onClick={() => handleOpenEditPlaylistModal(playlist)}
                                        />
                                    </Tooltip>
                                    <Tooltip label="プレイリストを削除">
                                        <IconButton
                                            aria-label="プレイリストを削除"
                                            icon={<Trash />}
                                            size="sm"
                                            variant="unstyled"
                                            onClick={() => handleDeletePlaylist(playlist.id)}
                                        />
                                    </Tooltip>
                                </HStack>
                            </HStack>

                            <VStack
                                align="stretch"
                                maxH="60vh"
                                overflow="auto"
                                pr="4"
                                css={{
                                    '&::-webkit-scrollbar': {
                                        width: '8px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        borderRadius: '4px',
                                        marginTop: '4px',
                                        marginBottom: '4px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: '#BDBDBD',
                                        borderRadius: '4px',
                                    },
                                }}
                            >
                                {playlist.tracks
                                    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                                    .map((track) => (
                                        <Box
                                            onClick={() => handlePlayButton(`spotify:track:${track.spotify_track_id}`, track.id)}
                                            key={track.id}
                                            className={`
                                                px-2 py-1
                                                hover:bg-gray-700
                                                transition-colors duration-200
                                            `}
                                        >
                                            <HStack justify="space-between">
                                                <HStack align="center" flex={1}>
                                                    <Text fontSize="xs" className="text-gray-400 min-w-[24px]">{track.position + 1}</Text>
                                                    <Image
                                                        src={track.cover_url}
                                                        alt={track.name}
                                                        width={50}
                                                        height={50}
                                                        className="rounded-md"
                                                    />
                                                    <VStack align="start" gap={1} flex={1}>
                                                        <Text
                                                            fontWeight="semibold"
                                                            className={`text-sm ${currentlyPlayingTrack === track.id
                                                                ? "text-green-400"
                                                                : ""
                                                                }`}
                                                        >
                                                            {track.name}
                                                        </Text>
                                                        <Text fontSize="sm" className="text-gray-400" mt="-1">{track.artist}</Text>
                                                    </VStack>
                                                </HStack>
                                                <HStack w="200px" justify="flex-end" >
                                                    <Text fontSize="sm" className="text-gray-400 min-w-[150px] text-left">
                                                        {formatTime(track.start_time)} - {formatTime(track.end_time)}
                                                    </Text>
                                                    <IconButton
                                                        aria-label={currentlyPlayingTrack === track.id ? "Pause" : "Play"}
                                                        icon={currentlyPlayingTrack === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                        size="sm"
                                                        variant="unstyled"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePlayButton(`spotify:track:${track.spotify_track_id}`, track.id);
                                                        }}
                                                        className="text-gray-400 hover:text-spotify-green"
                                                    />
                                                    <IconButton
                                                        aria-label="Edit"
                                                        icon={<Edit className="w-4 h-4" />}
                                                        size="sm"
                                                        variant="unstyled"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditButton(track.id);
                                                        }}
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