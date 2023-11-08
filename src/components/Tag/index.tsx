import { Flex, Text } from '@tremor/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ITag {
    text: string | undefined
    onClick?: () => void
    isDemo?: boolean
}

export default function Tag({ text, onClick, isDemo }: ITag) {
    return (
        <Flex
            className={`px-2 py-1 rounded bg-kaytu-50 w-fit ${
                onClick ? 'cursor-pointer' : ''
            }`}
            onClick={onClick}
        >
            <Text
                className={
                    isDemo
                        ? 'blur-md text-gray-800 break-words'
                        : 'text-gray-800 break-words'
                }
            >
                {text}
            </Text>
            {onClick && <XMarkIcon className="h-4 ml-2" />}
        </Flex>
    )
}
