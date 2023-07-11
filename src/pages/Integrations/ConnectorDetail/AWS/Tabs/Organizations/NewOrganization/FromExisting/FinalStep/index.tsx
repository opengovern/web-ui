import { Bold, Button, Divider, Flex, Text } from '@tremor/react'

interface IStep {
    onPrevious: any
    data: any
    connection: any
}

export default function FinalStep({ onPrevious, data, connection }: IStep) {
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">Finalizing the organization</Bold>
                <Text className="mb-6">
                    Check everything before submitting your organization. Please
                    note that organization onboarding progress will take a few
                    minutes.
                </Text>
                <Flex flexDirection="row">
                    <Text>Role Name</Text>
                    <Text className="text-black">{data.roleName}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>External ID</Text>
                    <Text className="text-black">{data.externalId}</Text>
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Back
                </Button>
                <Button className="ml-3">Submit</Button>
            </Flex>
        </Flex>
    )
}
