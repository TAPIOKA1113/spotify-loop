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
import { PlaylistDeleteModal } from './Modal/PlaylistDeleteModal'
import { switchDevice, playSong } from '../utils/spotify'
import { Playlist } from '../types/Playlist'
import { apiClient } from '../utils/api'
import { PlaylistFormModal } from './Modal/PlaylistFormModal'

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

    const [toggleSwitch, setToggleSwitch] = useState(false)
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

    const [isFirstLoad, setIsFirstLoad] = useState(true);

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
        console.log(isFirstLoad)
        if (!currentlyPlayingTrack) return;
        if (toggleSwitch) return;
        const interval = setInterval(async () => {
            const state = await spotifyApi.getPlaybackState(token)
            const ms: number = state?.progress_ms ?? 0 // 再生位置
            const currentTrackId = state?.item?.id
            const duration_ms = state?.item?.duration_ms ?? 0 // 曲の長さ
            const devices = await spotifyApi.getDevices(token)
            const activeDeviceId = devices.devices.find(device => device.is_active)?.id
            const spotifyLoopDevice = devices.devices.find(device => device.name === deviceName);
            const device_id = spotifyLoopDevice?.id;

            if (!state || !state.is_playing) {
                setCurrentlyPlayingTrack('')
                return
            }


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

            if (currentTrackId && currentlyPlayingTrack !== '' && ms > playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.end_time! && activeDeviceId === device_id) {
                await spotifyApi.seek(token, playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.start_time ?? 0)
                console.log(`Bループを超えたため、Aに戻ります: ${playlists.flatMap(p => p.tracks).find(t => t.id === currentlyPlayingTrack)?.start_time}ms`)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [currentlyPlayingTrack, token, toggleSwitch, deviceName, playlists, isPlaylistMode, isShuffleMode, shuffledTracks])

    const formatTime = (ms: number) => {
        const totalSeconds = ms / 1000
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = (totalSeconds % 60).toFixed(3)
        const formattedSeconds = parseFloat(seconds) < 10 ? `0${seconds}` : seconds

        return `${minutes}:${formattedSeconds}`
    }

    const setLoopPosition = async (id: string, playlistId: string, isStartPosition: boolean) => {
        const state = await spotifyApi.getPlaybackState(token)
        const ms: number = state?.progress_ms ?? 0
        const duration_ms: number = state?.item?.duration_ms ?? 0

        const currentTrack = playlists.flatMap(p => p.tracks).find(t => t.id === id)
        const currentStartTime = currentTrack?.start_time ?? 0
        const currentEndTime = currentTrack?.end_time ?? duration_ms

        // 位置の妥当性チェック
        if (isStartPosition) {
            if (currentEndTime && ms >= currentEndTime) {
                setNotificationType('error')
                setNotificationMessage('開始位置は終了位置より前に設定する必要があります')
                setShowNotification(true)
                setTimeout(() => setShowNotification(false), 3000)
                return
            }
        } else {
            if (currentStartTime && ms <= currentStartTime) {
                setNotificationType('error')
                setNotificationMessage('終了位置は開始位置より後に設定する必要があります')
                setShowNotification(true)
                setTimeout(() => setShowNotification(false), 3000)
                return
            }
        }

        // ローカルステートの更新
        const newStartTime = isStartPosition ? ms : currentStartTime
        const newEndTime = isStartPosition ? currentEndTime : ms
        onUpdateTrackTimes(playlistId, id, newStartTime, newEndTime)

        // APIを呼び出してサーバー側も更新
        try {
            const playlist = playlists.find(p => p.id === playlistId)
            if (!playlist) return

            const updatedPlaylist = {
                ...playlist,
                tracks: playlist.tracks.map(t =>
                    t.id === id
                        ? {
                            ...t,
                            ...(isStartPosition ? { start_time: ms } : { end_time: ms })
                        }
                        : t
                )
            }

            await updateTracksSendApi(playlistId, updatedPlaylist)

            setNotificationType('success')
            setNotificationMessage('ループ位置を更新しました')
            if (isStartPosition) {
                setCurrentlyPlayingTrack(id)
            }
        } catch (error) {
            setNotificationType('error')
            setNotificationMessage('ループ位置の保存に失敗しました')
        }

        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000)
    }

    // 既存の関数を新しい関数を使用するように変更
    const setLoopEndPositionA = (id: string, playlistId: string) =>
        setLoopPosition(id, playlistId, true)

    const setLoopEndPositionB = (id: string, playlistId: string) =>
        setLoopPosition(id, playlistId, false)

    const handleEditButton = (trackId: string) => {
        if (currentTrack === trackId) {
            setToggleSwitch(false)
            setCurrentTrack('')
        } else {
            setToggleSwitch(true)
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
        setIsShuffleMode(false)
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
        setIsPlaylistMode(false)
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
        // モバイルデバイスのみ、初回のプレイリスト開閉時に再生ボタンを押す
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (!isFirstLoad || !isMobile) return;
        try {
            const playButton = document.querySelector('.ButtonRSWP.rswp__toggle._ControlsButtonRSWP.__3hmsj') as HTMLButtonElement;
            if (playButton) {
                playButton.click();
                await new Promise(resolve => setTimeout(resolve, 500));
                await spotifyApi.pause(token);
                setIsFirstLoad(false);
            }
        } catch (error) {
            console.error('初期化中にエラーが発生しました:', error);
        }
    };


    return (
        <VStack align="stretch" className="bg-gray-900 rounded-lg p-4 w-full max-w-full overflow-x-hidden" mb="100px" >
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
                            <HStack justify="space-between" mt={1} mb={2} flexWrap="wrap" gap={2}>
                                <HStack>
                                    <Tooltip label="はじめから再生">
                                        <IconButton
                                            icon={<PlayCircle className="w-4 h-4 md:w-5 md:h-5" />}
                                            size={["xs", "sm"]}
                                            variant="unstyled"
                                            onClick={() => handlePlayFromBeginning(playlist)}
                                            color={isPlaylistMode ? "green.400" : ""} />
                                    </Tooltip>
                                    <Tooltip label="シャッフル再生">
                                        <IconButton
                                            icon={<Shuffle className="w-4 h-4 md:w-5 md:h-5" />}
                                            size={["xs", "sm"]}
                                            variant="unstyled"
                                            onClick={() => handleShufflePlaylist(playlist)}
                                            color={isShuffleMode ? "green.400" : ""}
                                        />
                                    </Tooltip>
                                </HStack>
                                <HStack>
                                    <Tooltip label="プレイリストを編集">
                                        <IconButton
                                            aria-label="プレイリストを編集"
                                            icon={<Edit className="w-4 h-4 md:w-5 md:h-5" />}
                                            size={["xs", "sm"]}
                                            variant="unstyled"
                                            onClick={() => handleOpenEditPlaylistModal(playlist)}
                                        />
                                    </Tooltip>
                                    <Tooltip label="プレイリストを削除">
                                        <IconButton
                                            aria-label="プレイリストを削除"
                                            icon={<Trash className="w-4 h-4 md:w-5 md:h-5" />}
                                            size={["xs", "sm"]}
                                            variant="unstyled"
                                            onClick={() => handleDeletePlaylist(playlist.id)}
                                        />
                                    </Tooltip>
                                </HStack>
                            </HStack>

                            <VStack
                                align="stretch"
                                maxH="50vh"
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
                                            <HStack justify="space-between" flex={1}>
                                                <HStack align="center" flex={1} minW="200px" maxW="calc(100% - 220px)">
                                                    <Text fontSize={["xs", "sm"]} className="text-gray-400 min-w-[24px]" display={{ base: "block", md: "none" }}>
                                                        {track.position + 1}
                                                    </Text>
                                                    <Image
                                                        src={track.cover_url}
                                                        alt={track.name}
                                                        width={50}
                                                        height={50}
                                                        className="rounded-md"
                                                    />
                                                    <VStack align="start" gap={1} flex={1} overflow="hidden">
                                                        <Text
                                                            fontWeight="semibold"
                                                            fontSize={{ base: "sm", md: "sm", lg: "xs", xl: "lg", "2xl": "lg" }}
                                                            className={`
                                                                ${currentlyPlayingTrack === track.id ? "text-green-400" : ""}
                                                                ${currentlyPlayingTrack === track.id && track.name.length > 20 ? "marquee-text" : ""}
                                                            `}
                                                            overflow={{ base: "hidden", md: "hidden", lg: "visible", xl: "visible", "2xl": "visible" }}
                                                            textOverflow={{ base: "ellipsis", md: "ellipsis", lg: "visible", xl: "visible", "2xl": "visible" }}
                                                            whiteSpace={{ base: "nowrap", md: "nowrap", lg: "visible", xl: "visible", "2xl": "visible" }}
                                                            position="relative"
                                                        >
                                                            {track.name}
                                                        </Text>
                                                        <Text
                                                            fontSize={["xs", "sm"]}
                                                            className={`
                                                                text-gray-400 
                                                                ${currentlyPlayingTrack === track.id && track.artist.length > 30 ? "marquee-text" : ""}
                                                            `}
                                                            mt="-1"
                                                            overflow="hidden"
                                                            whiteSpace="nowrap"
                                                            position="relative"
                                                        >
                                                            {track.artist}
                                                        </Text>
                                                        <Text fontSize={["xs", "sm"]} className="text-gray-400" mt="-1" display={{ base: "none", md: "block" }}>
                                                            {formatTime(track.start_time)} - {formatTime(track.end_time)}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                                <HStack minW={{ base: "200px", md: "100px" }} justify="flex-end">
                                                    <Text fontSize={["xs", "sm"]} className="text-gray-400" display={{ base: "block", md: "none" }}>
                                                        {formatTime(track.start_time)} - {formatTime(track.end_time)}
                                                    </Text>
                                                    <IconButton
                                                        aria-label={currentlyPlayingTrack === track.id ? "Pause" : "Play"}
                                                        icon={currentlyPlayingTrack === track.id ? <Pause className="w-3 h-3 md:w-4 md:h-4" /> : <Play className="w-3 h-3 md:w-4 md:h-4" />}
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
                                                        icon={<Edit className="w-3 h-3 md:w-4 md:h-4" />}
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
                <PlaylistFormModal
                    isOpen={isEditPlaylistModalOpen}
                    onClose={() => setIsEditPlaylistModalOpen(false)}
                    token={token}
                    onSave={handleSaveEditPlaylistModal}
                    playlist={selectedPlaylist}
                    mode="edit"
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
                    playlistName={selectedPlaylist?.name ?? ''}
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