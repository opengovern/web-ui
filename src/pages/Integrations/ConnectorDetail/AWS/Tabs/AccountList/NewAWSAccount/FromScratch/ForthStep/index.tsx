import { Bold, Button, Divider, Flex, Text, TextInput } from '@tremor/react'
import { useState } from 'react'

interface IStep {
    accountID: string
    onNext: (accountID: string) => void
    onPrevious: () => void
}

export default function ForthStep({ accountID, onNext, onPrevious }: IStep) {
    const [accountName, setAccountName] = useState('')
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">
                    <span className="text-gray-400">4/5</span>. Specify Account
                    Name
                </Bold>
                <Text className="mb-3">
                    Your account is added, this is your{' '}
                    <Bold>Account ID: {accountID}</Bold>
                </Text>
                <Flex flexDirection="row">
                    <Text>Account Name</Text>
                    <TextInput
                        className="w-2/3"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                    />
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Close
                </Button>
                <Button onClick={() => onNext(accountName)} className="ml-3">
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
