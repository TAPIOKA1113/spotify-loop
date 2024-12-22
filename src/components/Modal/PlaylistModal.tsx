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
    Box,
    Image
} from '@yamada-ui/react'
import { Plus, Trash2 } from 'lucide-react'
import { spotifyApi } from 'react-spotify-web-playback'

interface Track {
    id: string;
    artist: string;
    name: string;
    cover: string;
    defaultEndTime: number;
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
        console.log(Track)
        if (Track) {
            const TrackName = Track.name
            const TrackArtist = Track.artists[0].name
            const trackId = newTrackId.split(':').pop() || newTrackId
            setTracks([...tracks, { id: trackId, name: TrackName, artist: TrackArtist, cover: Track.album.images[0].url, defaultEndTime: Track.duration_ms }])
            setNewTrackId('')
        }
    }

    const removeTrack = (index: number) => {
        setTracks(tracks.filter((_, i) => i !== index))
    }

    const savePlaylist = () => {
        if (playlistName && tracks.length > 0) {
            const newPlaylist: Playlist = {
                id: Date.now().toString(), 
                name: playlistName,
                tracks: tracks
            }
            onSavePlaylist(newPlaylist)
            setPlaylistName('')
            setTracks([])
            onClose()
        }
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
                        {tracks.map((track, index) => (
                            <Box
                                key={index}
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
                            </Box>
                        ))}
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

