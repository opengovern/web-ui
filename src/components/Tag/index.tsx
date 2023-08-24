import { Flex, Text } from '@tremor/react'

interface ITag {
    text: string | undefined
}

export default function Tag({ text }: ITag) {
    return (
        <Flex className="px-2 py-1 rounded bg-kaytu-50 w-fit">
            <Text className="text-gray-800 break-words">{text}</Text>
        </Flex>
    )
}
