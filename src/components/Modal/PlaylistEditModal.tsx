import { useState, useEffect } from 'react'
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
    Image,
    Reorder,
    ReorderItem,
} from '@yamada-ui/react'
import { Plus, Trash2 } from 'lucide-react'
import { spotifyApi } from 'react-spotify-web-playback'
import { v4 as uuidv4 } from 'uuid'
import { Track } from '../../types/Track'
import { Playlist } from '../../types/Playlist'


interface PlaylistEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string;
    onSavePlaylist: (playlist: Playlist) => void;
    playlist: Playlist | null;
}

export function PlaylistEditModal({ isOpen, onClose, token, onSavePlaylist, playlist }: PlaylistEditModalProps) {
    const [tracks, setTracks] = useState<Track[]>([])
    const [playlistName, setPlaylistName] = useState('')
    const [newTrackId, setNewTrackId] = useState('')

    // propsとして渡されたplaylistをセット
    useEffect(() => {
        if (playlist) {
            setTracks(playlist.tracks)
            setPlaylistName(playlist.name)
        }
    }, [playlist])

    const searchTrackName = async (trackId: string) => {
        const Track = await spotifyApi.getTrack(token, trackId)
        return Track
    }

    const addTrack = async () => {
        console.log(playlist)
        console.log(tracks)
        const Track = await searchTrackName(newTrackId)
        if (Track) {
            const trackId = newTrackId.split(':').pop() || newTrackId
            setTracks([...tracks, {
                id: uuidv4(),
                spotify_track_id: trackId,
                name: Track.name,
                artist: Track.artists[0].name,
                cover_url: Track.album.images[0].url,
                start_time: 0,
                end_time: Track.duration_ms || 0,
                position: tracks.length
            }])
            setNewTrackId('')
        }
    }

    const removeTrack = (index: number) => {
        setTracks(tracks.filter((_, i) => i !== index))
    }

    const savePlaylist = () => {
        if (playlist?.name && playlist?.tracks.length > 0) {
            const newPlaylist: Playlist = {
                id: playlist.id,
                name: playlistName,
                tracks: tracks
            }
            onSavePlaylist(newPlaylist)
            onClose()
        }
    }

    const handleReorder = (values: string[]) => {
        const newOrder = values.map((value, index) => {
            const id = value
            const track = tracks.find(track => track.id === id)!
            return { ...track, position: index }
        })
        setTracks(newOrder)
    }

    const setTrackName = (value: string, trackId: string) => {
        setTracks(tracks.map(track => track.id === trackId ? { ...track, name: value } : track))
    }

    const setArtistName = (value: string, trackId: string) => {
        setTracks(tracks.map(track => track.id === trackId ? { ...track, artist: value } : track))
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalHeader>プレイリストを編集</ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
                <VStack align="stretch" >
                    <Input
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        placeholder={playlistName}
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
                                    <Image src={track.cover_url} alt={track.name} width={50} height={50} rounded="md" />
                                    <VStack>
                                        <Input flex={1} ml={3} value={track.name} onChange={(e) => setTrackName(e.target.value, track.id)} />
                                        <Input flex={1} ml={3} value={track.artist} onChange={(e) => setArtistName(e.target.value, track.id)} />
                                    </VStack>
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

