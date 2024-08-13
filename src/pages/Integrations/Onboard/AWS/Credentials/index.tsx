import { RadioGroup } from '@headlessui/react'
import { Bold, Button, Flex, Text, TextInput } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useIntegrationApiV1CredentialsAwsCreate } from '../../../../../api/integration.gen'
import { errorHandling, getErrorMessage } from '../../../../../types/apierror'

interface ICredential {
    onClose: () => void
    onNext: () => void
    isOrg: boolean
}

export function Credential({ onClose, onNext, isOrg }: ICredential) {
    const [accessKey, setAccessKey] = useState('')
    const [secretKey, setSecretKey] = useState('')
    const [roleName, setRoleName] = useState('')
    const [externalID, setExternalID] = useState('')

    const { isLoading, isExecuted, error, sendNow } =
        useIntegrationApiV1CredentialsAwsCreate(
            {
                config: {
                    assumeRoleName: roleName,
                    externalId: externalID,
                    accessKey,
                    secretKey,
                },
            },
            {},
            false
        )
    const errorMsg = getErrorMessage(error)

    useEffect(() => {
        if (isExecuted && !isLoading) {
            if (errorMsg === '') {
                onNext()
            }
        }
    }, [isLoading])

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="text-gray-800 font-bold">
                    Please enter your account credentials:
                </Bold>
                <Flex
                    flexDirection="col"
                    className="w-full gap-2 mt-5"
                    alignItems="start"
                >
                    <TextInput
                        placeholder="IAM Access Key"
                        value={accessKey}
                        onValueChange={(v) => setAccessKey(v)}
                    />
                    <TextInput
                        placeholder="IAM Secret Key"
                        value={secretKey}
                        onValueChange={(v) => setSecretKey(v)}
                    />
                    <TextInput
                        placeholder="Role Name"
                        value={roleName}
                        onValueChange={(v) => setRoleName(v)}
                    />
                    <TextInput
                        placeholder="External ID"
                        value={externalID}
                        onValueChange={(v) => setExternalID(v)}
                    />
                    {errorMsg !== '' && (
                        <Text className="text-red-500">{errorMsg}</Text>
                    )}
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button
                    loading={isExecuted && isLoading}
                    onClick={() => sendNow()}
                    className="ml-3"
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
