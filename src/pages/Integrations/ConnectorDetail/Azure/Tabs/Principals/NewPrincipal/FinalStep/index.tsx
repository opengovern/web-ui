import { Bold, Button, Divider, Flex, Text } from '@tremor/react'

interface IStep {
    data: any
    onNext: any
}

export default function FinalStep({ data, onNext }: IStep) {
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">See details</Bold>
                <Text className="mb-3">SPN Details & Health</Text>
                <Flex flexDirection="row">
                    <Text>Application ID</Text>
                    <Text>HI</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Tenant ID</Text>
                    <Text>HI</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Secret ID</Text>
                    <Text>HI</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>SPN health</Text>
                    <Text>HI</Text>
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button onClick={() => onNext()} className="ml-3">
                    Confirm
                </Button>
            </Flex>
        </Flex>
    )
}
