import { REFRESH_TOKEN, CLIENT_ID, CLIENT_SECRET } from '../../env';

export const switchDevice = async (token: string, deviceId: string) => {
    await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            device_ids: [deviceId],
            play: false
        })
    });
}

export const playSong = async (token: string, deviceId: string, uris: string[], position_ms: number) => {
    await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris, position_ms, device_id: deviceId })
    });
}

export const search = async (token: string, query: string) => {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}   

export const refreshToken = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: REFRESH_TOKEN,
        }),
    });

    const data = await response.json();
    if (data.access_token) {
        return data.access_token;
    }
};