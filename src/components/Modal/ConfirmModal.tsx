import { Dialog } from '@headlessui/react'
import { Button, Flex } from '@tremor/react'
import { useState } from 'react'
import Modal from '.'

interface IConfirmModal {
    open: boolean
    onConfirm: () => void
    onClose?: () => void
    title?: string
    description?: string
}
export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    description,
}: IConfirmModal) {
    const [loading, setLoading] = useState<boolean>(false)
    if (!open && loading) {
        setLoading(false)
    }
    return (
        <Modal
            open={open}
            onClose={() => {
                if (onClose) {
                    onClose()
                }
            }}
        >
            <div>
                <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                    >
                        {title}
                    </Dialog.Title>
                    {description && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                {description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Flex
                justifyContent="between"
                flexDirection="row"
                className="mt-5 sm:mt-6"
            >
                <Button
                    variant="secondary"
                    loading={loading}
                    className="w-1/2"
                    onClick={onClose}
                >
                    No
                </Button>
                <Button
                    variant="primary"
                    loading={loading}
                    className="w-1/2"
                    onClick={() => {
                        setLoading(true)
                        onConfirm()
                        if (onClose) {
                            onClose()
                        }
                    }}
                >
                    Yes
                </Button>
            </Flex>
        </Modal>
    )
}
