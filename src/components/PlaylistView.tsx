
import {
    Accordion,
    AccordionItem,
    AccordionPanel,
    VStack,
    HStack,
    Text,
    Image,
    IconButton,
    Input,
    Button,
} from '@yamada-ui/react'
import { Edit, Trash2, } from 'lucide-react'

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

interface PlaylistViewProps {
    playlists: Playlist[];
    onPlayTrack: (trackId: string, startTime?: number, endTime?: number) => void;
    onDeletePlaylist: (playlistId: string) => void;
    onUpdateTrackTimes: (playlistId: string, trackId: string, startTime?: number, endTime?: number) => void;
    currentTrack?: string;
    onSetLoopA: () => void;
    onSetLoopB: () => void;
    inputStartTime: string;
    inputEndTime: string;
    onStartTimeChange: (value: string) => void;
    onEndTimeChange: (value: string) => void;
    onStartTimeBlur: () => void;
    onEndTimeBlur: () => void;
}

export function PlaylistView({
    playlists,
    onPlayTrack,
    onDeletePlaylist,
    currentTrack,
    onSetLoopA,
    onSetLoopB,
    inputStartTime,
    inputEndTime,
    onStartTimeChange,
    onEndTimeChange,
    onStartTimeBlur,
    onEndTimeBlur
}: PlaylistViewProps) {


    // ミリ秒を MM:SS 形式に変換する関数を追加
    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };


    return (
        <Accordion isToggle>
            {playlists.map((playlist) => (
                <AccordionItem label={playlist.name} key={playlist.id}>
                    <HStack as="header" justify="space-between" p={2}>
                        <Text fontWeight="bold">{playlist.name}</Text>
                        <IconButton
                            aria-label="Delete playlist"
                            icon={<Trash2 />}
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeletePlaylist(playlist.id);
                            }}
                        />
                    </HStack>
                    <AccordionPanel pb={4}>
                        <VStack align="stretch" >
                            {playlist.tracks.map((track) => (
                                <VStack key={track.id} align="stretch" >
                                    <HStack p={2} bg="gray.50" rounded="md" justify="space-between">
                                        <HStack>
                                            <Image src={track.cover} alt={track.name} width={50} height={50} rounded="md" />
                                            <VStack align="start" >
                                                <Text fontWeight="semibold">{track.name}</Text>
                                                <Text fontSize="sm" color="gray.600">{track.artist}</Text>
                                            </VStack>
                                        </HStack>
                                        <HStack>
                                            <Text fontSize="sm" color="gray.600">
                                                {track.startTime ? formatTime(track.startTime) : '00:00'} - {track.endTime ? formatTime(track.endTime) : formatTime(track.defaultEndTime)}
                                            </Text>
                                            <IconButton
                                                aria-label="Play track"
                                                icon={<Edit />}
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onPlayTrack(track.id, track.startTime, track.endTime)}
                                            />
                                        </HStack>
                                    </HStack>

                                    {currentTrack === track.id && (
                                        <VStack align="stretch" p={2} bg="gray.100" rounded="md">
                                            <HStack>
                                                <Text w="24">開始位置</Text>
                                                <Button size="sm" onClick={onSetLoopA}>Now</Button>
                                                <Input
                                                    size="sm"
                                                    value={inputStartTime}
                                                    onChange={(e) => onStartTimeChange(e.target.value)}
                                                    onBlur={onStartTimeBlur}
                                                    placeholder="00:00"
                                                />
                                            </HStack>
                                            <HStack>
                                                <Text w="24">終了位置</Text>
                                                <Button size="sm" onClick={onSetLoopB}>Now</Button>
                                                <Input
                                                    size="sm"
                                                    value={inputEndTime}
                                                    onChange={(e) => onEndTimeChange(e.target.value)}
                                                    onBlur={onEndTimeBlur}
                                                    placeholder="00:00"
                                                />
                                            </HStack>
                                        </VStack>
                                    )}
                                </VStack>
                            ))}
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
