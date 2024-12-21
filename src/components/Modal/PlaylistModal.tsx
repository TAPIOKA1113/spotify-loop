
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
} from '@yamada-ui/react'
import { Plus, DeleteIcon } from 'lucide-react'

interface Track {
    id: string;
    name: string;
}

interface PlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTrackSelect: (trackUrl: string) => void;
}

export function PlaylistModal({ isOpen, onClose, onTrackSelect }: PlaylistModalProps) {
    const [tracks, setTracks] = useState<Track[]>([])
    const [newTrackId, setNewTrackId] = useState('')
    const [playlistName, setPlaylistName] = useState('')

    const addTrack = () => {
        if (newTrackId) {
            const trackId = newTrackId.split(':').pop() || newTrackId
            setTracks([...tracks, { id: trackId, name: `Track ${tracks.length + 1}` }])
            setNewTrackId('')
        }
    }

    const removeTrack = (index: number) => {
        setTracks(tracks.filter((_, i) => i !== index))
    }

    const savePlaylist = () => {
        // TODO: Implement playlist saving functionality
        console.log('Saving playlist:', playlistName, tracks)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />

            <ModalHeader>プレイリストを作成</ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
                <VStack align="stretch">
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

                    <VStack align="stretch">
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
                                <Text
                                    flex={1}
                                    cursor="pointer"
                                    _hover={{ color: 'blue.500' }}
                                    onClick={() => {
                                        onTrackSelect(`spotify:track:${track.id}`)
                                        onClose()
                                    }}
                                >
                                    {track.name}
                                </Text>
                                <IconButton
                                    aria-label="Remove track"
                                    icon={<DeleteIcon />}
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

