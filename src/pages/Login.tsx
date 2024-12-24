import { Button, VStack, Heading, Container } from '@yamada-ui/react'
import { CLIENT_ID } from '../../env'

function Login() {
    const handleLogin = () => {
        const redirectUri = import.meta.env.DEV
            ? 'http://localhost:5173'  // 開発環境
            : 'https://spotify-loop-woad.vercel.app/' // 本番環境

        window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`

        
    }

    return (
        <Container centerContent minH="100vh">
            <VStack py={10}>
                <Heading>Spotify LOOP</Heading>
                <Button colorScheme="green" onClick={handleLogin}>
                    Spotifyでログイン
                </Button>
            </VStack>
        </Container>
    )
}

export default Login