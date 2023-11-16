import { Bold, Button, Flex, Text } from '@tremor/react'
import { Link, useNavigate } from 'react-router-dom'

interface IStep {
    onNext: () => void
    onPrevious: () => void
}

export default function FirstStep({ onNext, onPrevious }: IStep) {
    const navigate = useNavigate()
    return (
        <Flex flexDirection="col" justifyContent="between" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">Deploy IAM Role</Bold>
                <Text className="mb-3">
                    Please refer to this guid to deploy the IAM role via AWS
                    CloudFormation Stacks and then click on Next:
                </Text>

                <Button variant="light">
                    <Link
                        to="https://kaytu.io/docs/latest/onboard_azure/"
                        target="_blank"
                    >
                        Refer to guide, by clicking this link
                    </Link>
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
