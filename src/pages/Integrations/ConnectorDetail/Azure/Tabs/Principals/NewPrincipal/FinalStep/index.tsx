import { Bold, Button, Divider, Flex, Text } from '@tremor/react'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialResponse } from '../../../../../../../../api/api'

interface IStep {
    data: {
        tenId: string
        secId: string
        appId: string
        objectId: string
        clientSecret: string
        subscriptionId: string
    }
    health: string
    onNext: () => void
}

export default function FinalStep({ data, health, onNext }: IStep) {
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">See details</Bold>
                <Text className="mb-3">SPN Details & Health</Text>
                <Flex flexDirection="row">
                    <Text>Application ID</Text>
                    <Text>{data.appId}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Tenant ID</Text>
                    <Text>{data.tenId}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Secret ID</Text>
                    <Text>{data.secId}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Object ID</Text>
                    <Text>{data.objectId}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Subscription ID</Text>
                    <Text>{data.subscriptionId}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>SPN health</Text>
                    <Text>{health}</Text>
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