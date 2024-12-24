import { useState, useEffect } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'
import {
    Button,
    VStack,
    Box,
    Container,
    Heading
} from '@yamada-ui/react'
import { PlaylistView } from '../components/PlaylistView'
import { PlaylistCreateModal } from '../components/Modal/PlaylistCreateModal'
import ShuffleButton from '../components/ShuffleButton'
import RepeatButton from '../components/RepeatButton'
import { Playlist } from '../types/Playlist'

interface PlayerProps {
    access_token: string
}



const Player: React.FC<PlayerProps> = ({ access_token }) => {
    const token = access_token

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [spotifyUrl, setSpotifyUrl] = useState<string>('')
    const [isActive, setIsActive] = useState(false)
    const [shuffle, setShuffle] = useState(false)
    const [repeat, setRepeat] = useState<'off' | 'context' | 'track'>('off')
    const [deviceName] = useState(() => `spotify-loop-${Math.random().toString(36).slice(2, 9)}`);

    useEffect(() => {
        const userId = localStorage.getItem('spotify_user_id');
        fetch(`http://localhost:8787/api/playlists/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setPlaylists(data)
        })
        .catch(error => {
            console.error('Error fetching playlists:', error)
        })
    }, [])

    const handleSavePlaylist = (newPlaylist: Playlist) => {
        const isExistPlaylist = playlists.some(playlist => playlist.id === newPlaylist.id);
        if (isExistPlaylist) {
            setPlaylists(playlists.map(playlist =>
                playlist.id === newPlaylist.id ? newPlaylist : playlist
            ));
        } else {
            setPlaylists([...playlists, newPlaylist]);
        }
        console.log(newPlaylist);
    }

    const handleDeletePlaylist = (playlistId: string) => {
        setPlaylists(playlists.filter(playlist => playlist.id !== playlistId))
    }


    const handleUpdateTrackTimes = (playlistId: string, trackId: string, startTime: number, endTime: number) => {
        setSpotifyUrl(`spotify:track:${trackId}`)
        setPlaylists(playlists.map(playlist => {
            if (playlist.id === playlistId) {
                return {
                    ...playlist,
                    tracks: playlist.tracks.map(track => {
                        if (track.id === trackId) {
                            return { ...track, startTime, endTime }
                        }
                        return track
                    })
                }
            }
            return playlist
        }))
    }


    return (
        <Box className="min-h-screen bg-gray-900 text-white">
            <Container maxW="6xl" py={8}>
                <VStack align="stretch">
                    <Box className="flex justify-between items-center">
                        <Heading size="xl" className="text-spotify-green">Spotify LOOP</Heading>
                        <Button
                            colorScheme="green"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-spotify-green hover:bg-spotify-green-dark"
                        >
                            Create Playlist
                        </Button>
                    </Box>

                    <PlaylistView
                        token={token}
                        playlists={playlists}
                        spotifyUrl={spotifyUrl}
                        onDeletePlaylist={handleDeletePlaylist}
                        onUpdateTrackTimes={handleUpdateTrackTimes}
                        deviceName={deviceName}
                        onSavePlaylist={handleSavePlaylist}
                    />

                    <Box className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
                        <SpotifyPlayer token={token} uris={spotifyUrl ?? ''} name={deviceName} initialVolume={0.2} magnifySliderOnHover={true} components={{
                            leftButton: (
                                <ShuffleButton disabled={!isActive} shuffle={shuffle} token={token} />
                            ),
                            rightButton: <RepeatButton disabled={!isActive} repeat={repeat} token={token} />,
                        }} callback={state => {
                            setIsActive(state.isActive)
                            setShuffle(state.shuffle)
                            setRepeat(state.repeat)
                        }} />
                    </Box>
                    <PlaylistCreateModal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        token={token}
                        onSavePlaylist={handleSavePlaylist}
                    />
                </VStack>


            </Container>
        </Box>
    )
}

export default Player


