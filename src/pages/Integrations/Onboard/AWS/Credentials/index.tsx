import { RadioGroup } from '@headlessui/react'
import { Bold, Button, Flex, Text, TextInput } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useIntegrationApiV1CredentialsAwsCreate } from '../../../../../api/integration.gen'
import { errorHandling, getErrorMessage } from '../../../../../types/apierror'
import { Alert } from '@cloudscape-design/components'

interface ICredential {
    onClose: () => void
    onNext: () => void
    isOrg: boolean
    errormsg: string
    credentials: any
    setCredentials: Function
    errorField: string
}

export function Credential({
    onClose,
    onNext,
    isOrg,
    errormsg,
    credentials,
    setCredentials,
    errorField,
}: ICredential) {
    return (
        <>
            <Flex
                flexDirection="col"
                className="w-full gap-2 mt-5"
                alignItems="start"
            >
                <div className="">
                    Please enter your Account credentials
                </div>
                <TextInput
                    placeholder="IAM Access Key"
                    value={credentials?.accessKey}
                    onValueChange={(v) => {
                        setCredentials({ ...credentials, accessKey: v })
                    }}
                />
                <TextInput
                    placeholder="IAM Secret Key"
                    value={credentials?.secretKey}
                    onValueChange={(v) => {
                        setCredentials({ ...credentials, secretKey: v })
                    }}
                />
                <TextInput
                    placeholder="Role Name"
                    value={credentials?.roleName}
                    onValueChange={(v) => {
                        setCredentials({ ...credentials, roleName: v })
                    }}
                />
                {/* <TextInput
                        placeholder="External ID"
                        value={externalID}
                        onValueChange={(v) => setExternalID(v)}
                    /> */}
                {errormsg !== '' && (
                    <Alert
                        statusIconAriaLabel="Error"
                        type="error"
                        className="w-full"
                        header="Your account is not onboarded"
                    >
                        {errormsg}
                    </Alert>
                )}
                {errorField !== '' && (
                    <Alert
                        className="w-full"
                        statusIconAriaLabel="Error"
                        type="error"
                        header=""
                    >
                        {errorField}
                    </Alert>
                )}
            </Flex>
            {/* // <Flex flexDirection="col" className="h-full"> */}
            {/* <Flex flexDirection="col" alignItems="start"> */}
            {/* <Bold className="text-gray-800 font-bold">
                    Please enter your account credentials:
                </Bold> */}

            {/* </Flex> */}
            {/* <Flex flexDirection="row" justifyContent="end">
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
            </Flex> */}
            {/* </Flex> */}
        </>
    )
}
