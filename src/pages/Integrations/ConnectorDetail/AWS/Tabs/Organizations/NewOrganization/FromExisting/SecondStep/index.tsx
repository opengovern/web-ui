import { useState } from 'react'
import { Bold, Button, Divider, Flex, Text, TextInput } from '@tremor/react'

interface IStep {
    onNext: (roleName: string, externalID: string) => void
    onPrevious: () => void
}

export default function SecondStep({ onNext, onPrevious }: IStep) {
    const [roleName, setRoleName] = useState('')
    const [externalId, setExternalId] = useState('')

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">AWS Account information</Bold>
                <Text className="mb-3">
                    Check everything before submit your organization
                </Text>
                <Flex flexDirection="row">
                    <Text>Role Name</Text>
                    <TextInput
                        className="w-2/3"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                    />
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Back
                </Button>
                <Button
                    onClick={() => onNext(roleName, externalId)}
                    disabled={roleName === '' || externalId === ''}
                    className="ml-3"
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
