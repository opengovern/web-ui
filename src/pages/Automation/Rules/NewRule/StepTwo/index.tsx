import { Button, Flex, Text } from '@tremor/react'

interface IStep {
    onNext: () => void
    onBack: () => void
}

export default function StepTwo({ onNext, onBack }: IStep) {
    return (
        <Flex flexDirection="col" className="h-full max-h-screen">
            <Flex flexDirection="col" alignItems="start">
                <Flex justifyContent="start" className="gap-1 mb-6">
                    <Text>2/4.</Text>
                    <Text className="text-gray-800 font-semibold">
                        Condition
                    </Text>
                </Flex>
            </Flex>
            <Flex justifyContent="end" className="gap-4">
                <Button variant="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={() => onNext()}>Next</Button>
            </Flex>
        </Flex>
    )
}
