import { Fragment, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Flex, Text } from '@tremor/react'

interface INotification {
    text: string
}

export default function Notification({ text }: INotification) {
    const [show, setShow] = useState(!!text.length)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false)
        }, 5000)
        return () => clearTimeout(timer)
    }, [show])

    return (
        <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <Flex
                onClick={() => {
                    setShow(false)
                }}
                className="cursor-pointer fixed right-12 top-24 w-full max-w-sm p-4 rounded-md bg-kaytu-50 shadow-md ring-1 ring-kaytu-100"
            >
                <Text className="text-kaytu-500">{text}</Text>
                <XMarkIcon className="h-5 w-5" />
            </Flex>
        </Transition>
    )
}
