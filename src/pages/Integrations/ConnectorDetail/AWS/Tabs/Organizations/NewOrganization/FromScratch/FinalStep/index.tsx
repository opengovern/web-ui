import { Bold, Button, Divider, Flex, Text } from '@tremor/react'

interface IStep {
    onPrevious: () => void
    onSubmit: () => void
    accessKeyParam: string
    secretKey: string
    roleName: string
    externalId: string
}

export default function FinalStep({
    onSubmit,
    onPrevious,
    accessKeyParam,
    secretKey,
    roleName,
    externalId,
}: IStep) {
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">AWS Account information</Bold>
                <Text className="mb-6">
                    Check everything before submitting your organization. Please
                    note that organization onboarding progress will take a few
                    minutes.
                </Text>
                <Flex flexDirection="row">
                    <Text>Access Key</Text>
                    <Text className="text-black">{accessKeyParam}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Secret Key</Text>
                    <Text className="text-black">{secretKey}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Role Name</Text>
                    <Text className="text-black">{roleName}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>External ID</Text>
                    <Text className="text-black">{externalId}</Text>
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={onPrevious}>
                    Back
                </Button>
                <Button className="ml-3" onClick={onSubmit}>
                    Submit
                </Button>
            </Flex>
        </Flex>
    )
}
