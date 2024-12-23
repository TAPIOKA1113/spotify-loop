import { useState } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'
import {
    Button,
    VStack,
    Box,
} from '@yamada-ui/react'
import { PlaylistView } from '../components/PlaylistView'
import { PlaylistCreateModal } from '../components/Modal/PlaylistCreateModal'
import ShuffleButton from '../components/ShuffleButton'
import RepeatButton from '../components/RepeatButton'
import { v4 as uuidv4 } from 'uuid'
interface PlayerProps {
    access_token: string
}

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

const Player: React.FC<PlayerProps> = ({ access_token }) => {
    const token = access_token


    // 初期プレイリストのデータ
    const initialPlaylists: Playlist[] = [
        {
            id: '1',
            name: 'ブレイクダウン',
            tracks: [
                {
                    id: uuidv4(),
                    trackId: '3RgE4JfthJ3tZm14Piulac',
                    artist: 'Within Destruction',
                    name: 'Scars',
                    cover: 'https://i.scdn.co/image/ab67616d0000b273cc26e030a3e2a84e8b066721',
                    startTime: 0,
                    endTime: 221888
                },
                {
                    id: uuidv4(),
                    trackId: '6f8WPDb2IoYSKu5LgHcyrw',
                    artist: 'Periphery',
                    name: 'Scarlet',
                    cover: 'https://i.scdn.co/image/ab67616d0000b2737cc1955a4381fa871eb40d2f',
                    startTime: 0,
                    endTime: 248800
                }
            ]
        }
    ]

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists)
    const [spotifyUrl, setSpotifyUrl] = useState<string>('')
    const [isActive, setIsActive] = useState(false)
    const [shuffle, setShuffle] = useState(false)
    const [repeat, setRepeat] = useState<'off' | 'context' | 'track'>('off')
    const [deviceName] = useState(() => `spotify-loop-${Math.random().toString(36).slice(2, 9)}`);

    const handleSavePlaylist = (newPlaylist: Playlist) => {
        if (newPlaylist.id) {
            setPlaylists(playlists.map(playlist =>
                playlist.id === newPlaylist.id ? newPlaylist : playlist
            ))
        } else {
            setPlaylists([...playlists, newPlaylist])
        }
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
                        deviceName={deviceName}
                        onSavePlaylist={handleSavePlaylist}
                    />

                    <Box>
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
                </VStack>

                <PlaylistCreateModal
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

