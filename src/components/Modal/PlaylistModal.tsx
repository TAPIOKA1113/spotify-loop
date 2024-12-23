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

interface PlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string;
    onSavePlaylist: (playlist: Playlist) => void;
}

export function PlaylistModal({ isOpen, onClose, token, onSavePlaylist }: PlaylistModalProps) {
    const [tracks, setTracks] = useState<Track[]>([])
    const [newTrackId, setNewTrackId] = useState('')
    const [playlistName, setPlaylistName] = useState('')

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

    const savePlaylist = () => {
        if (playlistName && tracks.length > 0) {
            const newPlaylist: Playlist = {
                id: uuidv4(),
                name: playlistName,
                tracks: tracks
            }
            onSavePlaylist(newPlaylist)
            setPlaylistName('')
            setTracks([])
            onClose()
        }
    }

    const handleReorder = (values: string[]) => {
        const newOrder = values.map(value => {
            const id = value
            return tracks.find(track => track.id === id)!
        })
        setTracks(newOrder)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalHeader>プレイリストを作成</ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
                <VStack align="stretch" >
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
                                    <Text flex={1} ml={3}>
                                        {track.name} - {track.artist}
                                    </Text>
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

