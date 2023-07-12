import { Bold, Button, Divider, Flex, Text, TextInput } from '@tremor/react'
import { useState } from 'react'

interface IKeyData {
    accessKey: string
    secretKey: string
}

interface IStep {
    error: any
    onNext: (data: IKeyData) => void
    onPrevious: () => void
}

export default function ThirdStep({ error, onNext, onPrevious }: IStep) {
    const [data, setData] = useState<IKeyData>({
        accessKey: '',
        secretKey: '',
    })
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">
                    <span className="text-gray-400">3/5</span>. Keys
                </Bold>
                <Text className="mb-3">Provide the Keys the CLI generates</Text>
                <Flex flexDirection="row">
                    <Text>Access Key</Text>
                    <TextInput
                        className="w-2/3"
                        value={data.accessKey}
                        onChange={(e) =>
                            setData({ ...data, accessKey: e.target.value })
                        }
                    />
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Secret Key</Text>
                    <TextInput
                        className="w-2/3"
                        value={data.secretKey}
                        onChange={(e) =>
                            setData({ ...data, secretKey: e.target.value })
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
                    disabled={data.accessKey === '' || data.secretKey === ''}
                    onClick={() => onNext(data)}
                    className="ml-3"
                >
                    Create Account
                </Button>
            </Flex>
        </Flex>
    )
}
