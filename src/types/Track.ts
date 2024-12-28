export interface Track {
    id: string;
    spotify_track_id: string;
    artist: string | '';
    name: string;
    cover_url: string | '';
    position: number;
    start_time: number;
    end_time: number;
}