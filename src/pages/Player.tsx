import { useState } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'
import {
    Button,
    VStack,
    Box,
} from '@yamada-ui/react'
import { PlaylistView } from '../components/PlaylistView'
import { PlaylistModal } from '../components/Modal/PlaylistModal'
import ShuffleButton from '../components/ShuffleButton'
import RepeatButton from '../components/RepeatButton'

interface PlayerProps {
    access_token: string
}

interface Track {
    id: string;
    artist: string;
    name: string;
    cover: string;
    defaultEndTime: number;
    startTime?: number;
    endTime?: number;
}

interface Playlist {
    id: string;
    name: string;
    tracks: Track[];
}

const Player: React.FC<PlayerProps> = ({ access_token }) => {
    const token = access_token


    const [isModalOpen, setIsModalOpen] = useState(false)
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [spotifyUrl, setSpotifyUrl] = useState<string>('')
    const [isActive, setIsActive] = useState(false)
    const [shuffle, setShuffle] = useState(false)
    const [repeat, setRepeat] = useState<'off' | 'context' | 'track'>('off')

    const handleSavePlaylist = (newPlaylist: Playlist) => {
        setPlaylists([...playlists, newPlaylist])
    }

    const handleDeletePlaylist = (playlistId: string) => {
        setPlaylists(playlists.filter(playlist => playlist.id !== playlistId))
    }


    const handleUpdateTrackTimes = (playlistId: string, trackId: string, startTime?: number, endTime?: number) => {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
                <VStack align="stretch">
                    <Box className="flex justify-center">
                        <Button colorScheme="blue" onClick={() => setIsModalOpen(true)}>
                            プレイリストを作成
                        </Button>
                    </Box>

                    <PlaylistView
                        token={token}
                        playlists={playlists}
                        spotifyUrl={spotifyUrl}
                        onDeletePlaylist={handleDeletePlaylist}
                        onUpdateTrackTimes={handleUpdateTrackTimes}


                    />

                    <Box>
                        <SpotifyPlayer token={token} uris={spotifyUrl ?? ''} name='spotify-loop' initialVolume={0.2} magnifySliderOnHover={true} components={{
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
                </VStack>

                <PlaylistModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    token={token}
                    onSavePlaylist={handleSavePlaylist}
                />
            </div>
        </div>
    )
}

export default Player

