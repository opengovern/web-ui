import { Bold, Card, Flex, Text } from '@tremor/react'
import clipboardCopy from 'clipboard-copy'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'

export default function SecondStep() {
    return (
        <Flex flexDirection="col" alignItems="start">
            <Bold className="my-6">Run Script</Bold>
            <Text className="mb-3">Please Run the following script:</Text>
            <Card
                className="w-full text-gray-800 font-mono cursor-pointer p-2.5"
                onClick={() => clipboardCopy('meow')}
            >
                <Flex flexDirection="row">
                    <Text className="px-1.5 text-gray-800">
                        $ Brew Install kaytu
                    </Text>
                    <DocumentDuplicateIcon className="h-5 w-5 text-blue-600 cursor-pointer" />
                </Flex>
            </Card>
        </Flex>
    )
}
