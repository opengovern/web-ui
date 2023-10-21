import { Button, Divider, Flex, Select, SelectItem, Text } from '@tremor/react'
import { useState } from 'react'

interface IStep {
    onNext: (event: string, compliance: string) => void
    onBack: () => void
}

export default function StepOne({ onNext, onBack }: IStep) {
    const [event, setEvent] = useState('')
    const [compliance, setCompliance] = useState('')

    const renderOption = () => {
        switch (event) {
            case 'compliance':
                return (
                    <>
                        <Divider />
                        <Text className="mb-4">
                            Choose your compliance and press next
                        </Text>
                        <Flex>
                            <Text className="text-gray-800">Compliance</Text>
                            <Select
                                value={compliance}
                                onValueChange={setCompliance}
                                className="w-1/2"
                            >
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                            </Select>
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
                    <Text>1/4.</Text>
                    <Text className="text-gray-800 font-semibold">Trigger</Text>
                </Flex>
                <Flex>
                    <Text className="text-gray-800">Event on</Text>
                    <Select
                        className="w-1/2"
                        value={event}
                        onValueChange={setEvent}
                    >
                        <SelectItem value="compliance">
                            <Text>Compliance evaluation</Text>
                        </SelectItem>
                        <Flex className="relative">
                            <div className="absolute w-full h-full top-0 left-0 z-10" />
                            <SelectItem value="spend">
                                <Flex justifyContent="start" className="gap-1">
                                    <Text>Spend</Text>
                                    <Text color="blue">Coming soon</Text>
                                </Flex>
                            </SelectItem>
                        </Flex>
                        <Flex className="relative">
                            <div className="absolute w-full h-full top-0 left-0 z-10" />
                            <SelectItem value="insight">
                                <Flex justifyContent="start" className="gap-1">
                                    <Text>Insight evaluation</Text>
                                    <Text color="blue">Coming soon</Text>
                                </Flex>
                            </SelectItem>
                        </Flex>
                        <Flex className="relative">
                            <div className="absolute w-full h-full top-0 left-0 z-10" />
                            <SelectItem value="discovery">
                                <Flex justifyContent="start" className="gap-1">
                                    <Text>Discovery</Text>
                                    <Text color="blue">Coming soon</Text>
                                </Flex>
                            </SelectItem>
                        </Flex>
                        <Flex className="relative">
                            <div className="absolute w-full h-full top-0 left-0 z-10" />
                            <SelectItem value="asset">
                                <Flex justifyContent="start" className="gap-1">
                                    <Text>Asset analytics</Text>
                                    <Text color="blue">Coming soon</Text>
                                </Flex>
                            </SelectItem>
                        </Flex>
                    </Select>
                </Flex>
                {event.length > 0 && renderOption()}
            </Flex>
            <Flex justifyContent="end" className="gap-4">
                <Button variant="secondary" onClick={onBack}>
                    Close
                </Button>
                <Button
                    disabled={event.length < 1 || compliance.length < 1}
                    onClick={() => onNext(event, compliance)}
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
