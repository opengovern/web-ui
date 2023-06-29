import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Button } from '@tremor/react'
import Modal from '.'

interface InformationModalProps {
    title: string
    description: string
    buttons?: string[]
    open: boolean
    successful?: boolean
    onClose?: () => void
}
const InformationModal: React.FC<InformationModalProps> = ({
    open,
    onClose,
    successful = true,
    title,
    description,
    buttons = ['OK'],
}) => {
    const closeHandler = () => {
        if (onClose) {
            onClose()
        }
    }

    return (
        <Modal open={open} onClose={closeHandler}>
            <div>
                <div
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                        successful ? 'bg-green-100' : 'bg-red-100'
                    }`}
                >
                    {successful ? (
                        <CheckIcon
                            className="h-6 w-6 text-green-600"
                            aria-hidden="true"
                        />
                    ) : (
                        <ExclamationTriangleIcon
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                        />
                    )}
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                    >
                        {title}
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-6">
                {buttons.map((item, id) => {
                    return (
                        <Button
                            variant={id === 0 ? 'primary' : 'secondary'}
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => closeHandler()}
                        >
                            {item}
                        </Button>
                    )
                })}
            </div>
        </Modal>
    )
}

export default InformationModal
