import { useState, useCallback, useEffect } from 'react'
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
import { Trash2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import debounce from 'lodash/debounce'
import { Track } from '../../types/Track'
import { Playlist } from '../../types/Playlist'
import { search } from '../../utils/spotify'
import { apiClient } from '../../utils/api'
interface PlaylistFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string;
    onSave: (playlist: Playlist) => void;
    playlist?: Playlist | null;
    mode: 'create' | 'edit';
}

interface SearchResult {
    id: string;
    name: string;
    artist: string;
    album: string;
    cover_url: string;
    duration_ms: number;
}

export function PlaylistFormModal({ isOpen, onClose, token, onSave, playlist, mode }: PlaylistFormModalProps) {
    const [tracks, setTracks] = useState<Track[]>([])
    const [playlistName, setPlaylistName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)

    // 編集モードの場合、既存のプレイリスト情報をセット
    useEffect(() => {
        if (mode === 'edit' && playlist) {
            setTracks(playlist.tracks)
            setPlaylistName(playlist.name)
        } else {
            setTracks([])
            setPlaylistName('')
        }
    }, [mode, playlist])

    const searchTracks = async (query: string) => {
        if (!query) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        try {
            const result = await search(token, query)
            const tracks = result.tracks.items.map((track: any) => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                cover_url: track.album.images[0]?.url,
                duration_ms: track.duration_ms
            }))
            setSearchResults(tracks)
        } catch (error) {
            console.error('検索中にエラーが発生しました:', error)
        } finally {
            setIsSearching(false)
        }
    }

    const debouncedSearch = useCallback(
        debounce((query: string) => searchTracks(query), 500),
        [token]
    )

    useEffect(() => {
        debouncedSearch(searchQuery)
        return () => {
            debouncedSearch.cancel()
        }
    }, [searchQuery, debouncedSearch])

    const addTrackFromSearch = (result: SearchResult) => {
        setTracks([...tracks, {
            id: uuidv4(),
            spotify_track_id: result.id,
            name: result.name,
            artist: result.artist,
            cover_url: result.cover_url,
            start_time: 0,
            end_time: result.duration_ms,
            position: tracks.length
        }])
        setSearchQuery('')
        setSearchResults([])
    }

    const removeTrack = (index: number) => {
        setTracks(tracks.filter((_, i) => i !== index))
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

    const savePlaylist = async () => {
        if (playlistName && tracks.length > 0 && mode === 'create') {
            setError(null);

            try {
                const userId = localStorage.getItem('spotify_user_id');

                const playlist: Playlist = {
                    id: uuidv4(),
                    name: playlistName,
                    tracks: tracks
                }
                console.log(playlist)
                const response = await apiClient.post('/api/playlists', {
                    userId: userId,
                    playlist: playlist
                });

                const responseData = await response.json();
                console.log(responseData)

                if (!response.ok) {
                    throw new Error(responseData.message || 'プレイリストの作成に失敗しました');
                }

                setPlaylistName('');
                setTracks([]);
                onClose();
            } catch (error) {
                console.error('プレイリスト作成エラー:', error);
                setError(error instanceof Error ? error.message : 'プレイリストの作成に失敗しました');
            }
        } else if (playlist?.name && playlist?.tracks.length > 0 && mode === 'edit') {
            const newPlaylist: Playlist = {
                id: playlist.id,
                name: playlistName,
                tracks: tracks
            }
            onSave(newPlaylist)
            onClose()
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" bg="gray.800" color="white">
            <ModalOverlay />
            <ModalHeader bg="gray.800" color="white">プレイリストを作成</ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody py={6} bg="gray.800" color="white">
                <VStack align="stretch">
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

                    <VStack align="stretch">
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="曲名やアーティスト名で検索"
                        />

                        {isSearching && (
                            <Text fontSize="sm" color="gray.500">
                                検索中...
                            </Text>
                        )}

                        {searchResults.length > 0 && (
                            <VStack
                                align="stretch"
                                rounded="md"
                                p={2}
                                maxH="200px"
                                overflowY="auto"
                                bg="gray.500"
                            >
                                {searchResults.map((result) => (
                                    <HStack
                                        key={result.id}
                                        p={2}
                                        _hover={{ bg: "gray.400" }}
                                        cursor="pointer"
                                        onClick={() => addTrackFromSearch(result)}
                                    >
                                        <Image
                                            src={result.cover_url}
                                            alt={result.name}
                                            width={50}
                                            height={50}
                                            rounded="md"
                                        />
                                        <VStack align="start">
                                            <Text fontSize="sm" fontWeight="bold">
                                                {result.name}
                                            </Text>
                                            <Text fontSize="xs">
                                                {result.artist} - {result.album}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                ))}
                            </VStack>
                        )}
                    </VStack>

                    <VStack align="stretch" >
                        <Reorder
                            onCompleteChange={(values) => handleReorder(values)}
                        >
                            {tracks.map((track, index) => (
                                <ReorderItem
                                    key={track.id}
                                    value={track.id}
                                    p={3}
                                    bg="gray.700"
                                    rounded="md"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Image src={track.cover_url} alt={track.name} width={50} height={50} rounded="md" />
                                    <VStack gap={0}>
                                        <Input flex={1} value={track.name} onChange={(e) => setTrackName(e.target.value, track.id)} variant="ghost" />
                                        <Input flex={1} value={track.artist} onChange={(e) => setArtistName(e.target.value, track.id)} variant="ghost" />
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

