import { Bold, Button, Card, Flex, Text } from '@tremor/react'
import clipboardCopy from 'clipboard-copy'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'

interface IStep {
    onNext: () => void
    onPrevious: () => void
}

export default function SecondStep({ onNext, onPrevious }: IStep) {
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">
                    <span className="text-gray-400">2/5</span>. Run Script
                </Bold>
                <Text className="mb-3">Please Run the following script:</Text>
                <Card
                    className="w-full text-gray-800 font-mono cursor-pointer p-2.5"
                    onClick={() => clipboardCopy('meow')}
                >
                    <Flex flexDirection="row">
                        <Text className="px-1.5 text-gray-800">
                            $ Brew Install kaytu
                        </Text>
                        <DocumentDuplicateIcon className="h-5 w-5 text-kaytu-600 cursor-pointer" />
                    </Flex>
                </Card>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Back
                </Button>
                <Button onClick={() => onNext()} className="ml-3">
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
