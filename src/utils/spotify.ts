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
