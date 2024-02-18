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
            className={`px-2.5 py-0.5 gap-2 rounded-md bg-kaytu-50 border border-kaytu-100 w-fit ${
                onClick ? 'cursor-pointer' : ''
            }`}
            onClick={onClick}
        >
            <Text
                className={
                    isDemo
                        ? 'text-kaytu-500 blur-sm break-words'
                        : 'text-kaytu-500 break-words'
                }
            >
                {text}
            </Text>
            {onClick && <XMarkIcon className="h-4 text-kaytu-500" />}
        </Flex>
    )
}
