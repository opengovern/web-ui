import { Bold, Button, Divider, Flex, Text } from '@tremor/react'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialResponse } from '../../../../../../../../api/api'
import { KeyValuePairs } from '@cloudscape-design/components'

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
        <>
            <KeyValuePairs
                columns={3}
                items={[
                    {
                        label: 'Application Id',
                        value: data.appId,
                    },
                    {
                        label: 'Tenant Id',
                        value: data.tenId,
                    },
                    {
                        label: 'Client Secret',
                        value: data.clientSecret,
                    },
                    // {
                    //     label: 'SPN health',
                    //     value: health,
                    // },
                    {
                        label: 'Object Id',
                        value: data.objectId,
                    },
                ]}
            />
            {/* <Flex flexDirection="col" className="h-full">
                <Flex flexDirection="col" alignItems="start">
                    <Bold className="my-6">See detail</Bold>
                    <Text className="mb-3">SPN Detail & Health</Text>
                    <Flex flexDirection="row">
                        <Text>Application ID</Text>
                        <Text>{data.appId}</Text>
                    </Flex>
                    <Divider />
                    <Flex flexDirection="row">
                        <Text>Tenant ID</Text>
                        <Text>{data.tenId}</Text>
                    </Flex>
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
            </Flex> */}
        </>
    )
}
