import { useState } from 'react'
import { Button } from '@yamada-ui/react'
import { PlaylistCreateModal } from './Modal/PlaylistCreateModal'


interface PlaylistCreatorProps {
    onTrackSelect: (trackUrl: string) => void;
    token: string;
}

export function PlaylistCreator({ token }: PlaylistCreatorProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <div className="flex justify-center mb-4">
                <Button
                    colorScheme="blue"
                    onClick={() => setIsModalOpen(true)}
                    mb={4}
                >
                    プレイリストを作成
                </Button>

                <PlaylistCreateModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    token={token}
                    onSavePlaylist={(tracks) => {
                        // プレイリストが保存された時の処理をここに書く
                        setIsModalOpen(false);
                        console.log(tracks)
                    }}
                />
            </div>
        </>
    )
}

