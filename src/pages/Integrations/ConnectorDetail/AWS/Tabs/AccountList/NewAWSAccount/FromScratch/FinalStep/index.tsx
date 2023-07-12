import { Bold, Button, Divider, Flex, Text } from '@tremor/react'

interface IStep {
    onNext: () => void
    accessKeyParam: string
    accountID: string
    accountName: string
}

export default function FinalStep({
    onNext,
    accessKeyParam,
    accountID,
    accountName,
}: IStep) {
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">
                    <span className="text-gray-400">5/5</span>. Account
                    Onboarded Successfully
                </Bold>
                <Flex flexDirection="row">
                    <Text>Access Key</Text>
                    <Text className="text-black">{accessKeyParam}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Secret Key</Text>
                    <Text className="text-black">********</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Account Name</Text>
                    <Text className="text-black">{accountName}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Account ID</Text>
                    <Text className="text-black">{accountID}</Text>
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button className="ml-3" onClick={() => onNext()}>
                    Done
                </Button>
            </Flex>
        </Flex>
    )
}
