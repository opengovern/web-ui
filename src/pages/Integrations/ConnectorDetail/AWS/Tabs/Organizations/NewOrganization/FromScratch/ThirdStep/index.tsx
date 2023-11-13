import { Bold, Button, Divider, Flex, Text, TextInput } from '@tremor/react'
import { useState } from 'react'

interface IStep {
    onNext: (
        accessKey: string,
        secretKey: string,
        roleName: string,
        adminRoleName: string,
        externalId: string,
        policyName: string
    ) => void
    onPrevious: () => void
}

export default function ThirdStep({ onNext, onPrevious }: IStep) {
    const [accessKey, setAccessKey] = useState('')
    const [secretKey, setSecretKey] = useState('')
    const [roleName, setRoleName] = useState('')
    const [externalId, setExternalId] = useState('')
    const [adminRoleName, setAdminRoleName] = useState('')
    const [policyName, setPolicyName] = useState('')
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">AWS Account information</Bold>
                <Text className="mb-3">
                    Check everything before submit your organization
                </Text>
                <Flex flexDirection="row">
                    <Text>Access Key</Text>
                    <TextInput
                        className="w-2/3"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Secret Key</Text>
                    <TextInput
                        className="w-2/3"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Role Name</Text>
                    <TextInput
                        className="w-2/3"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Admin Role Name</Text>
                    <TextInput
                        className="w-2/3"
                        value={adminRoleName}
                        onChange={(e) => setAdminRoleName(e.target.value)}
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>External ID</Text>
                    <TextInput
                        className="w-2/3"
                        value={externalId}
                        onChange={(e) => setExternalId(e.target.value)}
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Policy Name</Text>
                    <TextInput
                        className="w-2/3"
                        value={policyName}
                        onChange={(e) => setPolicyName(e.target.value)}
                    />
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Back
                </Button>
                <Button
                    disabled={
                        accessKey === '' || secretKey === '' || roleName === ''
                    }
                    onClick={() =>
                        onNext(
                            accessKey,
                            secretKey,
                            roleName,
                            adminRoleName,
                            externalId,
                            policyName
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
