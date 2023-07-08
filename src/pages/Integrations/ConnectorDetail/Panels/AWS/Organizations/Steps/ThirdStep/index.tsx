import { Bold, Button, Divider, Flex, Text, TextInput } from '@tremor/react'

interface IStep {
    onNext: any
    onPrevious: any
}

export default function ThirdStep({ onNext, onPrevious }: IStep) {
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">AWS Account information</Bold>
                <Text className="mb-3">
                    Check everything before submit your organization
                </Text>
                <Flex flexDirection="row">
                    <Text>Access Key</Text>
                    <TextInput className="w-2/3" />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Secret Key</Text>
                    <TextInput className="w-2/3" />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Role Name</Text>
                    <TextInput className="w-2/3" />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>External ID</Text>
                    <TextInput className="w-2/3" />
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Back
                </Button>
                <Button onClick={() => onNext()} className="ml-3">
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
