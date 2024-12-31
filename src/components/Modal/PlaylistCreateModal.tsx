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
import { Trash2} from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Track } from '../../types/Track'
import { Playlist } from '../../types/Playlist'
import { apiClient } from '../../utils/api'
import debounce from 'lodash/debounce'
import { search } from '../../utils/spotify'

interface PlaylistCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string;
}

// 検索結果の型を定義
interface SearchResult {
    id: string;
    name: string;
    artist: string;
    album: string;
    cover_url: string;
    duration_ms: number;
}

export function PlaylistCreateModal({ isOpen, onClose, token }: PlaylistCreateModalProps) {
    const [tracks, setTracks] = useState<Track[]>([])
    const [playlistName, setPlaylistName] = useState('')
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)

    // 検索処理を実行する関数
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

    // debounceを使用して検索処理を最適化
    const debouncedSearch = useCallback(
        debounce((query: string) => searchTracks(query), 500),
        [token]
    )

    // 検索クエリが変更されたときに検索を実行
    useEffect(() => {
        debouncedSearch(searchQuery)
        return () => {
            debouncedSearch.cancel()
        }
    }, [searchQuery, debouncedSearch])

    // 検索結果から曲を選択して追加する関数
    const addTrackFromSearch = (result: SearchResult) => {
        console.log(result)
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

    const savePlaylist = async () => {
        if (playlistName && tracks.length > 0) {
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
        }
    };

    const handleReorder = (values: string[]) => {
        const newOrder = values.map((value, index) => {
            const id = value
            const track = tracks.find(track => track.id === id)!
            return { ...track, position: index }
        })
        setTracks(newOrder)
        console.log(tracks)
    }

    const setTrackName = (value: string) => {
        setTracks(tracks.map(track => ({ ...track, name: value })))
    }

    const setArtistName = (value: string) => {
        setTracks(tracks.map(track => ({ ...track, artist: value })))
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalHeader>プレイリストを作成</ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
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
                                bg="gray.50" 
                                rounded="md" 
                                p={2}
                                maxH="200px"
                                overflowY="auto"
                            >
                                {searchResults.map((result) => (
                                    <HStack
                                        key={result.id}
                                        p={2}
                                        _hover={{ bg: "gray.100" }}
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
                                            <Text fontSize="xs" color="gray.600">
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
                                    bg="gray.50"
                                    rounded="md"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Image src={track.cover_url} alt={track.name} width={50} height={50} rounded="md" />
                                    <VStack>
                                        <Input flex={1} ml={3} value={track.name} onChange={(e) => setTrackName(e.target.value)} />
                                        <Input flex={1} ml={3} value={track.artist} onChange={(e) => setArtistName(e.target.value)} />
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

