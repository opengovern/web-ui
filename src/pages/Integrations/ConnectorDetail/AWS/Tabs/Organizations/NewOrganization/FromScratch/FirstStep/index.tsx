import { Bold, Button, Flex, Text } from '@tremor/react'

interface IStep {
    onNext: any
    onPrevious: any
}

export default function FirstStep({ onNext, onPrevious }: IStep) {
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">Deploy IAM Role</Bold>
                <Text className="mb-3">
                    Please refer to this guid to deploy the IAM role via AWS
                    CloudFormation Stacks and then click on Next:
                </Text>
                <Button variant="light">
                    Refer to guide, by clicking this link
                </Button>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Cancel
                </Button>
                <Button onClick={() => onNext()} className="ml-3">
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
