import { useState } from 'react'
import { Bold, Button, Divider, Flex, Text, TextInput } from '@tremor/react'

interface IStep {
    onNext: any
    onPrevious: any
}

export default function SecondStep({ onNext, onPrevious }: IStep) {
    const [appId, setAppId] = useState('')
    const [tenId, setTenId] = useState('')
    const [secId, setSecId] = useState('')

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">Deploy IAM Role</Bold>
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
                    <Text>Tenant ID</Text>
                    <TextInput
                        className="w-2/3"
                        value={tenId}
                        onChange={(e) => setTenId(e.target.value)}
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Secret ID</Text>
                    <TextInput
                        className="w-2/3"
                        value={secId}
                        onChange={(e) => setSecId(e.target.value)}
                    />
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Back
                </Button>
                <Button
                    disabled={!(appId.length && tenId.length && secId.length)}
                    onClick={() => onNext({ appId, tenId, secId })}
                    className="ml-3"
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
