import { useState } from 'react'
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    ModalOverlay,
    Button,
    Input,
    VStack,
    HStack,
    IconButton,
    Text,
    Image,
    Reorder,
    ReorderItem,
} from '@yamada-ui/react'
import { Plus, Trash2 } from 'lucide-react'
import { spotifyApi } from 'react-spotify-web-playback'
import { v4 as uuidv4 } from 'uuid'
import { Track } from '../../types/Track'
import { Playlist } from '../../types/Playlist'
import { apiClient } from '../../utils/api'




interface PlaylistCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string;
    onSavePlaylist: (playlist: Playlist) => void;
}

export function PlaylistCreateModal({ isOpen, onClose, token, onSavePlaylist }: PlaylistCreateModalProps) {
    const [tracks, setTracks] = useState<Track[]>([])
    const [newTrackId, setNewTrackId] = useState('')
    const [playlistName, setPlaylistName] = useState('')
    const [error, setError] = useState<string | null>(null);


    const searchTrackName = async (trackId: string) => {
        const Track = await spotifyApi.getTrack(token, trackId)
        return Track
    }

    const addTrack = async () => {
        const Track = await searchTrackName(newTrackId)
        if (Track) {
            const trackId = newTrackId.split(':').pop() || newTrackId
            setTracks([...tracks, {
                id: uuidv4(),
                trackId: trackId,
                name: Track.name,
                artist: Track.artists[0].name,
                cover: Track.album.images[0].url,
                startTime: 0,
                endTime: Track.duration_ms || 0
            }])
            setNewTrackId('')
        }
    }

    const removeTrack = (index: number) => {
        setTracks(tracks.filter((_, i) => i !== index))
    }

    const savePlaylist = async () => {

        if (playlistName && tracks.length > 0) {
            setError(null);

            try {
                const userId = localStorage.getItem('spotify_user_id');
                const response = await apiClient.post('/api/playlists', {
                    userId: userId,
                    name: playlistName,
                    tracks: tracks.map(track => ({
                        id: track.trackId,
                        name: track.name,
                        artist: track.artist,
                        cover: track.cover,
                        startTime: track.startTime,
                        endTime: track.endTime
                    }))
                });


                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'プレイリストの作成に失敗しました');
                }

                const playlist = await response.json();
                onSavePlaylist({
                    id: playlist.id,
                    name: playlistName,
                    tracks: tracks
                });

                setPlaylistName('');
                setTracks([]);
                onClose();
            } catch (error) {
                console.error('プレイリスト作成エラー:', error);
                setError(error instanceof Error ? error.message : 'プレイリストの作成に失敗しました');
            }
        }
    };

    const handleReorder = (values: string[]) => {
        const newOrder = values.map(value => {
            const id = value
            return tracks.find(track => track.id === id)!
        })
        setTracks(newOrder)
    }

    const setTrackName = (value: string) => {
        const [name, artist] = value.split(' - ')
        setTracks(tracks.map(track => ({ ...track, name: name, artist: artist })))
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalHeader>プレイリストを作成</ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
                <VStack align="stretch" >
                    {error && (
                        <Text color="red.500" fontSize="sm">
                            {error}
                        </Text>
                    )}
                    <Input
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        placeholder="プレイリスト名"
                    />

                    <HStack>
                        <Input
                            flex={1}
                            value={newTrackId}
                            onChange={(e) => setNewTrackId(e.target.value)}
                            placeholder="SpotifyトラックIDを入力"
                        />
                        <IconButton
                            aria-label="Add track"
                            icon={<Plus />}
                            onClick={addTrack}
                        />
                    </HStack>

                    <VStack align="stretch" >
                        <Reorder
                            onCompleteChange={(values) => handleReorder(values)}
                        >
                            {tracks.map((track, index) => (
                                <ReorderItem
                                    key={track.id}
                                    value={track.id}
                                    p={3}
                                    bg="gray.50"
                                    rounded="md"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Image src={track.cover} alt={track.name} width={50} height={50} rounded="md" />
                                    <Input flex={1} ml={3} value={track.name + ' - ' + track.artist} onChange={(e) => setTrackName(e.target.value)} />
                                    <IconButton
                                        aria-label="Remove track"
                                        icon={<Trash2 />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeTrack(index)}
                                    />
                                </ReorderItem>
                            ))}
                        </Reorder>
                    </VStack>

                    {tracks.length > 0 && (
                        <Button colorScheme="blue" onClick={savePlaylist} w="full">
                            プレイリストを保存
                        </Button>
                    )}
                </VStack>
            </ModalBody>
        </Modal>
    )
}

