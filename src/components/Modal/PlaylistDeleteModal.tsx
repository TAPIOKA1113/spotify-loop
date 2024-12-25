
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    ModalOverlay,
    Button,
    VStack,
    Text,
} from '@yamada-ui/react'
import { apiClient } from '../../utils/api'

interface PlaylistDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    playlistId: string;
    onDeleteSuccess: () => void;
}

export function PlaylistDeleteModal({ isOpen, onClose, playlistId, onDeleteSuccess }: PlaylistDeleteModalProps) {

    const handleDeletePlaylist = async () => {
        try {
            const res = await apiClient.delete(`/api/playlists/${playlistId}`)
            if (res.ok) {
                onDeleteSuccess()
            }
        } catch (error) {
            console.error('Error deleting playlist:', error)
        } finally {
            onClose()
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalHeader>プレイリストを削除</ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
                <VStack align="stretch" >
                    <Text>本当に削除しますか？</Text>
                    <Button colorScheme="red" onClick={handleDeletePlaylist}>削除</Button>
                    <Button onClick={onClose}>キャンセル</Button>
                </VStack>
            </ModalBody>
        </Modal>
    )
}

