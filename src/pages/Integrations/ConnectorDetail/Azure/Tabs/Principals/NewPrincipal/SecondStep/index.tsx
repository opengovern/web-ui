import { useState } from 'react'
import { Bold, Button, Divider, Flex, Text, TextInput } from '@tremor/react'

interface IStep {
    iAppId: string
    iTenId: string
    iSecId: string
    iObjectId: string
    iClientSecret: string
    iSubscriptionId: string
    error: string
    onNext: (
        appId: string,
        tenId: string,
        secId: string,
        objectId: string,
        clientSecret: string,
        subscriptionId: string
    ) => void
    onPrevious: () => void
}

export default function SecondStep({
    iAppId,
    iTenId,
    iSecId,
    iObjectId,
    iClientSecret,
    iSubscriptionId,
    error,
    onNext,
    onPrevious,
}: IStep) {
    const [appId, setAppId] = useState(iAppId)
    const [tenId, setTenId] = useState(iTenId)
    const [secId, setSecId] = useState(iSecId)
    const [objectId, setObjectId] = useState(iObjectId)
    const [clientSecret, setClientSecret] = useState(iClientSecret)
    const [subscriptionId, setSubscriptionId] = useState(iSubscriptionId)

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">Onboard your Azure SPN</Bold>
                <Text className="mb-3">
                    Please fill all the following required information.
                </Text>
                <Flex flexDirection="row">
                    <Text>Application ID</Text>
                    <TextInput
                        className="w-2/3"
                        value={appId}
                        onChange={(e) => setAppId(e.target.value)}
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Object ID</Text>
                    <TextInput
                        className="w-2/3"
                        value={objectId}
                        onChange={(e) => setObjectId(e.target.value)}
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Tenant ID</Text>
                    <TextInput
                        className="w-2/3"
                        value={tenId}
                        onChange={(e) => setTenId(e.target.value)}
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Client Secret</Text>
                    <TextInput
                        className="w-2/3"
                        value={clientSecret}
                        onChange={(e) => setClientSecret(e.target.value)}
                    />
                </Flex>
                <Flex flexDirection="row">
                    <Text className="text-red-600 pt-4">{error}</Text>
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
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
            </Flex>
        </Flex>
    )
}
