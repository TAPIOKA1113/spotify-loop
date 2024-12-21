"use client"

import { useState } from 'react'
import { Button } from '@yamada-ui/react'
import { PlaylistModal } from './Modal/PlaylistModal'

interface PlaylistCreatorProps {
    onTrackSelect: (trackUrl: string) => void;
}

export function PlaylistCreator({ onTrackSelect }: PlaylistCreatorProps) {
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

                <PlaylistModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onTrackSelect={onTrackSelect}
                />
            </div>
        </>
    )
}

