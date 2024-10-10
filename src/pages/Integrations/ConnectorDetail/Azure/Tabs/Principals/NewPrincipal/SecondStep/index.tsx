import { useState } from 'react'
import { Bold, Button, Divider, Flex, Text, TextInput } from '@tremor/react'
import { Alert } from '@cloudscape-design/components'

interface IStep {
    data: any
    setData: Function
    error : string
}

export default function SecondStep({
   data,

    error,
    setData
}: IStep) {
   

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                {/* <Bold className="my-6">Onboard your Azure SPN</Bold> */}
                {/* <Text className="mb-3">
                    Please fill all the following required information.
                </Text> */}
                <Flex flexDirection="row">
                    <Text>Application ID</Text>
                    <TextInput
                        className="w-2/3"
                        value={data?.appId}
                        onChange={(e) =>
                            setData({ ...data, appId: e.target.value })
                        }
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Object ID</Text>
                    <TextInput
                        className="w-2/3"
                        value={data?.objectId}
                        onChange={(e) =>
                            setData({ ...data, objectId: e.target.value })
                        }
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Tenant ID</Text>
                    <TextInput
                        className="w-2/3"
                        value={data?.tenId}
                        onChange={(e) => setData({ ...data, tenId: e.target.value })}
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Client Secret</Text>
                    <TextInput
                        className="w-2/3"
                        value={data?.clientSecret}
                        onChange={(e) => setData({ ...data, clientSecret: e.target.value })}
                    />
                </Flex>
                {error && error !== '' && (
                    <Flex flexDirection="row" className="mt-2">
                        <Alert type="error">{error}</Alert>
                    </Flex>
                )}
            </Flex>
            {/* <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Back
                </Button>
                <Button
                    disabled={
                        !(
                            appId.length &&
                            tenId.length &&
                            objectId.length &&
                            clientSecret.length
                        )
                    }
                    onClick={() =>
                        onNext(
                            appId,
                            tenId,
                            secId,
                            objectId,
                            clientSecret,
                            subscriptionId
                        )
                    }
                    className="ml-3"
                >
                    Next
                </Button>
            </Flex> */}
        </Flex>
    )
}
