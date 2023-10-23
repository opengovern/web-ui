import {
    Button,
    Divider,
    Flex,
    Select,
    SelectItem,
    Text,
    TextInput,
} from '@tremor/react'
import { useState } from 'react'
import { useAlertingApiV1ActionCreateCreate } from '../../../../../api/alerting.gen'

interface IStep {
    onNext: () => void
    onBack: () => void
}

export default function StepThree({ onNext, onBack }: IStep) {
    const [alert, setAlert] = useState('')
    const [method, setMethod] = useState('')
    const [url, setUrl] = useState('')
    const [header, setHeader] = useState('')
    const [body, setBody] = useState('')

    const { response, isLoading, isExecuted, sendNow } =
        useAlertingApiV1ActionCreateCreate(
            { body, headers: { header }, method, url },
            {},
            false
        )
    console.log(response)

    const renderOption = () => {
        switch (alert) {
            case 'webhook':
                return (
                    <>
                        <Divider />
                        <Text className="mb-6">
                            You need to fill the following information about
                            your Webhook account
                        </Text>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">Method</Text>
                            <TextInput
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-2/3"
                            />
                        </Flex>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">URL</Text>
                            <TextInput
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-2/3"
                            />
                        </Flex>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">Headers</Text>
                            <TextInput
                                value={header}
                                onChange={(e) => setHeader(e.target.value)}
                                className="w-2/3"
                            />
                        </Flex>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">Body</Text>
                            <TextInput
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="w-2/3"
                            />
                        </Flex>
                    </>
                )
            case 'slack':
                return (
                    <>
                        <Divider />
                        <Text className="mb-6">
                            You need to paste your Slack URL here
                        </Text>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">URL</Text>
                            <TextInput className="w-2/3" />
                        </Flex>
                    </>
                )
            default:
                return <div />
        }
    }

    return (
        <Flex flexDirection="col" className="h-full max-h-screen">
            <Flex flexDirection="col" alignItems="start">
                <Flex justifyContent="start" className="gap-1 mb-6">
                    <Text>3/4.</Text>
                    <Text className="text-gray-800 font-semibold">Action</Text>
                </Flex>
                <Flex>
                    <Text className="text-gray-800">Alert type</Text>
                    <Select
                        className="w-2/3"
                        value={alert}
                        onValueChange={setAlert}
                    >
                        <SelectItem value="webhook">
                            <Text>Webhook</Text>
                        </SelectItem>
                        <Flex className="relative">
                            <div className="absolute w-full h-full top-0 left-0 z-10" />
                            <SelectItem value="slack">
                                <Flex justifyContent="start" className="gap-1">
                                    <Text>Slack</Text>
                                    <Text color="blue">Coming soon</Text>
                                </Flex>
                            </SelectItem>
                        </Flex>
                        <Flex className="relative">
                            <div className="absolute w-full h-full top-0 left-0 z-10" />
                            <SelectItem value="jira">
                                <Flex justifyContent="start" className="gap-1">
                                    <Text>Jira</Text>
                                    <Text color="blue">Coming soon</Text>
                                </Flex>
                            </SelectItem>
                        </Flex>
                    </Select>
                </Flex>
                {renderOption()}
            </Flex>
            <Flex justifyContent="end" className="gap-4">
                <Button variant="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button loading={isExecuted && isLoading} onClick={sendNow}>
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
