import { Bold, Button, Divider, Flex, Text } from '@tremor/react'

interface IStep {
    onPrevious: () => void
    onSubmit: () => void
    roleName: string
    externalId: string
    isLoading: boolean
    error: string
}

export default function FinalStep({
    onPrevious,
    onSubmit,
    roleName,
    externalId,
    isLoading,
    error,
}: IStep) {
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
                    <Text className="text-black">{roleName}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>External ID</Text>
                    <Text className="text-black">{externalId}</Text>
                </Flex>
                <Flex flexDirection="row">
                    <Text>{error}</Text>
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={onPrevious}>
                    Back
                </Button>
                <Button
                    className="ml-3"
                    loading={isLoading}
                    onSubmit={onSubmit}
                >
                    Submit
                </Button>
            </Flex>
        </Flex>
    )
}
