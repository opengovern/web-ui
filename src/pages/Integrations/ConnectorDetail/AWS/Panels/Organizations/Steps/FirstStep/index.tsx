import { Bold, Button, Flex, Text } from '@tremor/react'

export default function FirstStep() {
    return (
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
    )
}
