import { Bold, Button, Divider, Flex, Text, TextInput } from '@tremor/react'
import { useState } from 'react'

interface IKeyData {
    roleArn: string
    accountID: string
}

interface IStep {
    error: any
    onNext: (data: IKeyData) => void
    onPrevious: () => void
}

export default function ThirdStep({ error, onNext, onPrevious }: IStep) {
    const [data, setData] = useState<IKeyData>({
        roleArn: '',
        accountID: '',
    })
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">
                    <span className="text-gray-400">3/5</span>. Keys
                </Bold>
                <Text className="mb-3">Provide the Keys the CLI generates</Text>
                <Flex flexDirection="row">
                    <Text>Role ARN</Text>
                    <TextInput
                        className="w-2/3"
                        value={data.roleArn}
                        onChange={(e) =>
                            setData({ ...data, roleArn: e.target.value })
                        }
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Account ID</Text>
                    <TextInput
                        className="w-2/3"
                        value={data.accountID}
                        onChange={(e) =>
                            setData({ ...data, accountID: e.target.value })
                        }
                    />
                </Flex>
                <Flex flexDirection="row">
                    <Text className="text-red-600 pt-4">{String(error)}</Text>
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Back
                </Button>
                <Button
                    disabled={data.roleArn === '' || data.accountID === ''}
                    onClick={() => onNext(data)}
                    className="ml-3"
                >
                    Create Account
                </Button>
            </Flex>
        </Flex>
    )
}
