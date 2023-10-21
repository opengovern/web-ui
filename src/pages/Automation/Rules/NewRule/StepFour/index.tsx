import { Button, Flex, Text, TextInput } from '@tremor/react'

interface IStep {
    onNext: () => void
    onBack: () => void
}

export default function StepFour({ onNext, onBack }: IStep) {
    return (
        <Flex flexDirection="col" className="h-full max-h-screen">
            <Flex flexDirection="col" alignItems="start">
                <Flex justifyContent="start" className="gap-1 mb-6">
                    <Text>4/4.</Text>
                    <Text className="text-gray-800 font-semibold">
                        Metadata
                    </Text>
                </Flex>
                <Flex className="mb-6">
                    <Text className="text-gray-800">Name</Text>
                    <TextInput className="w-2/3" />
                </Flex>
                <Flex className="mb-6">
                    <Text className="text-gray-800">Description</Text>
                    <TextInput className="w-2/3" />
                </Flex>
                <Flex className="mb-6">
                    <Text className="text-gray-800">Label</Text>
                    <TextInput className="w-2/3" />
                </Flex>
            </Flex>
            <Flex justifyContent="end" className="gap-4">
                <Button variant="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={onNext}>Creat rule</Button>
            </Flex>
        </Flex>
    )
}
