import { Bold, Button, Divider, Flex, Text } from '@tremor/react'

interface IStep {
    onPrevious: () => void
    onSubmit: () => void
    accountID: string
    roleName: string
    externalID: string
    error: string
    isLoading: boolean
}

export default function FinalStep({
    onSubmit,
    onPrevious,
    accountID,
    roleName,
    externalID,
    error,
    isLoading,
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
                    <Text>Account ID</Text>
                    <Text className="text-black">{accountID}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Role Name</Text>
                    <Text className="text-black">{roleName}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>External ID</Text>
                    <Text className="text-black">{externalID}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text className="text-red-600 pt-4">{error}</Text>
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={onPrevious}>
                    Back
                </Button>
                <Button className="ml-3" loading={isLoading} onClick={onSubmit}>
                    Submit
                </Button>
            </Flex>
        </Flex>
    )
}
